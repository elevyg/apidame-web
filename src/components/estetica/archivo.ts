export type ArchivoShot = {
  file: string;
  title: string;
  note: string;
  score?: number;
  use?: string;
};

export const muroShots: ArchivoShot[] = [
  {
    file: "sesion-habitada.jpg",
    title: "Sesión habitada",
    score: 10,
    use: "puerta",
    note: "Gente usando el recinto. Esta es la puerta.",
  },
  {
    file: "setting-techo.jpg",
    title: "Setting en el techo",
    score: 9,
    use: "proceso",
    note: "Crear el muro, no posar frente a él.",
  },
  {
    file: "construccion-mitad.jpg",
    title: "Mitad obra, mitad muro",
    score: 8,
    use: "proceso",
    note: "El proyecto a medio armar. Fuerte para el sistema, no para la puerta pública.",
  },
  {
    file: "galpon-nieve-b.jpg",
    title: "Galpón con nieve",
    score: 8,
    use: "lugar",
    note: "El recinto en Chile Chico. Lugar, no interior.",
  },
  {
    file: "galpon-nieve-a.jpg",
    title: "Galpón con nieve, más cerca",
    score: 7,
    use: "lugar",
    note: "Misma toma, un poco más sucia de reflejo.",
  },
  {
    file: "panel-volumen.jpg",
    title: "Panel y volumen AA",
    score: 7,
    use: "textura",
    note: "El muro como objeto. Sin gente.",
  },
  {
    file: "galpon-nieve-perros.jpg",
    title: "Galpón, cerco y perros",
    score: 7,
    use: "lugar",
    note: "Vida alrededor. El galpón queda chico.",
  },
  {
    file: "sala-vacia.jpg",
    title: "Sala vacía",
    score: 6,
    use: "archivo",
    note: "Documenta el espacio. Cable y cajas de magnesio en primer plano.",
  },
  {
    file: "construccion-eyal.jpg",
    title: "Estructura con Eyal",
    score: 6,
    use: "proceso",
    note: "Hacer. Queda como retrato y como obra inconclusa.",
  },
  {
    file: "galpon-noche.jpg",
    title: "Galpón de noche",
    score: 6,
    use: "lugar",
    note: "Atmósfera. Oscura para un sitio que quiere papel blanco.",
  },
  {
    file: "construccion-colchones-b.jpg",
    title: "Obra con colchones",
    score: 6,
    use: "archivo",
    note: "Casi la misma que la otra de colchones.",
  },
  {
    file: "construccion-colchones-a.jpg",
    title: "Obra con colchones, más corta",
    score: 5,
    use: "archivo",
    note: "Redundante con la anterior.",
  },
  {
    file: "bn-luna.jpg",
    title: "B/N luna y volumen",
    score: 5,
    use: "editorial",
    note: "Fuerte como foto. No dice “ven a escalar”.",
  },
  {
    file: "construccion-vacio.jpg",
    title: "Estructura vacía",
    score: 5,
    use: "archivo",
    note: "Proceso sin persona.",
  },
  {
    file: "bn-rincon.jpg",
    title: "B/N rincón",
    score: 4,
    use: "editorial",
    note: "Misma serie B/N, menos clara.",
  },
  {
    file: "bn-kilter.jpg",
    title: "B/N kilter",
    score: 4,
    use: "editorial",
    note: "La barra domina. Poco recinto.",
  },
];

export const deportivaShots: ArchivoShot[] = [
  {
    file: "lago.jpg",
    title: "Escalador y el lago",
    score: 10,
    use: "puerta",
    note: "La vía y el territorio en el mismo cuadro. Esto es Chile Chico.",
  },
  {
    file: "pared-bici.jpg",
    title: "Pared, cordadas y bici",
    score: 9,
    use: "puerta",
    note: "Comunidad en la base. Casi tan fuerte como el lago.",
  },
  {
    file: "chaqueta-roja.jpg",
    title: "Chaqueta roja",
    score: 8,
    use: "escala",
    note: "La persona chica, la pared grande.",
  },
  {
    file: "farallon.jpg",
    title: "Farallón al atardecer",
    score: 8,
    use: "lugar",
    note: "Establece el sector. Sin gente.",
  },
  {
    file: "atardecer-base.jpg",
    title: "Atardecer desde la base",
    score: 8,
    use: "lugar",
    note: "El cielo pone el color. La pared entra de canto.",
  },
  {
    file: "segundo.jpg",
    title: "Segundo de cuerda",
    score: 8,
    use: "hacer",
    note: "Habitada, desde adentro de la vía.",
  },
  {
    file: "escalador-placa.jpg",
    title: "Escalador en placa",
    score: 8,
    use: "hacer",
    note: "Clásica. Menos lugar que el lago.",
  },
  {
    file: "primer-plano.jpg",
    title: "Primer plano en fisura",
    score: 7,
    use: "hacer",
    note: "Buena acción. Recorta el territorio.",
  },
  {
    file: "sendero-pueblo.jpg",
    title: "Sendero al pueblo de noche",
    score: 7,
    use: "lugar",
    note: "Volver. No es una vía.",
  },
  {
    file: "luna.jpg",
    title: "Luna sobre la pared",
    score: 6,
    use: "atmósfera",
    note: "Bella y sin escalada.",
  },
  {
    file: "cuerdas.jpg",
    title: "Cuerdas desde abajo",
    score: 5,
    use: "archivo",
    note: "La vía está, la persona no.",
  },
  {
    file: "pared-matorral.jpg",
    title: "Pared y matorral",
    score: 4,
    use: "archivo",
    note: "Roca. Poco que contar.",
  },
];

export const presentacionShots: ArchivoShot[] = [
  {
    file: "proa-aerea.jpg",
    title: "Proa, aérea",
    note: "Sergi Ricart. El cerro del hero.",
  },
  {
    file: "columnas-lago.jpg",
    title: "Columnas y el lago",
    note: "La vía, el valle y el General Carrera.",
  },
  {
    file: "columnas-sol.jpg",
    title: "Columnas al sol",
    note: "Escala. El escalador entra chico.",
  },
  {
    file: "anfiteatro.jpg",
    title: "Anfiteatro",
    note: "Aérea. El macizo entero.",
  },
  {
    file: "escudo.jpg",
    title: "Escudo",
    note: "Aérea.",
  },
  {
    file: "pie-de-via.jpg",
    title: "Pie de vía",
    note: "Habitada, desde la base.",
  },
  {
    file: "columnas-cenital.jpg",
    title: "Cenital",
    note: "La persona en la columna.",
  },
  {
    file: "cerro-primavera.jpg",
    title: "Primavera",
    note: "El cerro con el piso florecido.",
  },
];
