import cintasJson from "../../../../content/notas/estrategia-de-cintas.json";

export type CardTone =
  | "paper"
  | "canvas"
  | "beige"
  | "editorial-light"
  | "editorial-dark";

export type TitleCard = {
  type: "title";
  kicker: string;
  text: string;
  tone: CardTone;
  art?: string;
  artAlt?: string;
  object?: string;
};

export type FieldCard = {
  type: "field";
  kicker: string;
  paras: string[];
  tone: CardTone;
  feature?: string;
  meta?: string[];
};

export type PhotoCard = {
  type: "photo";
  src: string;
  alt: string;
  caption: string;
  object?: string;
};

export type Card = {
  id: string;
  share: string;
} & (TitleCard | FieldCard | PhotoCard);

export type FeedPostData = {
  slug: string;
  title: string;
  description: string;
  og: {
    title: string;
    subtitle: string;
    imageAlt: string;
  };
  cards: Card[];
};

const postCards: Card[] = [
  {
    id: "titulo",
    type: "title",
    tone: "paper",
    kicker: "Notas de cordada",
    text: "¿Cuerdas dobles o cuerda simple y tagline?",
    art: "/estetica/feed/simple-naranja.jpg",
    artAlt:
      "Cuerda simple naranja en una fisura de granito, con un escalador más arriba",
    object: "object-[40%_62%]",
    share: "¿Cuerdas dobles o cuerda simple y tagline?",
  },
  {
    id: "foto-beal",
    type: "photo",
    src: "/estetica/feed/beal-cobra.jpg",
    alt: "Par de cuerdas Béal Cobra II 8.6 mm",
    caption: "Béal Cobra II · 8.6 mm",
    object: "object-center",
    share: "Béal Cobra II 8.6 mm. El par.",
  },
  {
    id: "escuela",
    type: "field",
    tone: "beige",
    kicker: "Escuela",
    paras: [
      "Cuando empecé a escalar tradicional en multilargos, me enseñaron de inmediato que lo mejor eran dos cuerdas dobles de 8.5 u 8.7 mm. Tanto en mis primeros pegues en el Cerro San Gabriel —Los Colombianos— como después, cuando me mudé a Estados Unidos y escalé en los Gunks, que en realidad fue mi escuela de trad. La mayoría de los escaladores usaba dobles.",
    ],
    share:
      "Cuando empecé a escalar tradicional en multilargos, me enseñaron de inmediato que lo mejor eran dos cuerdas dobles de 8.5 u 8.7 mm. Tanto en mis primeros pegues en el Cerro San Gabriel —Los Colombianos— como después, cuando me mudé a Estados Unidos y escalé en los Gunks, que en realidad fue mi escuela de trad. La mayoría de los escaladores usaba dobles.",
  },
  {
    id: "dobles",
    type: "field",
    tone: "paper",
    kicker: "Dobles",
    paras: [
      "La ventaja de las dobles, para las aproximaciones, es que es más fácil dividir la carga entre la cordada. Tienes una cuerda redundante. Y si el pegue es zigzagueante, puedes gestionar mejor las cuerdas para evitar el roce de esos zigzags y no tener que extender tanto.",
      "Otra cosa que he aprendido con el tiempo: si decido usar dobles, también puedo llevar menos cintas runners —pesan más que una express liviana— y es más fácil de gestionar para chapar.",
    ],
    share:
      "La ventaja de las dobles, para las aproximaciones, es que es más fácil dividir la carga entre la cordada. Tienes una cuerda redundante. Y si el pegue es zigzagueante, puedes gestionar mejor las cuerdas para evitar el roce de esos zigzags y no tener que extender tanto.\n\nOtra cosa que he aprendido con el tiempo: si decido usar dobles, también puedo llevar menos cintas runners —pesan más que una express liviana— y es más fácil de gestionar para chapar.",
  },
  {
    id: "foto-dobles",
    type: "photo",
    src: "/estetica/feed/dobles-beal.jpg",
    alt: "Escalador en fisura con dos cuerdas dobles",
    caption: "Dobles. Rosa y celeste.",
    object: "object-[50%_80%]",
    share: "Dobles: dos cuerdas, rosa y celeste.",
  },
  {
    id: "simple",
    type: "field",
    tone: "beige",
    kicker: "Simple y tagline",
    paras: [
      "Ahora bien, últimamente me he motivado más por usar cuerda simple y tagline. Tiene una serie de beneficios que no tienen las dobles.",
      "Si uno escala harto deportiva, usar una sola cuerda para chapar —sobre todo en pegues más cerca de tus límites— se siente más natural. Escalas con menos peso colgando: dos cuerdas en el arnés pesan más que una más un tagline.",
      "Si vas a hacer rutas muy largas, o vas a abrir y quieres llevar cosas, nosotros preferimos un petate o una mochila como petate. El tagline sirve para subirla.",
    ],
    share:
      "Ahora bien, últimamente me he motivado más por usar cuerda simple y tagline. Tiene una serie de beneficios que no tienen las dobles.\n\nSi uno escala harto deportiva, usar una sola cuerda para chapar —sobre todo en pegues más cerca de tus límites— se siente más natural. Escalas con menos peso colgando: dos cuerdas en el arnés pesan más que una más un tagline.\n\nSi vas a hacer rutas muy largas, o vas a abrir y quieres llevar cosas, nosotros preferimos un petate o una mochila como petate. El tagline sirve para subirla.",
  },
  {
    id: "de-a-tres",
    type: "field",
    tone: "paper",
    kicker: "De a tres",
    paras: [
      "Uno de los contras: con cuerda simple no pueden escalar tres personas con la misma facilidad. Con técnicas más avanzadas sí se puede, pero la cordada necesita más oficio. Con un par de dobles es más sencillo: cada escalador que sigue el largo se une a una de las dos cuerdas.",
    ],
    share:
      "Uno de los contras: con cuerda simple no pueden escalar tres personas con la misma facilidad. Con técnicas más avanzadas sí se puede, pero la cordada necesita más oficio. Con un par de dobles es más sencillo: cada escalador que sigue el largo se une a una de las dos cuerdas.",
  },
  {
    id: "rapeles",
    type: "field",
    tone: "canvas",
    kicker: "Rapeles",
    paras: [
      "La ventaja de las dobles es sobre todo la transición. Quien llega abajo ya puede preparar el rapel siguiente y pasar por la anilla la cuerda que hay que tirar. Cuando todos rapelaron el largo de arriba y empiezan a recuperar, se recupera a través de la anilla, se deja caer, y se intercambiaron las cuerdas que hay que tirar para el siguiente. Bastante eficiente.",
      "Lo que sí: siempre tenemos mucho respeto con los rapeles, sobre todo cuando la cuerda cae en caída libre. Esa es la oportunidad para que quede trabada.",
    ],
    share:
      "La ventaja de las dobles es sobre todo la transición. Quien llega abajo ya puede preparar el rapel siguiente y pasar por la anilla la cuerda que hay que tirar. Cuando todos rapelaron el largo de arriba y empiezan a recuperar, se recupera a través de la anilla, se deja caer, y se intercambiaron las cuerdas que hay que tirar para el siguiente. Bastante eficiente.\n\nLo que sí: siempre tenemos mucho respeto con los rapeles, sobre todo cuando la cuerda cae en caída libre. Esa es la oportunidad para que quede trabada.",
  },
  {
    id: "tecnica",
    type: "field",
    tone: "beige",
    kicker: "El tagline en el rapel",
    paras: [
      "Con simple y tagline nosotros rapelamos del tagline y recuperamos la cuerda dinámica de forma controlada. Tiene altos riesgos. Es una técnica más avanzada. Recomiendo hacerla solo si entiendes bien lo que estás haciendo. La cuerda gruesa tiene más fricción y más fuerza hacia abajo, y el tagline se puede salir. Hay un accidente reciente en que pasó eso.",
      "Una forma que hemos aprendido de eliminar ese problema: el que va a rapelar segundo deja precargado su ATC en la línea. Eso ya bloquea las cuerdas, ya no pueden correr. Cuando el primero ya rapeló, deja puesto su ATC para que las cuerdas no caminan.",
      "Esto es harto más lento, porque se pierde el beneficio de que el de abajo prepare el siguiente rapel. Pero una cuerda atascada toma mucho más tiempo que cualquiera de las eficiencias que se consiguen con dobles.",
    ],
    share:
      "Con simple y tagline nosotros rapelamos del tagline y recuperamos la cuerda dinámica de forma controlada. Tiene altos riesgos. Es una técnica más avanzada. Recomiendo hacerla solo si entiendes bien lo que estás haciendo. La cuerda gruesa tiene más fricción y más fuerza hacia abajo, y el tagline se puede salir. Hay un accidente reciente en que pasó eso.\n\nUna forma que hemos aprendido de eliminar ese problema: el que va a rapelar segundo deja precargado su ATC en la línea. Eso ya bloquea las cuerdas, ya no pueden correr. Cuando el primero ya rapeló, deja puesto su ATC para que las cuerdas no caminan.\n\nEsto es harto más lento, porque se pierde el beneficio de que el de abajo prepare el siguiente rapel. Pero una cuerda atascada toma mucho más tiempo que cualquiera de las eficiencias que se consiguen con dobles.",
  },
  {
    id: "cuando",
    type: "field",
    tone: "paper",
    kicker: "Herramientas",
    paras: [
      "No siempre se ocupan las mismas.",
      "Si voy a una ruta donde sé que se sale por arriba, con dos personas que no tienen mucha experiencia, en un grado que a mí me acomoda, quizá prefiero dobles. Si vamos de a tres, el peso extra de dos 8.7 se puede repartir en la cordada.",
      "Si voy a una ruta que está a mi máximo, o que voy a abrir, y necesito un tagline, y prefiero gestionar una sola cuerda y que me aseguren con un Grigri, voy a preferir simple y tagline.",
    ],
    share:
      "No siempre se ocupan las mismas.\n\nSi voy a una ruta donde sé que se sale por arriba, con dos personas que no tienen mucha experiencia, en un grado que a mí me acomoda, quizá prefiero dobles. Si vamos de a tres, el peso extra de dos 8.7 se puede repartir en la cordada.\n\nSi voy a una ruta que está a mi máximo, o que voy a abrir, y necesito un tagline, y prefiero gestionar una sola cuerda y que me aseguren con un Grigri, voy a preferir simple y tagline.",
  },
  {
    id: "cable",
    type: "field",
    tone: "canvas",
    kicker: "El tagline",
    paras: [
      "En particular nosotros ocupamos un tagline Black Diamond de 6 mm que es como un cable, hecho para rapelar. Cuando cae, al ser un cable no genera los loops que se quedan trabados en la fisura, en los cachos de roca o en la vegetación.",
    ],
    share:
      "En particular nosotros ocupamos un tagline Black Diamond de 6 mm que es como un cable, hecho para rapelar. Cuando cae, al ser un cable no genera los loops que se quedan trabados en la fisura, en los cachos de roca o en la vegetación.",
  },
  {
    id: "papeo",
    type: "field",
    tone: "editorial-light",
    kicker: "¿Y para el Apidame?",
    feature: "dos cuerdas",
    meta: ["Cerro Apidame", "simple + tagline"],
    paras: [
      "En el Cerro Apidame se necesitan sí o sí dos cuerdas, a menos que quieras comprometerte a salir por arriba.",
      "Nosotros preferimos últimamente ir con cuerda simple y tagline. Normalmente llevamos un petate con chapas para hacer mantención a las reuniones, o porque estamos abriendo una vía nueva. Las rutas suelen ser bastante rectas, así que no se necesitan cuerdas dobles para evitar roce.",
    ],
    share:
      "En el Cerro Apidame se necesitan sí o sí dos cuerdas, a menos que quieras comprometerte a salir por arriba.\n\nNosotros preferimos últimamente ir con cuerda simple y tagline. Normalmente llevamos un petate con chapas para hacer mantención a las reuniones, o porque estamos abriendo una vía nueva. Las rutas suelen ser bastante rectas, así que no se necesitan cuerdas dobles para evitar roce.",
  },
  {
    id: "papeo-invitado",
    type: "field",
    tone: "editorial-dark",
    kicker: "¿Y para el Apidame?",
    feature: "Simple + Tag",
    meta: ["visita", "simple 60 m", "tagline 65 m"],
    paras: [
      "Si tenemos un invitado que no sabe hacer solo-top con Micro Traxion, llevaríamos dos cuerdas dobles.",
      "Si vienes de visita, te recomendaría una cuerda simple de 60 m y un tagline de 65 m. Esos 5 m de diferencia son porque los taglines suelen ser estáticos y las cuerdas dinámicas elongan: así tienen la misma distancia.",
    ],
    share:
      "Si tenemos un invitado que no sabe hacer solo-top con Micro Traxion, llevaríamos dos cuerdas dobles.\n\nSi vienes de visita, te recomendaría una cuerda simple de 60 m y un tagline de 65 m. Esos 5 m de diferencia son porque los taglines suelen ser estáticos y las cuerdas dinámicas elongan: así tienen la misma distancia.",
  },
];

export const cuerdasPost: FeedPostData = {
  slug: "cuerdas-dobles-o-simple-y-tagline",
  title: "¿Cuerdas dobles o cuerda simple y tagline?",
  description:
    "Una nota personal sobre elegir y gestionar cuerdas dobles o cuerda simple con tagline en multilargos, aproximaciones y rapeles.",
  og: {
    title: "¿Dobles o simple + tagline?",
    subtitle: "Criterios de cordada para multilargos y rapeles",
    imageAlt:
      "Notas de cordada de Apidame: cuerdas dobles o cuerda simple y tagline",
  },
  cards: postCards,
};

export const cintasPost: FeedPostData = cintasJson as FeedPostData;

export const posts: readonly FeedPostData[] = [cuerdasPost, cintasPost];
export const cards = cuerdasPost.cards;
export const papeoIndex = cards.findIndex((card) => card.id === "papeo");

export type PostCover = {
  src: string;
  alt: string;
  object: string;
};

export function getFeedPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getPostCover(post: FeedPostData): PostCover | undefined {
  const title = post.cards.find((card) => card.type === "title");
  if (!title || title.type !== "title" || !title.art) return undefined;
  return {
    src: title.art,
    alt: title.artAlt ?? post.title,
    object: title.object ?? "object-center",
  };
}

export function findShareCard(cardId: string, postId?: string) {
  if (postId) {
    const post = getFeedPost(postId);
    return post?.cards.find((card) => card.id === cardId);
  }
  return posts.flatMap((post) => post.cards).find((card) => card.id === cardId);
}
