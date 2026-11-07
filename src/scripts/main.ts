/**
 * The only JavaScript of the site (a few KB). Every feature checks whether
 * its HTML is on the page, and the site still works if this script fails.
 */
import { getOpenStatus, nowInLisbon, toTime, type Schedule } from '../lib/hours';

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

/** Mobile menu (a <details> element): close it after choosing a link, with Escape or by clicking outside. */
function initMobileNav() {
  const menu = document.querySelector<HTMLDetailsElement>('[data-mobile-nav]');
  if (!menu) return;
  const summary = menu.querySelector('summary');
  menu.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) menu.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      summary?.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (menu.open && !menu.contains(event.target as Node)) menu.open = false;
  });
}

/** Language switch: keep the visitor on the same section (/#horario → /en/#hours). */
function initLanguageSwitch() {
  document.querySelectorAll<HTMLAnchorElement>('[data-lang-switch]').forEach((link) => {
    link.addEventListener('click', () => {
      const hash = decodeURIComponent(location.hash.slice(1));
      if (!hash) return;
      const map = JSON.parse(link.dataset.hashMap ?? '{}') as Record<string, string>;
      const target = map[hash];
      if (target) link.href = `${link.href.split('#')[0]}#${target}`;
    });
  });
}

interface HoursData {
  schedule: Schedule;
  weekdaysOn: string[];
  strings: Record<'openNow' | 'closedNow' | 'closesAt' | 'opensAt' | 'opensTomorrow' | 'opensOn', string>;
}

/** "Aberto agora / Fechado agora" badges and today's row in the hours table (Europe/Lisbon time). */
function initOpenStatus() {
  const dataElement = document.getElementById('hours-data');
  if (!dataElement?.textContent) return;
  const data = JSON.parse(dataElement.textContent) as HoursData;
  const s = data.strings;

  const update = () => {
    const now = nowInLisbon();
    if (now.dayIndex < 0) return;
    const status = getOpenStatus(data.schedule, now.dayIndex, now.minutes);

    let detail = '';
    if (status.isOpen && status.closesAt !== undefined) {
      detail = fill(s.closesAt, { time: toTime(status.closesAt) });
    } else if (status.next) {
      const time = toTime(status.next.at);
      if (status.next.inDays === 0) detail = fill(s.opensAt, { time });
      else if (status.next.inDays === 1) detail = fill(s.opensTomorrow, { time });
      else detail = fill(s.opensOn, { day: data.weekdaysOn[status.next.dayIndex], time });
    }
    const label = status.isOpen ? s.openNow : s.closedNow;

    document.querySelectorAll<HTMLElement>('[data-open-status]').forEach((badge) => {
      badge.dataset.state = status.isOpen ? 'open' : 'closed';
      const text = badge.querySelector('[data-open-status-text]');
      if (text) text.textContent = detail ? `${label} · ${detail}` : label;
      badge.hidden = false;
    });

    document.querySelectorAll<HTMLElement>('tr[data-day]').forEach((row) => {
      const isToday = Number(row.dataset.day) === now.dayIndex;
      if (isToday) row.setAttribute('aria-current', 'date');
      else row.removeAttribute('aria-current');
      row.querySelector<HTMLElement>('[data-today-label]')?.toggleAttribute('hidden', !isToday);
    });
  };

  // Run after the page has been drawn (the time-zone lookup is slow on cheap phones).
  const start = () => {
    update();
    window.setInterval(update, 60_000);
  };
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(start, { timeout: 1500 });
  else setTimeout(start, 200);
}

/** Google map: only loaded after the visitor clicks (no request to Google before that). */
function initMaps() {
  document.querySelectorAll<HTMLElement>('[data-map]').forEach((box) => {
    const trigger = box.querySelector<HTMLElement>('[data-map-load]');
    trigger?.addEventListener('click', (event) => {
      event.preventDefault();
      const iframe = document.createElement('iframe');
      iframe.src = box.dataset.mapSrc ?? '';
      iframe.title = box.dataset.mapTitle ?? '';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      iframe.className = 'absolute inset-0 size-full border-0';
      box.replaceChildren(iframe);
      iframe.focus();
    });
  });
}

/** Menu page: highlight the category being read and keep its tab visible. */
function initMenuTabs() {
  const list = document.querySelector<HTMLElement>('[data-menu-tabs]');
  if (!list) return;
  const links = [...list.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  const sections = links
    .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
    .filter((section): section is HTMLElement => section !== null);

  let currentId = '';
  const setActive = (id: string) => {
    if (id === currentId) return;
    currentId = id;
    for (const link of links) {
      const active = link.hash === `#${id}`;
      if (active) {
        link.setAttribute('aria-current', 'true');
        const left = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
        list.scrollTo({ left, behavior: 'smooth' });
      } else {
        link.removeAttribute('aria-current');
      }
    }
  };

  // The active category is the last one whose top has passed 40% of the screen height.
  const update = () => {
    const line = window.innerHeight * 0.4;
    let current = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= line) current = section;
    if (current) setActive(current.id);
  };
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/** "Imprimir menu" button (hidden when JavaScript is off). */
function initPrint() {
  document.querySelectorAll<HTMLButtonElement>('[data-print]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => window.print());
  });
}

for (const init of [initMobileNav, initLanguageSwitch, initOpenStatus, initMaps, initMenuTabs, initPrint]) {
  try {
    init();
  } catch (error) {
    console.error(error);
  }
}
