/**
 * Second example client: "Pastelaria Sol", a FICTIONAL café and pastry shop in Faro.
 *
 * It exists to show that the same template works for a different kind of business,
 * with other colours, fonts, opening hours, a logo, a notice bar and an
 * "order a cake" button instead of "book a table".
 *
 * Preview it with:  npm run dev:sol
 * (or set the environment variable SITE_CONFIG=pastelaria-sol)
 */

import type { SiteConfig } from './types';

const config: SiteConfig = {
  id: 'pastelaria-sol',
  url: 'https://pastelaria-sol.example.com',
  isDemo: true,

  businessType: 'Bakery',
  name: 'Pastelaria Sol',
  tagline: {
    pt: 'Bolos acabados de fazer, doces do Algarve e café a sério, no centro de Faro.',
    en: 'Freshly baked cakes, Algarve sweets and proper coffee in the heart of Faro.',
  },
  cuisine: {
    pt: 'Pastelaria e café',
    en: 'Pastry shop & café',
  },
  priceRange: '€',

  seo: {
    title: {
      pt: 'Pastelaria Sol · Pastelaria e café no centro de Faro',
      en: 'Pastelaria Sol · Pastry shop and café in central Faro',
    },
    description: {
      pt: 'Pastéis de nata quentes, Dom Rodrigos, folar de Olhão e bolos de aniversário por encomenda. Aberto todos os dias, no centro de Faro.',
      en: 'Warm pastéis de nata, Dom Rodrigos, folar de Olhão and birthday cakes to order. Open every day in central Faro.',
    },
    menuDescription: {
      pt: 'Preçário da Pastelaria Sol: pastelaria, doces do Algarve, salgados, cafés e sumos naturais. Opções vegan e sem glúten assinaladas.',
      en: 'Pastelaria Sol price list: pastries, Algarve sweets, savoury snacks, coffee and fresh juices. Vegan and gluten-free options marked.',
    },
  },

  notice: {
    pt: 'Bolos de aniversário por encomenda, com 48 horas de antecedência.',
    en: 'Birthday cakes made to order: please order 48 hours in advance.',
  },

  story: {
    title: {
      pt: 'Três gerações de pasteleiros',
      en: 'Three generations of pastry makers',
    },
    text: {
      pt: 'A Pastelaria Sol abriu em 1972, na Baixa de Faro, pelas mãos do senhor Joaquim e da dona Graça. Hoje é a neta, Inês, quem acende o forno todas as madrugadas.\n\nOs pastéis de nata saem quentes a toda a hora e os doces algarvios seguem as receitas de sempre, com amêndoa, figo e alfarroba da região. Para acompanhar, há galão, torradas e sumo de laranja do Algarve, espremido na hora.',
      en: 'Pastelaria Sol opened in 1972 in downtown Faro, run by Mr Joaquim and Mrs Graça. Today their granddaughter, Inês, lights the oven before dawn every morning.\n\nPastéis de nata come out warm all day long, and our Algarve sweets follow the old recipes, with local almonds, figs and carob. To go with them: a galão, buttered toast and Algarve orange juice, squeezed to order.',
    },
  },

  address: {
    street: 'Rua das Laranjeiras, 8',
    postalCode: '8000-000',
    city: 'Faro',
    region: 'Faro',
    country: 'PT',
  },
  geo: { lat: 37.0161, lng: -7.9348 },
  map: {
    embed: true,
    zoom: 17,
  },

  contact: {
    phone: '+351 900 000 000',
    whatsapp: '+351 900 000 000',
    email: 'encomendas@example.com',
  },

  booking: {
    label: { pt: 'Encomendar bolo', en: 'Order a cake' },
    message: {
      pt: 'Olá! Gostaria de encomendar um bolo.\n\nTipo de bolo:\nPara quantas pessoas:\nDia de levantamento:\nNome:',
      en: 'Hello! I’d like to order a cake.\n\nType of cake:\nNumber of people:\nPick-up date:\nName:',
    },
  },

  hours: {
    monday: [{ open: '07:30', close: '19:30' }],
    tuesday: [{ open: '07:30', close: '19:30' }],
    wednesday: [{ open: '07:30', close: '19:30' }],
    thursday: [{ open: '07:30', close: '19:30' }],
    friday: [{ open: '07:30', close: '19:30' }],
    saturday: [{ open: '08:00', close: '19:30' }],
    sunday: [{ open: '08:00', close: '13:00' }],
  },
  hoursNote: {
    pt: 'Os pastéis de nata saem do forno de hora a hora.',
    en: 'Pastéis de nata come out of the oven every hour.',
  },

  menuIntro: {
    pt: 'Tudo é feito na nossa oficina, todos os dias. Os bolos inteiros podem ser encomendados por telefone ou WhatsApp.',
    en: 'Everything is made in our own bakery, every day. Whole cakes can be ordered by phone or WhatsApp.',
  },

  menu: [
    {
      id: 'pastelaria',
      name: { pt: 'Pastelaria', en: 'Pastries' },
      items: [
        {
          id: 'pastel-de-nata',
          name: { pt: 'Pastel de nata', en: 'Pastel de nata' },
          description: {
            pt: 'Massa folhada estaladiça e creme de ovo, quente do forno.',
            en: 'Crisp puff pastry and egg custard, warm from the oven.',
          },
          price: 1.3,
          tags: ['vegetarian'],
          photo: {
            src: 'pastel-de-nata.jpg',
            alt: {
              pt: 'Pastéis de nata dourados com manchas caramelizadas',
              en: 'Golden pastéis de nata with caramelised spots',
            },
          },
        },
        {
          id: 'bola-de-berlim',
          name: { pt: 'Bola de Berlim', en: 'Bola de Berlim (custard doughnut)' },
          description: {
            pt: 'Recheada com creme pasteleiro e passada por açúcar.',
            en: 'Filled with pastry cream and rolled in sugar.',
          },
          price: 1.8,
          tags: ['vegetarian'],
          photo: {
            src: 'bola-de-berlim.jpg',
            alt: {
              pt: 'Bolas de Berlim com creme amarelo e açúcar',
              en: 'Custard-filled doughnuts dusted with sugar',
            },
          },
        },
        {
          id: 'croissant',
          name: { pt: 'Croissant de manteiga', en: 'Butter croissant' },
          price: [
            { label: { pt: 'Simples', en: 'Plain' }, price: 1.4 },
            { label: { pt: 'Misto', en: 'Ham & cheese' }, price: 2.8 },
          ],
        },
        {
          id: 'queque-laranja',
          name: { pt: 'Queque de laranja', en: 'Orange muffin' },
          price: 1.5,
          tags: ['vegetarian'],
        },
      ],
    },
    {
      id: 'doces-algarve',
      name: { pt: 'Doces do Algarve', en: 'Algarve sweets' },
      note: {
        pt: 'Receitas tradicionais, com amêndoa, figo e alfarroba da região.',
        en: 'Traditional recipes with local almonds, figs and carob.',
      },
      items: [
        {
          id: 'dom-rodrigo',
          name: { pt: 'Dom Rodrigo', en: 'Dom Rodrigo' },
          description: {
            pt: 'Fios de ovos, amêndoa e canela, embrulhados em papel colorido.',
            en: 'Egg threads, almond and cinnamon, wrapped in colourful foil.',
          },
          price: 2.2,
          tags: ['vegetarian', 'gluten-free'],
          photo: {
            src: 'dom-rodrigo.jpg',
            alt: {
              pt: 'Doces Dom Rodrigo embrulhados em papel de alumínio colorido',
              en: 'Dom Rodrigo sweets wrapped in colourful foil',
            },
          },
        },
        {
          id: 'folar-de-olhao',
          name: { pt: 'Folar de Olhão (fatia)', en: 'Folar de Olhão (slice)' },
          description: {
            pt: 'Camadas de massa com açúcar mascavado e canela, bem caramelizadas.',
            en: 'Layered sweet bread with brown sugar and cinnamon, deeply caramelised.',
          },
          price: 2.5,
          tags: ['vegetarian'],
          photo: {
            src: 'folar-de-olhao.jpg',
            alt: {
              pt: 'Folar de Olhão caramelizado, visto de cima',
              en: 'Caramelised folar de Olhão, seen from above',
            },
          },
        },
        {
          id: 'torta-de-laranja',
          name: { pt: 'Torta de laranja (fatia)', en: 'Orange roll cake (slice)' },
          description: {
            pt: 'Torta húmida de laranja do Algarve, enrolada à mão.',
            en: 'Moist roll cake made with Algarve oranges, rolled by hand.',
          },
          price: 2.4,
          tags: ['vegetarian'],
          photo: {
            src: 'torta-de-laranja.jpg',
            alt: {
              pt: 'Fatias de torta de laranja em espiral',
              en: 'Slices of orange roll cake showing the spiral',
            },
          },
        },
        {
          id: 'queijinho-figo',
          name: { pt: 'Queijinho de figo', en: 'Fig and almond sweet' },
          price: 1.2,
          tags: ['vegan', 'gluten-free'],
        },
        {
          id: 'bolo-alfarroba',
          name: { pt: 'Bolo de alfarroba (fatia)', en: 'Carob cake (slice)' },
          price: 2.5,
          tags: ['vegetarian'],
        },
      ],
    },
    {
      id: 'salgados',
      name: { pt: 'Salgados e torradas', en: 'Savoury & toast' },
      items: [
        {
          id: 'tosta-mista',
          name: { pt: 'Tosta mista', en: 'Ham and cheese toastie' },
          description: {
            pt: 'Pão de forma, fiambre e queijo, bem tostada.',
            en: 'Sliced bread, ham and cheese, toasted golden.',
          },
          price: 3.2,
          photo: {
            src: 'tosta-mista.jpg',
            alt: {
              pt: 'Tosta mista cortada ao meio, com queijo derretido',
              en: 'Ham and cheese toastie cut in half, with melted cheese',
            },
          },
        },
        {
          id: 'torrada',
          name: { pt: 'Torrada com manteiga', en: 'Buttered toast' },
          price: 1.8,
          tags: ['vegetarian'],
        },
        {
          id: 'rissol-camarao',
          name: { pt: 'Rissol de camarão', en: 'Shrimp rissole' },
          price: 1.6,
        },
        {
          id: 'empada-galinha',
          name: { pt: 'Empada de galinha', en: 'Chicken pie' },
          price: 1.8,
        },
      ],
    },
    {
      id: 'cafetaria',
      name: { pt: 'Cafetaria', en: 'Coffee & tea' },
      items: [
        {
          id: 'cafe',
          name: { pt: 'Café', en: 'Espresso' },
          price: 0.8,
          tags: ['vegan', 'gluten-free'],
        },
        {
          id: 'galao',
          name: { pt: 'Galão', en: 'Galão (milky coffee)' },
          description: {
            pt: 'Café com muito leite, servido em copo alto.',
            en: 'Coffee with plenty of hot milk, served in a tall glass.',
          },
          price: 1.4,
          tags: ['vegetarian', 'gluten-free'],
          photo: {
            src: 'galao.jpg',
            alt: {
              pt: 'Galão em copo alto, visto de cima, com espuma de leite',
              en: 'Galão in a tall glass, seen from above, with milk foam',
            },
          },
        },
        {
          id: 'meia-de-leite',
          name: { pt: 'Meia de leite', en: 'Coffee with milk (cup)' },
          price: 1.3,
          tags: ['vegetarian', 'gluten-free'],
        },
        {
          id: 'cha',
          name: { pt: 'Chá', en: 'Tea' },
          price: 1.2,
          tags: ['vegan', 'gluten-free'],
        },
      ],
    },
    {
      id: 'sumos',
      name: { pt: 'Sumos e frescos', en: 'Juices & cold drinks' },
      items: [
        {
          id: 'sumo-laranja',
          name: { pt: 'Sumo de laranja do Algarve', en: 'Algarve orange juice' },
          description: {
            pt: 'Espremido na hora.',
            en: 'Freshly squeezed.',
          },
          price: [
            { label: { pt: 'Pequeno', en: 'Small' }, price: 2.2 },
            { label: { pt: 'Grande', en: 'Large' }, price: 3.2 },
          ],
          tags: ['vegan', 'gluten-free'],
          photo: {
            src: 'sumo-de-laranja.jpg',
            alt: {
              pt: 'Copo de sumo de laranja natural com laranjas cortadas',
              en: 'Glass of fresh orange juice with halved oranges',
            },
          },
        },
        {
          id: 'limonada',
          name: { pt: 'Limonada caseira', en: 'Homemade lemonade' },
          price: 2.5,
          tags: ['vegan', 'gluten-free'],
        },
        {
          id: 'agua',
          name: { pt: 'Água (33 cl)', en: 'Water (33 cl)' },
          price: [
            { label: { pt: 'Lisa', en: 'Still' }, price: 1 },
            { label: { pt: 'Com gás', en: 'Sparkling' }, price: 1.3 },
          ],
        },
      ],
    },
    {
      id: 'encomendas',
      name: { pt: 'Bolos por encomenda', en: 'Cakes to order' },
      note: {
        pt: 'Encomende com 48 horas de antecedência.',
        en: 'Please order 48 hours in advance.',
      },
      items: [
        {
          id: 'bolo-aniversario',
          name: { pt: 'Bolo de aniversário', en: 'Birthday cake' },
          description: {
            pt: 'Pão de ló com recheio à escolha: chocolate, ovos-moles ou frutos vermelhos.',
            en: 'Sponge cake with your choice of filling: chocolate, egg cream or red berries.',
          },
          price: 22,
          priceNote: { pt: '6 a 8 pessoas', en: 'serves 6–8' },
          tags: ['vegetarian'],
        },
        {
          id: 'torta-inteira',
          name: { pt: 'Torta de laranja inteira', en: 'Whole orange roll cake' },
          price: 14,
          tags: ['vegetarian'],
        },
      ],
    },
  ],

  featuredDishes: [
    'pastel-de-nata',
    'dom-rodrigo',
    'folar-de-olhao',
    'torta-de-laranja',
    'bola-de-berlim',
    'galao',
  ],

  reviews: {
    rating: 4.8,
    count: 527,
    googleUrl: 'https://www.google.com/maps/search/?api=1&query=37.0161%2C-7.9348',
    featured: [
      {
        name: 'Ana',
        rating: 5,
        text: {
          pt: 'Os pastéis de nata são dos melhores que já provei, sempre quentinhos. O galão também é ótimo!',
          en: 'The pastéis de nata are among the best I’ve ever had, always warm. The galão is great too!',
        },
      },
      {
        name: 'Thomas',
        rating: 5,
        text: {
          pt: 'Os melhores pastéis de nata de Faro, ainda quentes do forno. Funcionários simpáticos e bons preços.',
          en: 'Best pastéis de nata in Faro, still warm from the oven. Lovely staff and great prices.',
        },
      },
      {
        name: 'Carla',
        rating: 5,
        text: {
          pt: 'Encomendei o bolo de aniversário da minha filha e foi um sucesso. Bonito e delicioso!',
          en: 'I ordered my daughter’s birthday cake here and it was a hit. Beautiful and delicious!',
        },
      },
      {
        name: 'Lucas',
        rating: 4,
        text: {
          pt: 'Ótimo sítio para tomar o pequeno-almoço antes de passear pela Cidade Velha. Ao domingo de manhã há fila, mas anda depressa.',
          en: 'Great spot for breakfast before exploring the Old Town. There’s a queue on Sunday mornings, but it moves fast.',
        },
      },
    ],
  },

  social: {
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
  },

  images: {
    hero: {
      src: 'hero-tabuleiro-pasteis-de-nata.jpg',
      alt: {
        pt: 'Tabuleiro de pastéis de nata acabados de sair do forno',
        en: 'Tray of pastéis de nata fresh out of the oven',
      },
    },
    about: [
      {
        src: 'sobre-massa-e-farinha.jpg',
        alt: {
          pt: 'Bancada da pastelaria com massa, farinha e rolo da massa',
          en: 'Bakery worktop with dough, flour and a rolling pin',
        },
      },
      {
        src: 'sobre-cafe-e-torrada.jpg',
        alt: {
          pt: 'Café e torrada com manteiga numa mesa de esplanada',
          en: 'Coffee and buttered toast on a café table',
        },
      },
      {
        src: 'sobre-laranjas-do-algarve.jpg',
        alt: {
          pt: 'Laranjas do Algarve inteiras e cortadas ao meio',
          en: 'Whole and halved Algarve oranges',
        },
      },
    ],
    share: 'partilha-redes-sociais.jpg',
    logo: {
      src: 'logo-sol.svg',
      alt: { pt: 'Logótipo da Pastelaria Sol', en: 'Pastelaria Sol logo' },
    },
  },

  theme: {
    colors: {
      primary: '#0E5A6E',
      onPrimary: '#FFFFFF',
      accent: '#9C5500',
      background: '#FFFAF0',
      surface: '#FFFFFF',
      text: '#1D282E',
      muted: '#4F5D64',
      dark: '#0A3542',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Nunito Sans',
    },
  },

  legal: {
    companyName: 'Pastelaria Sol, Doçaria Artesanal, Lda.',
    nif: '000000000',
    disputeResolution: {
      name: 'CIMAAL, Centro de Informação, Mediação e Arbitragem de Conflitos de Consumo do Algarve',
      url: 'https://www.consumoalgarve.pt',
    },
  },
};

export default config;
