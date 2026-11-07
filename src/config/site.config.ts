/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT: this is the only file you need to edit for a new client.
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Demo client: "Tasca do Largo", a FICTIONAL restaurant in Coimbra.
 *  All contact details below are fake on purpose.
 *
 *  Tips
 *  - Every text visitors read has a Portuguese (`pt`) and an English (`en`) version.
 *  - Prices are numbers with a dot: 12.5 is shown as "12,50 €".
 *  - Photos go in `src/assets/images/<id>/` (here: `src/assets/images/tasca-do-largo/`).
 *  - Your editor underlines mistakes in red. `npm run build` also checks everything.
 */

import type { SiteConfig } from './types';

const config: SiteConfig = {
  id: 'tasca-do-largo',
  url: 'https://tasca-do-largo.example.com',
  isDemo: true,

  businessType: 'Restaurant',
  name: 'Tasca do Largo',
  tagline: {
    pt: 'Cozinha de tacho, petiscos e vinho da casa, como antigamente.',
    en: 'Slow-cooked Portuguese food, petiscos and house wine, the way it used to be.',
  },
  cuisine: {
    pt: 'Cozinha tradicional portuguesa',
    en: 'Traditional Portuguese cuisine',
  },
  priceRange: '€€',

  seo: {
    title: {
      pt: 'Tasca do Largo · Restaurante tradicional português em Coimbra',
      en: 'Tasca do Largo · Traditional Portuguese restaurant in Coimbra',
    },
    description: {
      pt: 'Chanfana, leitão, bacalhau e petiscos na Baixa de Coimbra. Almoço e jantar de terça a sábado. Reserve mesa por telefone ou WhatsApp.',
      en: 'Chanfana, roast suckling pig, bacalhau and petiscos in downtown Coimbra. Lunch and dinner, Tuesday to Saturday. Book by phone or WhatsApp.',
    },
    menuDescription: {
      pt: 'Menu da Tasca do Largo com preços: entradas, peixe, carne, pratos vegetarianos, sobremesas caseiras e vinhos da Bairrada.',
      en: 'Tasca do Largo menu with prices: starters, fish, meat, vegetarian dishes, homemade desserts and Bairrada wines.',
    },
  },

  story: {
    title: {
      pt: 'Uma tasca de bairro, desde 1987',
      en: 'A neighbourhood tasca since 1987',
    },
    text: {
      pt: 'Abrimos as portas em 1987, num pequeno largo da Baixa de Coimbra, com quatro mesas, um balcão de mármore e os cadernos de receitas da avó Lurdes.\n\nHoje somos mais, mas a cozinha continua igual: tachos ao lume desde manhã, produtos do Mercado D. Pedro V e vinho da Bairrada. A chanfana coze devagar em caçoila de barro preto, o leitão vem da Mealhada e as sobremesas são feitas cá em casa, todos os dias.\n\nVenha com tempo. À mesa, não há pressas.',
      en: 'We opened our doors in 1987, on a small square in downtown Coimbra, with four tables, a marble counter and grandma Lurdes’s recipe notebooks.\n\nThere are more of us now, but the kitchen hasn’t changed: pots simmering since the morning, produce from the D. Pedro V market and wine from Bairrada. Our chanfana cooks slowly in a black clay pot, the suckling pig comes from Mealhada and every dessert is made in-house, every day.\n\nTake your time. There’s no rush at the table.',
    },
  },

  address: {
    street: 'Largo das Flores, 12',
    postalCode: '3000-000',
    city: 'Coimbra',
    region: 'Coimbra',
    country: 'PT',
  },
  geo: { lat: 40.2097, lng: -8.4303 },
  map: {
    embed: true,
    zoom: 17,
  },

  contact: {
    phone: '+351 900 000 000',
    whatsapp: '+351 900 000 000',
    email: 'geral@example.com',
  },

  booking: {
    message: {
      pt: 'Olá! Gostaria de reservar uma mesa na Tasca do Largo.\n\nDia:\nHora:\nNúmero de pessoas:\nNome:',
      en: 'Hello! I’d like to book a table at Tasca do Largo.\n\nDate:\nTime:\nNumber of people:\nName:',
    },
  },

  hours: {
    monday: [],
    tuesday: [
      { open: '12:00', close: '15:00' },
      { open: '19:00', close: '22:30' },
    ],
    wednesday: [
      { open: '12:00', close: '15:00' },
      { open: '19:00', close: '22:30' },
    ],
    thursday: [
      { open: '12:00', close: '15:00' },
      { open: '19:00', close: '22:30' },
    ],
    friday: [
      { open: '12:00', close: '15:00' },
      { open: '19:00', close: '23:00' },
    ],
    saturday: [
      { open: '12:00', close: '15:00' },
      { open: '19:00', close: '23:00' },
    ],
    sunday: [{ open: '12:00', close: '15:30' }],
  },
  hoursNote: {
    pt: 'A cozinha fecha 30 minutos antes. Nos feriados, confirme connosco por telefone.',
    en: 'The kitchen closes 30 minutes earlier. On public holidays, please call to confirm.',
  },

  menuIntro: {
    pt: 'Cozinha de tacho, petiscos para partilhar e vinhos da Bairrada e do Dão.',
    en: 'Slow-cooked dishes, petiscos to share and wines from Bairrada and Dão.',
  },

  // Dish of the day: update it when it changes, or delete this block.
  dailySpecial: {
    label: { pt: 'Menu do dia', en: 'Lunch menu of the day' },
    name: { pt: 'Feijoada à transmontana', en: 'Trás-os-Montes bean stew' },
    description: {
      pt: 'Inclui sopa, bebida e café. De terça a sexta, ao almoço.',
      en: 'Includes soup, a drink and coffee. Tuesday to Friday, at lunchtime.',
    },
    price: 12.5,
  },

  menu: [
    {
      id: 'entradas',
      name: { pt: 'Entradas', en: 'Starters' },
      items: [
        {
          id: 'couvert',
          name: { pt: 'Couvert', en: 'Couvert' },
          description: {
            pt: 'Pão caseiro, manteiga e azeitonas temperadas.',
            en: 'Homemade bread, butter and marinated olives.',
          },
          price: 2.5,
        },
        {
          id: 'caldo-verde',
          name: { pt: 'Caldo verde', en: 'Caldo verde (kale soup)' },
          description: {
            pt: 'Com rodela de chouriço e um fio de azeite.',
            en: 'With a slice of chouriço and a drizzle of olive oil.',
          },
          price: 3.5,
          photo: {
            src: 'prato-caldo-verde.jpg',
            alt: {
              pt: 'Tigela de sopa verde de couve, com folhas de couve e pão ao lado',
              en: 'Bowl of green kale soup, with kale leaves and bread on the side',
            },
          },
        },
        {
          id: 'sopa-legumes',
          name: { pt: 'Sopa de legumes da época', en: 'Seasonal vegetable soup' },
          price: 3,
        },
        {
          id: 'pasteis-bacalhau',
          name: { pt: 'Pastéis de bacalhau (4 unid.)', en: 'Codfish cakes (4 pcs)' },
          description: {
            pt: 'Feitos à mão, todos os dias.',
            en: 'Handmade every day.',
          },
          price: 6,
        },
        {
          id: 'moelas',
          name: { pt: 'Moelas estufadas', en: 'Stewed chicken gizzards' },
          description: {
            pt: 'Em molho de tomate e vinho, com pão para molhar.',
            en: 'In a tomato and wine sauce, with bread for dipping.',
          },
          price: 6.5,
        },
        {
          id: 'queijo-serra',
          name: { pt: 'Queijo Serra da Estrela DOP', en: 'Serra da Estrela PDO cheese' },
          description: {
            pt: 'Amanteigado, servido com tostas.',
            en: 'Soft and creamy, served with toast.',
          },
          price: 12,
        },
      ],
    },
    {
      id: 'peixe',
      name: { pt: 'Peixe', en: 'Fish' },
      items: [
        {
          id: 'bacalhau-gomes-de-sa',
          name: { pt: 'Bacalhau à Gomes de Sá', en: 'Bacalhau à Gomes de Sá' },
          description: {
            pt: 'Bacalhau lascado no forno com batata, cebola, ovo cozido e azeitonas.',
            en: 'Oven-baked flaked salt cod with potatoes, onion, boiled egg and olives.',
          },
          price: [
            { label: { pt: 'Meia dose', en: 'Half portion' }, price: 9.5 },
            { label: { pt: 'Dose', en: 'Full portion' }, price: 14 },
          ],
          photo: {
            src: 'prato-bacalhau-gomes-de-sa.jpg',
            alt: {
              pt: 'Travessa de bacalhau à Gomes de Sá com ovo cozido, azeitonas e salsa',
              en: 'Dish of bacalhau à Gomes de Sá with boiled egg, olives and parsley',
            },
          },
        },
        {
          id: 'bacalhau-a-bras',
          name: { pt: 'Bacalhau à Brás', en: 'Bacalhau à Brás' },
          description: {
            pt: 'Bacalhau desfiado com batata palha, ovo e cebola, azeitonas e salsa.',
            en: 'Shredded salt cod with matchstick potatoes, egg and onion, olives and parsley.',
          },
          price: 13.5,
        },
        {
          id: 'polvo-a-lagareiro',
          name: { pt: 'Polvo à lagareiro', en: 'Octopus à lagareiro' },
          description: {
            pt: 'Polvo assado no forno com batata a murro, alho e muito azeite.',
            en: 'Oven-roasted octopus with crushed baby potatoes, garlic and plenty of olive oil.',
          },
          price: 18.5,
          photo: {
            src: 'prato-polvo-a-lagareiro.jpg',
            alt: {
              pt: 'Polvo assado com batatas e limão num prato branco',
              en: 'Roasted octopus with potatoes and lemon on a white plate',
            },
          },
        },
        {
          id: 'sardinhas-assadas',
          name: { pt: 'Sardinhas assadas', en: 'Grilled sardines' },
          description: {
            pt: 'Na brasa, com batata cozida e salada de pimentos. De junho a setembro.',
            en: 'Charcoal-grilled, with boiled potatoes and pepper salad. June to September.',
          },
          price: 12.5,
          photo: {
            src: 'prato-sardinhas-assadas.jpg',
            alt: {
              pt: 'Sardinhas assadas na brasa num prato de rebordo azul',
              en: 'Charcoal-grilled sardines on a blue-rimmed plate',
            },
          },
        },
        {
          id: 'bacalhau-com-broa',
          name: { pt: 'Bacalhau com broa', en: 'Salt cod with cornbread crust' },
          description: {
            pt: 'Lombo de bacalhau no forno, com crosta de broa de milho e grelos.',
            en: 'Baked salt cod loin with a cornbread crust and turnip greens.',
          },
          price: 16.5,
        },
        {
          id: 'peixe-do-dia',
          name: { pt: 'Peixe grelhado do dia', en: 'Grilled fish of the day' },
          description: {
            pt: 'Peixe fresco do mercado, com batata cozida e legumes.',
            en: 'Fresh fish from the market, with boiled potatoes and vegetables.',
          },
          priceNote: { pt: 'Preço do dia', en: 'Market price' },
        },
      ],
    },
    {
      id: 'carne',
      name: { pt: 'Carne', en: 'Meat' },
      items: [
        {
          id: 'chanfana',
          name: { pt: 'Chanfana', en: 'Chanfana (goat in red wine)' },
          description: {
            pt: 'Cabra cozinhada lentamente em vinho tinto, em caçoila de barro, com batata cozida.',
            en: 'Goat slow-cooked in red wine in a clay pot, with boiled potatoes.',
          },
          price: 15.5,
          photo: {
            src: 'prato-chanfana.jpg',
            alt: {
              pt: 'Caçoila de barro a fumegar sobre as brasas',
              en: 'Steaming clay pot over the embers',
            },
          },
        },
        {
          id: 'leitao-a-bairrada',
          name: { pt: 'Leitão à Bairrada', en: 'Bairrada-style roast suckling pig' },
          description: {
            pt: 'Leitão da Mealhada, de pele estaladiça, com batata frita às rodelas, laranja e salada.',
            en: 'Suckling pig from Mealhada with crackling skin, sliced fried potatoes, orange and salad.',
          },
          price: [
            { label: { pt: 'Meia dose', en: 'Half portion' }, price: 11 },
            { label: { pt: 'Dose', en: 'Full portion' }, price: 17.5 },
          ],
          photo: {
            src: 'prato-leitao-a-bairrada.jpg',
            alt: {
              pt: 'Fatias de porco assado com a pele estaladiça',
              en: 'Slices of roast pork with crackling skin',
            },
          },
        },
        {
          id: 'arroz-de-pato',
          name: { pt: 'Arroz de pato à antiga', en: 'Traditional duck rice' },
          description: {
            pt: 'Arroz de forno com pato desfiado e chouriço tostado por cima.',
            en: 'Oven-baked rice with shredded duck, topped with crispy chouriço.',
          },
          price: 13.5,
        },
        {
          id: 'bitoque',
          name: { pt: 'Bitoque da casa', en: 'House bitoque' },
          description: {
            pt: 'Bife de vaca com ovo estrelado, batata frita e arroz.',
            en: 'Beef steak with a fried egg, chips and rice.',
          },
          price: 11.5,
        },
      ],
    },
    {
      id: 'vegetariano',
      name: { pt: 'Vegetariano', en: 'Vegetarian' },
      items: [
        {
          id: 'arroz-cogumelos',
          name: { pt: 'Arroz de cogumelos e espargos', en: 'Mushroom and asparagus rice' },
          description: {
            pt: 'Arroz malandrinho com cogumelos salteados e espargos verdes.',
            en: 'Soupy rice with sautéed mushrooms and green asparagus.',
          },
          price: 11,
        },
        {
          id: 'feijoada-legumes',
          name: { pt: 'Feijoada de legumes', en: 'Vegetable bean stew' },
          description: {
            pt: 'Feijão encarnado com legumes da época e arroz branco.',
            en: 'Red bean stew with seasonal vegetables and white rice.',
          },
          price: 10.5,
        },
      ],
    },
    {
      id: 'sobremesas',
      name: { pt: 'Sobremesas', en: 'Desserts' },
      note: { pt: 'Feitas cá em casa, todos os dias.', en: 'Made in-house, every day.' },
      items: [
        {
          id: 'arroz-doce',
          name: { pt: 'Arroz doce', en: 'Arroz doce (rice pudding)' },
          description: {
            pt: 'Cremoso, com casca de limão e canela.',
            en: 'Creamy, with lemon zest and cinnamon.',
          },
          price: 4,
          photo: {
            src: 'sobremesa-arroz-doce.jpg',
            alt: {
              pt: 'Taça de vidro com arroz doce e canela por cima',
              en: 'Glass bowl of rice pudding topped with cinnamon',
            },
          },
        },
        {
          id: 'pasteis-tentugal',
          name: { pt: 'Pastel de Tentúgal', en: 'Pastel de Tentúgal' },
          description: {
            pt: 'O doce conventual da região: massa finíssima e ovos-moles.',
            en: 'The region’s convent pastry: paper-thin dough filled with sweet egg cream.',
          },
          price: 3.5,
        },
        {
          id: 'pudim',
          name: { pt: 'Pudim caseiro', en: 'Homemade flan' },
          price: 4,
        },
        {
          id: 'fruta',
          name: { pt: 'Fruta da época', en: 'Seasonal fruit' },
          price: 3,
        },
      ],
    },
    {
      id: 'bebidas',
      name: { pt: 'Bebidas', en: 'Drinks' },
      items: [
        {
          id: 'vinho-casa',
          name: { pt: 'Vinho da casa (Bairrada)', en: 'House wine (Bairrada)' },
          description: { pt: 'Tinto ou branco.', en: 'Red or white.' },
          price: [
            { label: { pt: 'Copo', en: 'Glass' }, price: 3 },
            { label: { pt: 'Jarro 50 cl', en: 'Jug 50 cl' }, price: 7.5 },
          ],
        },
        {
          id: 'espumante',
          name: { pt: 'Espumante da Bairrada', en: 'Bairrada sparkling wine' },
          price: [
            { label: { pt: 'Copo', en: 'Glass' }, price: 4.5 },
            { label: { pt: 'Garrafa', en: 'Bottle' }, price: 18 },
          ],
        },
        {
          id: 'dao-tinto',
          name: { pt: 'Dão tinto (garrafa)', en: 'Dão red wine (bottle)' },
          price: 16,
        },
        {
          id: 'cerveja',
          name: { pt: 'Cerveja à pressão', en: 'Draught beer' },
          price: 1.8,
        },
        {
          id: 'sumo-laranja',
          name: { pt: 'Sumo de laranja natural', en: 'Fresh orange juice' },
          price: 3,
        },
        {
          id: 'agua',
          name: { pt: 'Água (50 cl)', en: 'Water (50 cl)' },
          price: 1.5,
        },
        {
          id: 'cafe',
          name: { pt: 'Café', en: 'Espresso' },
          price: 0.9,
        },
      ],
    },
  ],

  featuredDishes: [
    'chanfana',
    'leitao-a-bairrada',
    'bacalhau-gomes-de-sa',
    'polvo-a-lagareiro',
    'sardinhas-assadas',
    'arroz-doce',
  ],

  reviews: {
    rating: 4.7,
    count: 312,
    googleUrl: 'https://www.google.com/maps/search/?api=1&query=40.2097%2C-8.4303',
    featured: [
      {
        name: 'Marta',
        rating: 5,
        text: {
          pt: 'A melhor chanfana que comi fora da casa da minha avó. Ambiente acolhedor e um serviço muito simpático. Voltaremos de certeza!',
          en: 'The best chanfana I’ve had outside my grandmother’s house. Cosy atmosphere and really friendly service. We’ll definitely be back!',
        },
      },
      {
        name: 'James',
        rating: 5,
        text: {
          pt: 'Uma pérola escondida na Baixa de Coimbra. O polvo estava perfeito e o vinho da casa tem ótima relação qualidade-preço. Peçam o arroz doce!',
          en: 'A hidden gem in downtown Coimbra. The octopus was perfect and the house wine is great value. Order the arroz doce!',
        },
      },
      {
        name: 'Rui',
        rating: 5,
        text: {
          pt: 'Comida caseira a sério, doses generosas e preços honestos. O bacalhau à Gomes de Sá é obrigatório.',
          en: 'Proper home cooking, generous portions and honest prices. The bacalhau à Gomes de Sá is a must.',
        },
      },
      {
        name: 'Sophie',
        rating: 4,
        text: {
          pt: 'Uma tasca familiar encantadora. Ao almoço enche, por isso reservem pelo WhatsApp: respondem num instante.',
          en: 'A charming family-run tasca. It fills up at lunchtime, so book on WhatsApp: they reply in no time.',
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
      src: 'hero-mesa-petiscos.jpg',
      alt: {
        pt: 'Mesa de madeira com petiscos, pão e copos de vinho tinto, à luz quente da sala',
        en: 'Wooden table with small dishes, bread and glasses of red wine in a warmly lit room',
      },
      // On phones, show the right side of the photo (the wine glass).
      focus: 'right',
    },
    about: [
      {
        src: 'sobre-tachos-ao-lume.jpg',
        alt: {
          pt: 'Tacho de barro com carne e legumes a cozinhar sobre as brasas',
          en: 'Clay pot of meat and vegetables cooking over the embers',
        },
      },
      {
        src: 'sobre-pao-e-azeite.jpg',
        alt: {
          pt: 'Pão caseiro às fatias com azeite e azeitonas numa taça azul e branca',
          en: 'Sliced homemade bread with olive oil and olives in a blue and white bowl',
        },
      },
      {
        src: 'sobre-mesa-posta.jpg',
        alt: {
          pt: 'Mesa posta com cesto de pão, azeitonas e a carta',
          en: 'Table set with a bread basket, olives and the menu',
        },
      },
    ],
    share: 'partilha-redes-sociais.jpg',
  },

  theme: {
    colors: {
      primary: '#1D4F91',
      onPrimary: '#FFFFFF',
      accent: '#A64B29',
      background: '#FBF7F0',
      surface: '#FFFFFF',
      text: '#221E1A',
      muted: '#5F564E',
      dark: '#14294A',
    },
    fonts: {
      heading: 'Fraunces',
      body: 'Source Sans 3',
    },
  },

  legal: {
    companyName: 'Tasca do Largo, Lda.',
    nif: '000000000',
  },
};

export default config;
