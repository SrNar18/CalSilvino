// ══════════════════════════════════════════
//  CAL SILVINO — Sistema de traducciones
//  Idiomas: es | ca | pt | en
// ══════════════════════════════════════════

const TRANSLATIONS = {

  // ─────────────────── ESPAÑOL ───────────────────
  es: {
    // Navegación
    'nav-inicio':   'Inicio',
    'nav-menu':     'Cartas',
    'nav-reservar': 'WhatsApp',

    // Hero
    'banner-badge':     'El restaurante favorito de La Massana',
    'banner-title':     'Restaurante familiar<br>en La Massana, Andorra',
    'banner-desc':      'Cocina de mar, brasa y tradición familiar.<br>Más de 12 años haciendo que cada comida sea memorable.',
    'banner-btn':       'Pide tu mesa por WhatsApp',
    'banner-secondary': 'Ver nuestra carta →',

    // Trust bar
    'trust-1-strong': '+12 años',
    'trust-1-span':   'de historia familiar',
    'trust-2-span':   'valoración en Google',
    'trust-3-strong': 'Cocina de mar',
    'trust-3-span':   'bacalao, pulpo y marisco',
    'trust-4-strong': 'Celebraciones',
    'trust-4-span':   'eventos y grupos',

    // Sobre nosotros
    'about-eyebrow': 'Nuestro Restaurante',
    'about-h2':      'Un restaurante familiar<br>con alma andorrana',
    'about-p1':      'Hace más de 12 años que abrimos Cal Silvino en La Massana, y desde el primer día nuestra filosofía ha sido la misma: <strong>producto de calidad, cocina honesta y trato familiar</strong>.',
    'about-p2':      'En nuestra carta encontrarás los platos que nos han convertido en referencia gastronómica del Principado: el <span class="dish">bacalao a la llauna</span>, el <span class="dish">pulpo a la brasa</span>, los <span class="dish">callos</span>, el <span class="dish">tartar de atún</span> y la <span class="dish">carne a la brasa</span>, junto a clásicos como los <span class="dish">canelones caseros</span> o los <span class="dish">caracoles a la llauna</span>.',
    'about-p3':      'También organizamos <strong>celebraciones, aniversarios y comidas de empresa</strong>. Contáctanos y nos encargamos de que solo tengas que disfrutar.',
    'about-cta':     'Explorar la carta completa →',
    'about-parking': 'Parking propio gratuito — a 1 min a pie',

    // Banner menú
    'menu-eyebrow': '¿Te apetece algo bueno?',
    'menu-title':   'Descubre nuestra carta',
    'menu-desc':    'Platos de temporada, especialidades de la casa y una selección de vinos pensada para acompañar cada bocado.',
    'menu-btn':     'Ver carta completa',

    // Testimonios
    'test-eyebrow':    'Lo que dicen nuestros clientes',
    'test-title':      'Opiniones reales de Google',
    'global-count':    '· Muy valorado en Google',
    'test-google-cta': 'Ver todas las reseñas en Google',

    // Horario
    'schedule-eyebrow': 'Cuando quieras visitarnos',
    'schedule-h2':      'Horario',
    'schedule-day-1':   'Lunes · Martes',
    'schedule-closed':  'Cerrado',
    'schedule-day-2':   'Miércoles · Jueves · Viernes',
    'schedule-day-3':   'Sábado · Domingo y festivos',
    'slot-lunch':       'Mediodía',
    'slot-dinner':      'Noche',

    // Contacto home
    'contact-eyebrow':  'Estamos aquí',
    'contact-h3':       'Ven a vivir una experiencia gastronómica en La Massana',
    'contact-address':  'Av. el Través, 21 · AD400 La Massana, Andorra',
    'contact-tel-label':'Tel:',

    // Footer
    'footer-days-1': 'Lunes y martes',
    'footer-closed': 'Cerrado',
    'footer-days-2': 'Miércoles a viernes',
    'footer-days-3': 'Sábado y domingo y festivos',

    // Página menú — cabecera
    'menu-page-h1':       'Nuestra Carta',
    'menu-page-subtitle': 'Consulta o descarga las cartas en tu idioma',

    // Especialidades
    'spec-eyebrow': 'Lo mejor de Cal Silvino',
    'spec-h2':      'Especialidades de la casa',
    'spec-1-name':  'Bacalao a la llauna',
    'spec-1-desc':  'El plato estrella de la casa. Bacalao confitado en aceite de oliva virgen extra con ajo dorado y pimentón dulce.',
    'spec-2-name':  'Pulpo a la brasa',
    'spec-2-desc':  'Pulpo gallego braseado al fuego vivo, acompañado de patata aplastada, aceite de pimentón y flor de sal.',
    'spec-3-name':  'Callos a la madrileña',
    'spec-3-desc':  'Guiso tradicional de callos con chorizo, morcilla y especias, cocinado a fuego lento durante horas.',
    'spec-4-name':  'Tartar de atún',
    'spec-4-desc':  'Atún rojo cortado a cuchillo con aguacate cremoso, sésamo tostado, soja y un toque de wasabi.',
    'spec-5-name':  'Carne a la brasa',
    'spec-5-desc':  'Selección de cortes premium braseados sobre leña de encina. Servidos con guarnición de temporada.',
    'spec-6-name':  'Canelones caseros',
    'spec-6-desc':  'Canelones rellenos de carne braseada y verduras, cubiertos de bechamel casera y queso gratinado.',

    // Pilares
    'feat-1-title': 'Negocio familiar',
    'feat-1-text':  'Más de 12 años en La Massana',
    'feat-2-title': 'Cocina de mar',
    'feat-2-text':  'Bacalao, pulpo y marisco fresco',
    'feat-3-title': 'Fuego y brasa',
    'feat-3-text':  'Carnes y pescados al fuego vivo',
    'feat-4-title': 'Celebraciones',
    'feat-4-text':  'Eventos y comidas de empresa',

    // Galería
    'gallery-eyebrow': 'Nuestra cocina en imágenes',
    'gallery-title':   'Galería de platos',

    // CTA menú
    'cta-eyebrow': '¿Todo listo?',
    'cta-h2':      'Escríbenos por WhatsApp',
    'cta-text':    'Ven a disfrutar de nuestra cocina tradicional en un ambiente cálido y familiar. Te esperamos en La Massana.',
    'cta-btn':     'Háblanos por WhatsApp',

    // Modal PDF
    'pdf-download-btn':  'Descargar',
    'pdf-fallback-p':    'La vista previa no está disponible en móvil.<br>Descarga la carta para verla.',
    'pdf-fallback-link': 'Descargar carta',

    // Banner subtitle
    'banner-subtitle': 'RESTAURANTE EN LA MASSANA · ANDORRA',

    // Días de la semana
    'day-monday': 'Lunes',
    'day-tuesday': 'Martes',
    'day-wed-thu-fri-sat': 'Miércoles · Jueves · Viernes · Sábado',
    'day-sunday': 'Domingo',

    // CTA WhatsApp (home)
    'reserve-eyebrow': '¿Listo para vivir la experiencia?',
    'reserve-title': 'Escríbenos por WhatsApp',
    'reserve-desc': 'Más de 12 años sirviendo cocina tradicional andorrana. Respuesta rápida y directa — te confirmamos al momento.',
    'reserve-btn': 'Háblanos por WhatsApp',

    // Parking link
    'parking-link-short': 'Parking propio gratuito — a 1 min',

    // Directions
    'directions-eyebrow': '¿Cómo llegar?',
    'directions-title': 'Ven a visitarnos',
    'directions-desc': 'Disponemos de <strong>parking propio gratuito</strong> a tan solo 1 minuto a pie del restaurante.',
    'directions-btn-restaurant': 'Llegar al restaurante',
    'directions-btn-parking': 'Llegar al parking',

    // Tags especialidades
    'spec-tag-sea': 'Mar',
    'spec-tag-grill': 'Brasa',
    'spec-tag-tradition': 'Tradición',

    // Link CTA menú
    'cta-link': 'Ver la carta →',

    // Estado en tiempo real
    'status-checking': 'Verificando...',
    'status-open': 'Abierto',
    'status-closed': 'Cerrado',
    'status-closes-at': 'Cierra a las',
    'status-opens-at': 'Abre a las',
    'status-opens-tomorrow-at': 'Abre mañana a las',
    'status-holiday': 'Festivo',

    // Reseñas
    'review-1': '"Sin duda, una de las mejores experiencias culinarias que he tenido en mucho tiempo. Nos gustó tanto que tuvimos que repetir y eso que el primer dia no pudimos comer porque estaba lleno. Recomiendo encarecidamente el menú de buey aunque todo estaba muy bueno. En cuanto a la atención, solo puedo decir que fue formidable. Sin duda, volveremos."',
    'review-2': '"Buen sitio para desayunar en La Massana: el Racó d\'en Silvino ofrece un desayuno sencillo y rico, con precios razonables y raciones generosas. Suelen tener ofertas y opciones económicas, ideal para empezar el día sin gastar demasiado. Ambiente tranquilo, servicio rápido y buen café. Una opción práctica y de confianza."',
    'review-3': '"Restaurante recomendado tanto la carta, el menú o las tapas. Familiar y de los de siempre. Garantizado y recomendado."',

    // Alerta teléfono
    'phone-alert': 'Utiliza tu teléfono móvil para llamar 📞\n\nNúmero: +376 840 720',
  },

  // ─────────────────── CATALÀ ───────────────────
  ca: {
    'nav-inicio':   'Inici',
    'nav-menu':     'Cartas',
    'nav-reservar': 'WhatsApp',

    'banner-badge':     'El restaurant favorit de La Massana',
    'banner-title':     'Restaurant familiar<br>a La Massana, Andorra',
    'banner-desc':      'Cuina de mar, brasa i tradició familiar.<br>Més de 12 anys fent que cada àpat sigui memorable.',
    'banner-btn':       'Demana la teva taula per WhatsApp',
    'banner-secondary': 'Veure la nostra carta →',

    'trust-1-strong': '+12 anys',
    'trust-1-span':   'd\'història familiar',
    'trust-2-span':   'valoració a Google',
    'trust-3-strong': 'Cuina de mar',
    'trust-3-span':   'bacallà, pop i marisc',
    'trust-4-strong': 'Celebracions',
    'trust-4-span':   'esdeveniments i grups',

    'about-eyebrow': 'El Nostre Restaurant',
    'about-h2':      'Un restaurant familiar<br>amb ànima andorrana',
    'about-p1':      'Fa més de 12 anys que vam obrir Cal Silvino a La Massana, i des del primer dia la nostra filosofia ha estat la mateixa: <strong>producte de qualitat, cuina honesta i tracte familiar</strong>.',
    'about-p2':      'A la nostra carta trobaràs els plats que ens han convertit en referència gastronòmica del Principat: el <span class="dish">bacallà a la llauna</span>, el <span class="dish">pop a la brasa</span>, els <span class="dish">callos</span>, el <span class="dish">tàrtar de tonyina</span> i la <span class="dish">carn a la brasa</span>, juntament amb clàssics com els <span class="dish">canelons casolans</span> o els <span class="dish">cargols a la llauna</span>.',
    'about-p3':      'També organitzem <strong>celebracions, aniversaris i dinars d\'empresa</strong>. Contacta\'ns i ens encarreguem de tot perquè només hagis de gaudir.',
    'about-cta':     'Explorar la carta completa →',
    'about-parking': 'Pàrquing propi gratuït — a 1 min a peu',

    'menu-eyebrow': 'T\'apeteix alguna cosa bona?',
    'menu-title':   'Descobreix la nostra carta',
    'menu-desc':    'Plats de temporada, especialitats de la casa i una selecció de vins pensada per acompanyar cada mos.',
    'menu-btn':     'Veure la carta completa',

    'test-eyebrow':    'El que diuen els nostres clients',
    'test-title':      'Opinions reals de Google',
    'global-count':    '· Molt valorat a Google',
    'test-google-cta': 'Veure totes les ressenyes a Google',

    'schedule-eyebrow': 'Quan vulguis visitar-nos',
    'schedule-h2':      'Horari',
    'schedule-day-1':   'Dilluns · Dimarts',
    'schedule-closed':  'Tancat',
    'schedule-day-2':   'Dimecres · Dijous · Divendres',
    'schedule-day-3':   'Dissabte · Diumenge i festius',
    'slot-lunch':       'Migdia',
    'slot-dinner':      'Nit',

    'contact-eyebrow':   'Som aquí',
    'contact-h3':        'Vine a viure una experiència gastronòmica a La Massana',
    'contact-address':   'Av. el Través, 21 · AD400 La Massana, Andorra',
    'contact-tel-label': 'Tel:',

    'footer-days-1': 'Dilluns i dimarts',
    'footer-closed': 'Tancat',
    'footer-days-2': 'Dimecres, dijous i divendres',
    'footer-days-3': 'Dissabte, diumenge i festius',

    'menu-page-h1':       'La Nostra Carta',
    'menu-page-subtitle': 'Consulta o descarrega les cartes en el teu idioma',

    'spec-eyebrow': 'El millor de Cal Silvino',
    'spec-h2':      'Especialitats de la casa',
    'spec-1-name':  'Bacallà a la llauna',
    'spec-1-desc':  'El plat estrella de la casa. Bacallà confitat en oli d\'oliva verge extra amb all daurat i pebre vermell dolç.',
    'spec-2-name':  'Pop a la brasa',
    'spec-2-desc':  'Pop gallec brasejat al foc viu, acompanyat de patata esclafada, oli de pebre vermell i flor de sal.',
    'spec-3-name':  'Callos tradicionals',
    'spec-3-desc':  'Guisat tradicional cuinat a foc lent durant hores amb espècies i ingredients de qualitat.',
    'spec-4-name':  'Tàrtar de tonyina',
    'spec-4-desc':  'Tonyina vermella tallada a ganivet amb alvocat cremós, sèsam torrat, soja i un toc de wasabi.',
    'spec-5-name':  'Carn a la brasa',
    'spec-5-desc':  'Selecció de talls premium brasejats sobre llenya d\'alzina. Servits amb guarnició de temporada.',
    'spec-6-name':  'Canelons casolans',
    'spec-6-desc':  'Canelons farcits de carn brasejada i verdures, coberts de beixamel casolana i formatge gratinats.',

    'feat-1-title': 'Negoci familiar',
    'feat-1-text':  'Més de 12 anys a La Massana',
    'feat-2-title': 'Cuina de mar',
    'feat-2-text':  'Bacallà, pop i marisc fresc',
    'feat-3-title': 'Foc i brasa',
    'feat-3-text':  'Carns i peixos al foc viu',
    'feat-4-title': 'Celebracions',
    'feat-4-text':  'Esdeveniments i dinars d\'empresa',

    'gallery-eyebrow': 'La nostra cuina en imatges',
    'gallery-title':   'Galeria de plats',

    'cta-eyebrow': 'Tot llest?',
    'cta-h2':      'Escriu-nos per WhatsApp',
    'cta-text':    'Vine a gaudir de la nostra cuina tradicional en un ambient càlid i familiar. T\'esperem a La Massana.',
    'cta-btn':     'Parla\'ns per WhatsApp',

    'pdf-download-btn':  'Descarregar',
    'pdf-fallback-p':    'La previsualització no està disponible al mòbil.<br>Descarrega la carta per veure-la.',
    'pdf-fallback-link': 'Descarregar carta',

    'banner-subtitle': 'RESTAURANT A LA MASSANA · ANDORRA',

    'day-monday': 'Dilluns',
    'day-tuesday': 'Dimarts',
    'day-wed-thu-fri-sat': 'Dimecres · Dijous · Divendres · Dissabte',
    'day-sunday': 'Diumenge',

    'reserve-eyebrow': 'Llest per viure l\'experiència?',
    'reserve-title': 'Escriu-nos per WhatsApp',
    'reserve-desc': 'Més de 12 anys servint cuina tradicional andorrana. Resposta ràpida i directa — et confirmem al moment.',
    'reserve-btn': 'Parla\'ns per WhatsApp',

    'parking-link-short': 'Pàrquing propi gratuït — a 1 min',

    'directions-eyebrow': 'Com arribar?',
    'directions-title': 'Vine a visitar-nos',
    'directions-desc': 'Disposem de <strong>pàrquing propi gratuït</strong> a tan sols 1 minut a peu del restaurant.',
    'directions-btn-restaurant': 'Arribar al restaurant',
    'directions-btn-parking': 'Arribar al pàrquing',

    'spec-tag-sea': 'Mar',
    'spec-tag-grill': 'Brasa',
    'spec-tag-tradition': 'Tradició',

    'cta-link': 'Veure la carta →',

    'status-checking': 'Verificant...',
    'status-open': 'Obert',
    'status-closed': 'Tancat',
    'status-closes-at': 'Tanca a les',
    'status-opens-at': 'Obre a les',
    'status-opens-tomorrow-at': 'Obre demà a les',
    'status-holiday': 'Festiu',

    'review-1': '"Sens dubte, una de les millors experiències culinàries que he tingut en molt de temps. Ens va agradar tant que vam haver de repetir, tot i que el primer dia no vam poder menjar perquè estava ple. Recomano molt el menú de bou, tot i que tot estava molt bo. Pel que fa a l\'atenció, només puc dir que va ser formidable. Sens dubte, tornarem."',
    'review-2': '"Bon lloc per esmorzar a La Massana: el Racó d\'en Silvino ofereix un esmorzar senzill i bo, amb preus raonables i racions generoses. Solen tenir ofertes i opcions econòmiques, ideal per començar el dia sense gastar massa. Ambient tranquil, servei ràpid i bon cafè. Una opció pràctica i de confiança."',
    'review-3': '"Restaurant recomanat tant la carta, el menú com les tapes. Familiar i dels de sempre. Garantit i recomanat."',

    'phone-alert': 'Utilitza el teu telèfon mòbil per trucar 📞\n\nNúmero: +376 840 720',
  },

  // ─────────────────── PORTUGUÊS ───────────────────
  pt: {
    'nav-inicio':   'Início',
    'nav-menu':     'Cartas',
    'nav-reservar': 'WhatsApp',

    'banner-badge':     'O restaurante favorito de La Massana',
    'banner-title':     'Restaurante familiar<br>em La Massana, Andorra',
    'banner-desc':      'Cozinha de mar, brasa e tradição familiar.<br>Mais de 12 anos a tornar cada refeição memorável.',
    'banner-btn':       'Peça a sua mesa pelo WhatsApp',
    'banner-secondary': 'Ver a nossa carta →',

    'trust-1-strong': '+12 anos',
    'trust-1-span':   'de história familiar',
    'trust-2-span':   'avaliação no Google',
    'trust-3-strong': 'Cozinha do mar',
    'trust-3-span':   'bacalhau, polvo e marisco',
    'trust-4-strong': 'Celebrações',
    'trust-4-span':   'eventos e grupos',

    'about-eyebrow': 'O Nosso Restaurante',
    'about-h2':      'Um restaurante familiar<br>com alma andorrana',
    'about-p1':      'Há mais de 12 anos que abrimos Cal Silvino em La Massana, e desde o primeiro dia a nossa filosofia tem sido a mesma: <strong>produto de qualidade, cozinha honesta e trato familiar</strong>.',
    'about-p2':      'Na nossa carta encontrará os pratos que nos tornaram referência gastronómica do Principado: o <span class="dish">bacalhau à llauna</span>, o <span class="dish">polvo à brasa</span>, os <span class="dish">callos</span>, o <span class="dish">tartar de atum</span> e a <span class="dish">carne à brasa</span>, junto com clássicos como os <span class="dish">canelinhos caseiros</span> ou os <span class="dish">caracóis à llauna</span>.',
    'about-p3':      'Também organizamos <strong>celebrações, aniversários e jantares de empresa</strong>. Contacte-nos e tratamos de tudo para que só tenha de desfrutar.',
    'about-cta':     'Explorar a carta completa →',
    'about-parking': 'Estacionamento próprio gratuito — a 1 min a pé',

    'menu-eyebrow': 'Apetece-lhe algo bom?',
    'menu-title':   'Descubra a nossa carta',
    'menu-desc':    'Pratos de época, especialidades da casa e uma seleção de vinhos pensada para acompanhar cada garfada.',
    'menu-btn':     'Ver carta completa',

    'test-eyebrow':    'O que dizem os nossos clientes',
    'test-title':      'Opiniões reais do Google',
    'global-count':    '· Muito valorizado no Google',
    'test-google-cta': 'Ver todas as avaliações no Google',

    'schedule-eyebrow': 'Quando quiser visitar-nos',
    'schedule-h2':      'Horário',
    'schedule-day-1':   'Segunda · Terça',
    'schedule-closed':  'Fechado',
    'schedule-day-2':   'Quarta · Quinta · Sexta',
    'schedule-day-3':   'Sábado · Domingo e feriados',
    'slot-lunch':       'Almoço',
    'slot-dinner':      'Jantar',

    'contact-eyebrow':   'Estamos aqui',
    'contact-h3':        'Venha viver uma experiência gastronómica em La Massana',
    'contact-address':   'Av. el Través, 21 · AD400 La Massana, Andorra',
    'contact-tel-label': 'Tel:',

    'footer-days-1': 'Segunda e terça',
    'footer-closed': 'Fechado',
    'footer-days-2': 'Quarta a sexta',
    'footer-days-3': 'Sábado e domingo e feriados',

    'menu-page-h1':       'A Nossa Carta',
    'menu-page-subtitle': 'Consulte ou descarregue as cartas no seu idioma',

    'spec-eyebrow': 'O melhor de Cal Silvino',
    'spec-h2':      'Especialidades da casa',
    'spec-1-name':  'Bacalhau à llauna',
    'spec-1-desc':  'O prato estrela da casa. Bacalhau confitado em azeite virgem extra com alho dourado e pimentão doce.',
    'spec-2-name':  'Polvo à brasa',
    'spec-2-desc':  'Polvo galego grelhado no fogo vivo, acompanhado de batata esmagada, azeite de pimentão e flor de sal.',
    'spec-3-name':  'Dobrada tradicional',
    'spec-3-desc':  'Guisado tradicional de dobrada com chouriço, morcela e especiarias, cozido em lume brando durante horas.',
    'spec-4-name':  'Tartar de atum',
    'spec-4-desc':  'Atum vermelho cortado à faca com abacate cremoso, sésamo tostado, molho de soja e um toque de wasabi.',
    'spec-5-name':  'Carne à brasa',
    'spec-5-desc':  'Seleção de cortes premium grelhados sobre lenha de azinheira. Servidos com guarnição de época.',
    'spec-6-name':  'Canelinhos caseiros',
    'spec-6-desc':  'Canelinhos recheados com carne grelhada e legumes, cobertos com bechamel caseiro e queijo gratinado.',

    'feat-1-title': 'Negócio familiar',
    'feat-1-text':  'Mais de 12 anos em La Massana',
    'feat-2-title': 'Cozinha do mar',
    'feat-2-text':  'Bacalhau, polvo e marisco fresco',
    'feat-3-title': 'Fogo e brasa',
    'feat-3-text':  'Carnes e peixes no fogo vivo',
    'feat-4-title': 'Celebrações',
    'feat-4-text':  'Eventos e jantares de empresa',

    'gallery-eyebrow': 'A nossa cozinha em imagens',
    'gallery-title':   'Galeria de pratos',

    'cta-eyebrow': 'Tudo pronto?',
    'cta-h2':      'Fale connosco pelo WhatsApp',
    'cta-text':    'Venha desfrutar da nossa cozinha tradicional num ambiente acolhedor e familiar. Esperamos por si em La Massana.',
    'cta-btn':     'Fale connosco pelo WhatsApp',

    'pdf-download-btn':  'Descarregar',
    'pdf-fallback-p':    'A pré-visualização não está disponível no telemóvel.<br>Descarregue a carta para a ver.',
    'pdf-fallback-link': 'Descarregar carta',

    'banner-subtitle': 'RESTAURANTE EM LA MASSANA · ANDORRA',

    'day-monday': 'Segunda-feira',
    'day-tuesday': 'Terça-feira',
    'day-wed-thu-fri-sat': 'Quarta · Quinta · Sexta · Sábado',
    'day-sunday': 'Domingo',

    'reserve-eyebrow': 'Pronto para viver a experiência?',
    'reserve-title': 'Fale connosco pelo WhatsApp',
    'reserve-desc': 'Mais de 12 anos a servir cozinha tradicional andorrana. Resposta rápida e direta — confirmamos no momento.',
    'reserve-btn': 'Fale connosco pelo WhatsApp',

    'parking-link-short': 'Estacionamento próprio gratuito — a 1 min',

    'directions-eyebrow': 'Como chegar?',
    'directions-title': 'Venha visitar-nos',
    'directions-desc': 'Dispomos de <strong>estacionamento próprio gratuito</strong> a apenas 1 minuto a pé do restaurante.',
    'directions-btn-restaurant': 'Chegar ao restaurante',
    'directions-btn-parking': 'Chegar ao estacionamento',

    'spec-tag-sea': 'Mar',
    'spec-tag-grill': 'Brasa',
    'spec-tag-tradition': 'Tradição',

    'cta-link': 'Ver a carta →',

    'status-checking': 'A verificar...',
    'status-open': 'Aberto',
    'status-closed': 'Fechado',
    'status-closes-at': 'Fecha às',
    'status-opens-at': 'Abre às',
    'status-opens-tomorrow-at': 'Abre amanhã às',
    'status-holiday': 'Feriado',

    'review-1': '"Sem dúvida, uma das melhores experiências culinárias que tive em muito tempo. Gostámos tanto que tivemos de repetir, apesar de no primeiro dia não termos conseguido comer porque estava cheio. Recomendo vivamente o menu de boi, embora tudo estivesse muito bom. Quanto ao atendimento, só posso dizer que foi formidável. Sem dúvida, voltaremos."',
    'review-2': '"Bom sítio para tomar o pequeno-almoço em La Massana: o Racó d\'en Silvino oferece um pequeno-almoço simples e saboroso, com preços razoáveis e porções generosas. Costumam ter ofertas e opções económicas, ideal para começar o dia sem gastar demasiado. Ambiente tranquilo, serviço rápido e bom café. Uma opção prática e de confiança."',
    'review-3': '"Restaurante recomendado, tanto a carta, o menu como as tapas. Familiar e daqueles de sempre. Garantido e recomendado."',

    'phone-alert': 'Use o seu telemóvel para ligar 📞\n\nNúmero: +376 840 720',
  },

  // ─────────────────── ENGLISH ───────────────────
  en: {
    'nav-inicio':   'Home',
    'nav-menu':     'Menu',
    'nav-reservar': 'WhatsApp',

    'banner-badge':     'La Massana\'s favourite restaurant',
    'banner-title':     'Family Restaurant<br>in La Massana, Andorra',
    'banner-desc':      'Seafood, grill and family tradition.<br>Over 12 years making every meal memorable.',
    'banner-btn':       'Book your table via WhatsApp',
    'banner-secondary': 'See our menu →',

    'trust-1-strong': '12+ years',
    'trust-1-span':   'of family history',
    'trust-2-span':   'Google rating',
    'trust-3-strong': 'Seafood',
    'trust-3-span':   'cod, octopus and shellfish',
    'trust-4-strong': 'Celebrations',
    'trust-4-span':   'events and groups',

    'about-eyebrow': 'Our Restaurant',
    'about-h2':      'A family restaurant<br>with Andorran soul',
    'about-p1':      'Over 12 years ago we opened Cal Silvino in La Massana, and from day one our philosophy has been the same: <strong>quality produce, honest cooking and a family welcome</strong>.',
    'about-p2':      'Our menu features the dishes that have made us a gastronomic landmark of the Principality: <span class="dish">bacalao a la llauna</span>, <span class="dish">grilled octopus</span>, <span class="dish">callos</span>, <span class="dish">tuna tartar</span> and <span class="dish">grilled meat</span>, alongside classics like <span class="dish">homemade cannelloni</span> or <span class="dish">snails a la llauna</span>.',
    'about-p3':      'We also host <strong>celebrations, anniversaries and corporate dinners</strong>. Get in touch and we\'ll take care of everything so you can just enjoy.',
    'about-cta':     'Explore the full menu →',
    'about-parking': 'Free private parking — 1 min walk',

    'menu-eyebrow': 'Feeling hungry?',
    'menu-title':   'Discover our menu',
    'menu-desc':    'Seasonal dishes, house specialities and a wine selection crafted to accompany every bite.',
    'menu-btn':     'View full menu',

    'test-eyebrow':    'What our guests say',
    'test-title':      'Real Google reviews',
    'global-count':    '· Highly rated on Google',
    'test-google-cta': 'See all reviews on Google',

    'schedule-eyebrow': 'Whenever you\'d like to visit',
    'schedule-h2':      'Opening hours',
    'schedule-day-1':   'Monday · Tuesday',
    'schedule-closed':  'Closed',
    'schedule-day-2':   'Wednesday · Thursday · Friday',
    'schedule-day-3':   'Saturday · Sunday & holidays',
    'slot-lunch':       'Lunch',
    'slot-dinner':      'Dinner',

    'contact-eyebrow':   'Find us here',
    'contact-h3':        'Come and enjoy a gastronomic experience in La Massana',
    'contact-address':   'Av. el Través, 21 · AD400 La Massana, Andorra',
    'contact-tel-label': 'Tel:',

    'footer-days-1': 'Monday and Tuesday',
    'footer-closed': 'Closed',
    'footer-days-2': 'Wednesday to Friday',
    'footer-days-3': 'Saturday, Sunday & holidays',

    'menu-page-h1':       'Our Menu',
    'menu-page-subtitle': 'View or download the menus in your language',

    'spec-eyebrow': 'The best of Cal Silvino',
    'spec-h2':      'House specialities',
    'spec-1-name':  'Bacalao a la llauna',
    'spec-1-desc':  'Our signature dish. Cod slow-cooked in extra virgin olive oil with golden garlic and sweet paprika.',
    'spec-2-name':  'Grilled octopus',
    'spec-2-desc':  'Galician octopus grilled over live fire, served with crushed potato, paprika oil and sea salt flakes.',
    'spec-3-name':  'Traditional callos',
    'spec-3-desc':  'Traditional stew with chorizo, black pudding and spices, slow-cooked for hours.',
    'spec-4-name':  'Tuna tartar',
    'spec-4-desc':  'Hand-cut bluefin tuna with creamy avocado, toasted sesame, soy sauce and a hint of wasabi.',
    'spec-5-name':  'Grilled meat',
    'spec-5-desc':  'Selection of premium cuts grilled over oak wood. Served with seasonal sides.',
    'spec-6-name':  'Homemade cannelloni',
    'spec-6-desc':  'Cannelloni filled with braised meat and vegetables, topped with homemade béchamel and gratinated cheese.',

    'feat-1-title': 'Family business',
    'feat-1-text':  'Over 12 years in La Massana',
    'feat-2-title': 'Seafood kitchen',
    'feat-2-text':  'Cod, octopus and fresh shellfish',
    'feat-3-title': 'Fire & grill',
    'feat-3-text':  'Meats and fish over live fire',
    'feat-4-title': 'Celebrations',
    'feat-4-text':  'Events and corporate dining',

    'gallery-eyebrow': 'Our kitchen in pictures',
    'gallery-title':   'Dish gallery',

    'cta-eyebrow': 'Ready?',
    'cta-h2':      'Message us on WhatsApp',
    'cta-text':    'Come and enjoy our traditional cuisine in a warm, family atmosphere. We look forward to seeing you in La Massana.',
    'cta-btn':     'Chat with us on WhatsApp',

    'pdf-download-btn':  'Download',
    'pdf-fallback-p':    'Preview is not available on mobile.<br>Download the menu to view it.',
    'pdf-fallback-link': 'Download menu',

    'banner-subtitle': 'RESTAURANT IN LA MASSANA · ANDORRA',

    'day-monday': 'Monday',
    'day-tuesday': 'Tuesday',
    'day-wed-thu-fri-sat': 'Wednesday · Thursday · Friday · Saturday',
    'day-sunday': 'Sunday',

    'reserve-eyebrow': 'Ready to enjoy the experience?',
    'reserve-title': 'Message us on WhatsApp',
    'reserve-desc': 'Over 12 years serving traditional Andorran cuisine. Quick and direct response — we confirm instantly.',
    'reserve-btn': 'Chat with us on WhatsApp',

    'parking-link-short': 'Free private parking — 1 min walk',

    'directions-eyebrow': 'How to get here?',
    'directions-title': 'Come visit us',
    'directions-desc': 'We have <strong>free private parking</strong> just 1 minute walk from the restaurant.',
    'directions-btn-restaurant': 'Get to the restaurant',
    'directions-btn-parking': 'Get to the parking',

    'spec-tag-sea': 'Sea',
    'spec-tag-grill': 'Grill',
    'spec-tag-tradition': 'Tradition',

    'cta-link': 'View the menu →',

    'status-checking': 'Checking...',
    'status-open': 'Open',
    'status-closed': 'Closed',
    'status-closes-at': 'Closes at',
    'status-opens-at': 'Opens at',
    'status-opens-tomorrow-at': 'Opens tomorrow at',
    'status-holiday': 'Holiday',

    'review-1': '"Without a doubt, one of the best culinary experiences I\'ve had in a long time. We liked it so much we had to come back, even though on the first day we couldn\'t eat because it was full. I highly recommend the beef menu, although everything was excellent. As for the service, I can only say it was outstanding. We\'ll definitely be back."',
    'review-2': '"Great place for breakfast in La Massana: Racó d\'en Silvino offers a simple and tasty breakfast, with reasonable prices and generous portions. They usually have deals and affordable options, ideal for starting the day without spending too much. Quiet atmosphere, fast service and good coffee. A reliable and practical choice."',
    'review-3': '"Highly recommended restaurant — the à la carte, the set menu and the tapas are all great. Family-run and timeless. Guaranteed and recommended."',

    'phone-alert': 'Use your mobile phone to call 📞\n\nNumber: +376 840 720',
  },
};

// ══════════════════════════════════════════
//  Aplicar traducciones al DOM
// ══════════════════════════════════════════
function applyTranslations(lang) {
    const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

    // textContent simple
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.textContent = t[key];
    });

    // innerHTML (con etiquetas HTML dentro)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (t[key] !== undefined) el.innerHTML = t[key];
    });

    // Placeholders de inputs
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) el.placeholder = t[key];
    });

    // Lang en el <html>
    document.documentElement.lang = lang;

    // Estado activo en el dropdown
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Texto del botón
    const langCurrentEl = document.getElementById('langCurrent');
    if (langCurrentEl) langCurrentEl.textContent = lang.toUpperCase();
}

// ══════════════════════════════════════════
//  Inicializar con el idioma guardado
// ══════════════════════════════════════════
(function initLang() {
    const savedLang = localStorage.getItem('calsilvinoLang') || 'es';
    applyTranslations(savedLang);
})();
