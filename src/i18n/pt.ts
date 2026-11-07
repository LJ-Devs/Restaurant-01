/**
 * Interface texts in European Portuguese (pt-PT): buttons, labels, notes.
 * These are the same for every client. Client content lives in src/config/.
 *
 * Words in {curly braces} are filled in automatically, e.g. {time} → "15:00".
 */

export const pt = {
  meta: {
    htmlLang: 'pt-PT',
    ogLocale: 'pt_PT',
    languageName: 'Português',
    menuTitle: 'Menu e preços',
    privacyTitle: 'Política de privacidade',
    privacyDescription: 'Como tratamos os seus dados pessoais. Este site não usa cookies nem ferramentas de estatística.',
  },
  a11y: {
    skipToContent: 'Saltar para o conteúdo',
    mainNav: 'Navegação principal',
    mobileNav: 'Navegação do site',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    otherLanguage: 'English version',
    newTab: '(abre num novo separador)',
    quickContact: 'Contacto rápido',
    stars: '{rating} em 5 estrelas',
    home: 'Página inicial',
  },
  nav: {
    about: 'Sobre nós',
    dishes: 'Pratos',
    menu: 'Menu',
    reviews: 'Opiniões',
    hours: 'Horário',
    location: 'Localização',
    contact: 'Contactos',
  },
  /** Anchors in the page address, e.g. /#horario. Lowercase, no accents. */
  sectionIds: {
    about: 'sobre',
    dishes: 'pratos',
    reviews: 'opinioes',
    hours: 'horario',
    location: 'localizacao',
    contact: 'contactos',
  },
  cta: {
    book: 'Reservar mesa',
    bookShort: 'Reservar',
    viewMenu: 'Ver menu',
    call: 'Ligar',
    whatsapp: 'WhatsApp',
    directions: 'Como chegar',
    fullMenu: 'Ver o menu completo',
    allReviews: 'Ver todas as avaliações no Google',
    print: 'Imprimir menu',
    backHome: 'Voltar à página inicial',
    backToTop: 'Voltar ao topo',
  },
  daily: {
    label: 'Prato do dia',
  },
  about: {
    eyebrow: 'A nossa história',
  },
  dishes: {
    eyebrow: 'Da nossa cozinha',
    title: 'Pratos da casa',
    from: 'desde {price}',
  },
  reviews: {
    eyebrow: 'Quem nos visita',
    title: 'O que dizem de nós',
    count: '{count} avaliações no Google',
    by: 'Avaliação de {name}',
  },
  hours: {
    eyebrow: 'Quando abrimos',
    title: 'Horário',
    day: 'Dia',
    time: 'Horário',
    closed: 'Encerrado',
    today: 'Hoje',
    openNow: 'Aberto agora',
    closedNow: 'Fechado agora',
    closesAt: 'fecha às {time}',
    opensAt: 'abre às {time}',
    opensTomorrow: 'abre amanhã às {time}',
    opensOn: 'abre {day} às {time}',
    timezone: 'Horas de Portugal continental.',
  },
  /** Week starts on Monday, as in Portugal. */
  weekdays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'],
  /** Used in "abre {day} às 12:00" (short forms keep the badge on one line). */
  weekdaysOn: ['na segunda', 'na terça', 'na quarta', 'na quinta', 'na sexta', 'no sábado', 'no domingo'],
  location: {
    eyebrow: 'Onde estamos',
    title: 'Localização',
    showMap: 'Mostrar mapa',
    mapNotice:
      'O mapa é fornecido pela Google e só é carregado se clicar no botão. Nessa altura, a Google recebe dados como o seu endereço IP.',
    mapTitle: 'Mapa com a localização de {name}',
  },
  contact: {
    eyebrow: 'Fale connosco',
    title: 'Contactos',
    phone: 'Telefone',
    whatsapp: 'WhatsApp',
    whatsappAction: 'Enviar mensagem',
    email: 'Email',
    social: 'Redes sociais',
    followOn: 'Siga-nos no {network}',
    /** Required next to phone numbers in Portugal (Decreto-Lei n.º 59/2021). */
    callLandline: 'Chamada para a rede fixa nacional',
    callMobile: 'Chamada para a rede móvel nacional',
  },
  footer: {
    complaints: 'Livro de Reclamações',
    complaintsLong: 'Livro de Reclamações Eletrónico',
    privacy: 'Política de privacidade',
    nif: 'NIF',
    rights: 'Todos os direitos reservados.',
    disputeResolution:
      'Em caso de litígio, o consumidor pode recorrer à seguinte entidade de resolução alternativa de litígios de consumo:',
    demo: 'Site de demonstração: {name} é um negócio fictício e os contactos não são reais.',
    info: 'Informações',
  },
  menu: {
    eyebrow: 'O que servimos',
    title: 'Menu',
    categories: 'Categorias do menu',
    vat: 'Preços em euros, com IVA incluído à taxa legal em vigor.',
    allergens:
      'Tem alguma alergia ou intolerância alimentar? Informe-nos antes de pedir: temos disponível a informação sobre os alergénios de todos os pratos.',
  },
  privacy: {
    eyebrow: 'Informação legal',
  },
  notFound: {
    title: 'Página não encontrada',
    text: 'A página que procura não existe ou mudou de endereço.',
  },
};

export type UIStrings = typeof pt;
