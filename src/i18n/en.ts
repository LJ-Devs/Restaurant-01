/**
 * Interface texts in English: buttons, labels, notes.
 * Must have exactly the same keys as `pt.ts` (your editor will complain otherwise).
 *
 * Words in {curly braces} are filled in automatically, e.g. {time} → "15:00".
 */

import type { UIStrings } from './pt';

export const en: UIStrings = {
  meta: {
    htmlLang: 'en',
    ogLocale: 'en_GB',
    languageName: 'English',
    menuTitle: 'Menu and prices',
    privacyTitle: 'Privacy policy',
    privacyDescription: 'How we handle your personal data. This website uses no cookies and no analytics.',
  },
  a11y: {
    skipToContent: 'Skip to content',
    mainNav: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    otherLanguage: 'Versão em português',
    newTab: '(opens in a new tab)',
    quickContact: 'Quick contact',
    stars: '{rating} out of 5 stars',
    home: 'Home page',
  },
  nav: {
    about: 'About us',
    dishes: 'Dishes',
    menu: 'Menu',
    reviews: 'Reviews',
    hours: 'Opening hours',
    location: 'Location',
    contact: 'Contact',
  },
  sectionIds: {
    about: 'about',
    dishes: 'dishes',
    reviews: 'reviews',
    hours: 'hours',
    location: 'location',
    contact: 'contact',
  },
  cta: {
    book: 'Book a table',
    viewMenu: 'See the menu',
    call: 'Call',
    whatsapp: 'WhatsApp',
    directions: 'Get directions',
    fullMenu: 'See the full menu',
    allReviews: 'See all reviews on Google',
    print: 'Print menu',
    backHome: 'Back to the home page',
    backToTop: 'Back to top',
  },
  about: {
    eyebrow: 'Our story',
  },
  dishes: {
    eyebrow: 'From our kitchen',
    title: 'House specialities',
    from: 'from {price}',
  },
  reviews: {
    eyebrow: 'Our guests',
    title: 'What people say',
    count: '{count} reviews on Google',
    by: 'Review by {name}',
  },
  hours: {
    eyebrow: 'When we’re open',
    title: 'Opening hours',
    day: 'Day',
    time: 'Hours',
    closed: 'Closed',
    today: 'Today',
    openNow: 'Open now',
    closedNow: 'Closed now',
    closesAt: 'closes at {time}',
    opensAt: 'opens at {time}',
    opensTomorrow: 'opens tomorrow at {time}',
    opensOn: 'opens {day} at {time}',
    timezone: 'Times are in Portugal (Lisbon) time.',
  },
  weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  weekdaysOn: ['on Monday', 'on Tuesday', 'on Wednesday', 'on Thursday', 'on Friday', 'on Saturday', 'on Sunday'],
  location: {
    eyebrow: 'Find us',
    title: 'Location',
    showMap: 'Show map',
    mapNotice:
      'The map is provided by Google and only loads if you click the button. Google then receives data such as your IP address.',
    mapTitle: 'Map showing the location of {name}',
  },
  contact: {
    eyebrow: 'Get in touch',
    title: 'Contact',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    whatsappAction: 'Send a message',
    email: 'Email',
    social: 'Social media',
    followOn: 'Follow us on {network}',
    callLandline: 'Call to a Portuguese landline',
    callMobile: 'Call to a Portuguese mobile network',
  },
  footer: {
    complaints: 'Complaints Book',
    complaintsLong: 'Livro de Reclamações (Electronic Complaints Book)',
    privacy: 'Privacy policy',
    nif: 'Tax no. (NIF)',
    rights: 'All rights reserved.',
    disputeResolution: 'In case of a dispute, consumers may contact the following alternative dispute resolution body:',
    demo: 'Demo website: {name} is a fictional business and the contact details are not real.',
    info: 'Information',
  },
  menu: {
    eyebrow: 'What we serve',
    title: 'Menu',
    categories: 'Menu categories',
    vat: 'Prices in euros, VAT included at the current legal rate.',
    allergens:
      'Do you have a food allergy or intolerance? Please tell us before ordering: allergen information is available for every dish.',
    legend: 'Key',
    tags: {
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
      'gluten-free': 'Gluten-free',
    },
    printHeading: 'Menu',
  },
  privacy: {
    eyebrow: 'Legal information',
  },
  notFound: {
    title: 'Page not found',
    text: 'The page you are looking for does not exist or has moved.',
  },
};
