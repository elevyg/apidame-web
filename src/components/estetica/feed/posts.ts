export type Block =
  | { type: "kicker"; text: string }
  | { type: "p"; text: string }
  | { type: "pull"; text: string }
  | { type: "photo"; src: string; alt: string; caption?: string };

export type Post = {
  id: string;
  title: string;
  place: string;
  blocks: Block[];
};

export const posts: Post[] = [
  {
    id: "cuerdas",
    title: "¿Cuerdas dobles o cuerda simple y tagline?",
    place: "Notas de cordada",
    blocks: [
      {
        type: "p",
        text: "Cuando empecé a escalar tradicional en multilargos, me enseñaron de inmediato que lo mejor eran dos cuerdas dobles de 8.5 u 8.7 mm. Tanto en mis primeros pegues en el Cerro San Gabriel —Los Colombianos— como después, cuando me mudé a Estados Unidos y escalé en los Gunks, que en realidad fue mi escuela de trad. La mayoría de los escaladores usaba dobles.",
      },
      {
        type: "p",
        text: "La ventaja de las dobles, para las aproximaciones, es que es más fácil dividir la carga entre la cordada. Tienes una cuerda redundante. Y si el pegue es zigzagueante, puedes gestionar mejor las cuerdas para evitar el roce de esos zigzags y no tener que extender tanto.",
      },
      {
        type: "p",
        text: "Otra cosa que he aprendido con el tiempo: si decido usar dobles, también puedo llevar menos cintas runners —pesan más que una express liviana— y es más fácil de gestionar para chapar.",
      },
      {
        type: "photo",
        src: "/estetica/deportiva/cuerdas.jpg",
        alt: "Cuerdas en la pared",
        caption: "Dos sistemas. El mismo oficio.",
      },
      {
        type: "kicker",
        text: "Simple y tagline",
      },
      {
        type: "p",
        text: "Ahora bien, últimamente me he motivado más por usar cuerda simple y tagline. Tiene una serie de beneficios que no tienen las dobles.",
      },
      {
        type: "p",
        text: "Si uno escala harto deportiva, usar una sola cuerda para chapar —sobre todo en pegues más cerca de tus límites— se siente más natural. Escalas con menos peso colgando: dos cuerdas en el arnés pesan más que una más un tagline.",
      },
      {
        type: "p",
        text: "Si vas a hacer rutas muy largas, o vas a abrir y quieres llevar cosas, nosotros preferimos un petate o una mochila como petate. El tagline sirve para subirla.",
      },
      {
        type: "p",
        text: "Uno de los contras: con cuerda simple no pueden escalar tres personas con la misma facilidad. Con técnicas más avanzadas sí se puede, pero la cordada necesita más oficio. Con un par de dobles es más sencillo: cada escalador que sigue el largo se une a una de las dos cuerdas.",
      },
      {
        type: "photo",
        src: "/estetica/presentacion/cordada-pared.jpg",
        alt: "Cordada en la pared",
        caption: "La cordada decide el sistema, no al revés.",
      },
      {
        type: "kicker",
        text: "Rapeles",
      },
      {
        type: "p",
        text: "La ventaja de las dobles es sobre todo la transición. Quien llega abajo ya puede preparar el rapel siguiente y pasar por la anilla la cuerda que hay que tirar. Cuando todos rapelaron el largo de arriba y empiezan a recuperar, se recupera a través de la anilla, se deja caer, y se intercambiaron las cuerdas que hay que tirar para el siguiente. Bastante eficiente.",
      },
      {
        type: "p",
        text: "Lo que sí: siempre tenemos mucho respeto con los rapeles, sobre todo cuando la cuerda cae en caída libre. Esa es la oportunidad para que quede trabada.",
      },
      {
        type: "p",
        text: "Con simple y tagline nosotros rapelamos del tagline y recuperamos la cuerda dinámica de forma controlada. Tiene altos riesgos. Es una técnica más avanzada. Recomiendo hacerla solo si entiendes bien lo que estás haciendo. La cuerda gruesa tiene más fricción y más fuerza hacia abajo, y el tagline se puede salir. Hay un accidente reciente en que pasó eso.",
      },
      {
        type: "p",
        text: "Una forma que hemos aprendido de eliminar ese problema: el que va a rapelar segundo deja precargado su ATC en la línea. Eso ya bloquea las cuerdas, ya no pueden correr. Cuando el primero ya rapeló, deja puesto su ATC para que las cuerdas no caminen.",
      },
      {
        type: "p",
        text: "Esto es harto más lento, porque se pierde el beneficio de que el de abajo prepare el siguiente rapel. Pero una cuerda atascada toma mucho más tiempo que cualquiera de las eficiencias que se consiguen con dobles.",
      },
      {
        type: "kicker",
        text: "Herramientas",
      },
      {
        type: "pull",
        text: "No siempre se ocupan las mismas.",
      },
      {
        type: "p",
        text: "Si voy a una ruta donde sé que se sale por arriba, con dos personas que no tienen mucha experiencia, en un grado que a mí me acomoda, quizá prefiero dobles. Si vamos de a tres, el peso extra de dos 8.7 se puede repartir en la cordada.",
      },
      {
        type: "p",
        text: "Si voy a una ruta que está a mi máximo, o que voy a abrir, y necesito un tagline, y prefiero gestionar una sola cuerda y que me aseguren con un Grigri, voy a preferir simple y tagline.",
      },
      {
        type: "p",
        text: "En particular nosotros ocupamos un tagline Black Diamond de 6 mm que es como un cable, hecho para rapelar. Cuando cae, al ser un cable no genera los loops que se quedan trabados en la fisura, en los cachos de roca o en la vegetación.",
      },
    ],
  },
];
