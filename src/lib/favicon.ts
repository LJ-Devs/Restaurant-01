/**
 * Default site icon: an azulejo flower in the brand colour.
 * Generated automatically for every client, so no icon file is needed.
 */
export function faviconSvg(background: string, foreground: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${background}"/>
  <g fill="${foreground}">
    <path d="M32 7c5.6 7.2 5.6 14.4 0 21.6C26.4 21.4 26.4 14.2 32 7zM32 57c-5.6-7.2-5.6-14.4 0-21.6 5.6 7.2 5.6 14.4 0 21.6zM7 32c7.2-5.6 14.4-5.6 21.6 0C21.4 37.6 14.2 37.6 7 32zM57 32c-7.2 5.6-14.4 5.6-21.6 0 7.2-5.6 14.4-5.6 21.6 0z"/>
    <circle cx="32" cy="32" r="3.6"/>
    <path d="M15 15c5.8.5 9.3 3.2 10.6 8.2-5-1.3-7.7-4.8-10.6-8.2zM49 15c-.5 5.8-3.2 9.3-8.2 10.6 1.3-5 4.8-7.7 8.2-10.6zM49 49c-5.8-.5-9.3-3.2-10.6-8.2 5 1.3 7.7 4.8 10.6 8.2zM15 49c.5-5.8 3.2-9.3 8.2-10.6-1.3 5-4.8 7.7-8.2 10.6z" opacity=".85"/>
  </g>
</svg>`;
}
