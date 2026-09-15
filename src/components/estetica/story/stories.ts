export type SolidBeat = {
  type: "solid";
  tone: "paper" | "ink";
  kicker?: string;
  text: string;
  note?: string;
};

export type PhotoBeat = {
  type: "photo";
  src: string;
  alt: string;
  caption?: string;
};

export type VideoBeat = {
  type: "video";
  poster: string;
  src?: string;
  alt: string;
  caption?: string;
};

export type Beat = SolidBeat | PhotoBeat | VideoBeat;

export type Story = {
  id: string;
  title: string;
  place: string;
  beats: Beat[];
};

export const stories: Story[] = [
  {
    id: "proa",
    title: "La Proa",
    place: "Cerro Apidame",
    beats: [
      {
        type: "solid",
        tone: "ink",
        kicker: "Cerro Apidame",
        text: "La Proa,\nun día de abril.",
      },
      {
        type: "photo",
        src: "/estetica/presentacion/proa-aerea.jpg",
        alt: "La Proa desde el aire",
        caption: "La Proa",
      },
      {
        type: "solid",
        tone: "paper",
        kicker: "Condición",
        text: "Viento norte.\nLa placa todavía seca.",
      },
      {
        type: "photo",
        src: "/estetica/presentacion/columnas-sol.jpg",
        alt: "Columnas al sol",
        caption: "Columnas",
      },
      {
        type: "video",
        poster: "/estetica/presentacion/escalador-columnas.jpg",
        alt: "Escalador en las columnas",
        caption: "autoplay · 9:16",
      },
      {
        type: "solid",
        tone: "ink",
        kicker: "La vía",
        text: "6 largos.\nIV+",
        note: "Proa — Repisa",
      },
    ],
  },
  {
    id: "muro",
    title: "El galpón",
    place: "Chile Chico",
    beats: [
      {
        type: "solid",
        tone: "paper",
        kicker: "Muro",
        text: "Nieve en el techo.\nHoy no se abre.",
      },
      {
        type: "photo",
        src: "/estetica/muro/galpon-nieve-b.jpg",
        alt: "El galpón con nieve",
        caption: "El galpón",
      },
      {
        type: "solid",
        tone: "ink",
        kicker: "Aviso",
        text: "Volvemos cuando\nescampe el zinc.",
      },
      {
        type: "photo",
        src: "/estetica/muro/sesion-habitada.jpg",
        alt: "Sesión en el muro",
        caption: "Cuando abre",
      },
    ],
  },
];
