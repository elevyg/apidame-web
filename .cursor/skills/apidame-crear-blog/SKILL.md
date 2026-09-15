---
name: apidame-crear-blog
description: >-
  Crea otra Nota de cordada de Apidame a partir de dictado, fotos reales y
  destile editorial. Úsala para agregar un post al índice y a su URL canónica,
  compuesto por field cards mobile-first, papeo opcional y JPEG compartibles.
---

# Crear otra Nota de cordada

Agrega un post al formato editorial **Notas de cordada**. No es un blog tipo
Medium ni un feed social. La secuencia es **leer el contrato actual → capturar →
conversar → destilar → integrar → verificar**.

Las URLs canónicas son:

- índice: `/notas-de-cordada`;
- post: `/notas-de-cordada/[slug]`;
- primer post: `/notas-de-cordada/cuerdas-dobles-o-simple-y-tagline`.

`/estetica/feed` es un lab, no una URL canónica. No enlaces, publiques metadata ni
armes navegación nueva sobre ese path.

## Leer el contrato actual

Antes de escribir copy o tocar archivos, lee completos:

- `src/components/estetica/feed/posts.ts`
- el renderer que importe esos posts;
- `src/app/notas-de-cordada/` y su route dinámica;
- el endpoint actual de Compartir;
- los estilos de `FillType` y de las field cards.

**`posts.ts` es la fuente de verdad.** Su schema puede cambiar mientras otros
agents trabajan. Usa siempre el shape que encuentres en el working tree, aunque
no coincida con el snapshot de esta skill.

Al escribir esta versión, el archivo ya tiene un registry y este shape:

```ts
type Card = { id: string; share: string } & (
  | { type: "title"; kicker: string; text: string; tone: CardTone; art?: string; artAlt?: string; object?: string }
  | { type: "field"; kicker: string; paras: string[]; tone: CardTone; feature?: string; meta?: string[] }
  | { type: "photo"; src: string; alt: string; caption: string; object?: string }
);

type FeedPostData = {
  slug: string;
  title: string;
  description: string;
  og: { title: string; subtitle: string; imageAlt: string };
  cards: readonly Card[];
};

export const posts: readonly FeedPostData[];
export function getFeedPost(slug: string): FeedPostData | undefined;
```

El papeo es opcional y, en este snapshot, se representa con field cards
editoriales; el renderer busca la primera card cuyo `id` sea `"papeo"` para
mostrar el CTA. Copia el patrón real del registry o tipo actual, no este ejemplo.
Si faltan el registry o las routes canónicas, avisa que el soporte multi-post no
está completo en el working tree antes de inventar una arquitectura paralela.

No agregues un CMS ni rediseñes el sistema para publicar una sola nota.

## 1. Capturar el dictado

Deja que el usuario termine antes de editar o segmentar. Cursor agrega puntos
agresivamente cuando detecta pausas; trátalos como respiraciones mientras la
persona piensa, no como límites de oración ni de card.

1. Reensambla oraciones por sentido.
2. Elimina muletillas sólo cuando no aportan voz.
3. Conserva experiencia, matices, dudas y vocabulario de escalada.
4. Señala términos inciertos y confirma la corrección; no adivines técnica.
5. Devuelve primero una versión continua y legible del relato.

No uses cada frase dictada como una card. Primero recupera el argumento; después
encuentra sus unidades editoriales.

## 2. Conversar antes de destilar

Haz preguntas breves, apoyadas en lo que ya dijo el usuario. Como mínimo,
resuelve:

- **Foto:** «¿Qué foto real quieres como portada y qué parte no se puede
  recortar?»
- **Jerarquía:** «De este bloque, ¿qué es contexto y qué idea quieres que alguien
  se lleve?»
- **Papeo:** «¿Hay una recomendación específica para el Cerro Apidame, o esta
  nota queda sin papeo?»
- **Precisión:** confirma nombres, lugares, equipo y técnicas que el dictado haya
  deformado.

Pide también un título de trabajo y confirma el slug. No conviertas la
conversación en un formulario ni rellenes vacíos técnicos por tu cuenta.

## 3. Crear la entrada en `posts.ts`

Agrega un post al registry actual, sin modificar el primero. Completa según el
shape vigente:

- `slug`: ASCII, minúsculas, kebab-case y único;
- `title`: título editorial visible;
- `description`: resumen fiel y útil para índice, metadata y OG;
- `og`: title, subtitle e imageAlt específicos para compartir;
- `cards`: secuencia completa del post;
- cards de papeo: sólo cuando existe una recomendación local confirmada.

No dupliques `cuerdas-dobles-o-simple-y-tagline`. Los `id` de las cards deben ser
estables y cumplir el alcance de unicidad que exijan el renderer y el endpoint
de Compartir. `share` debe conservar el sentido de la card, no convertirse en
copy promocional.

## 4. Destilar en field cards

La unidad es una **field card full-viewport con scroll-snap vertical**. Cada card
contiene un takeaway completo. Puede tener un párrafo o varios que sostienen el
mismo pensamiento; no es un poster de una oración.

Ordena la nota así:

1. portada;
2. contexto necesario;
3. field cards con ideas completas;
4. fotos reales cuando aporten evidencia o ritmo;
5. papeo local, si existe.

Usa los tipos y campos existentes en `posts.ts`; no agregues variantes para
resolver diferencias menores de copy. Une cards débiles. Mantén separado el
relato general del papeo.

La experiencia debe seguir siendo scroll vertical con snap. No agregues
auto-advance, temporizador, navegación por taps ni layout de artículo largo.

## 5. Usar fotos sin inventar técnica

Usa solamente fotos reales entregadas o aprobadas por el usuario. Pregunta por el
encuadre, el punto focal y un alt text fiel.

Si el usuario entrega una foto, cópiala a `public/`. Para posts nuevos, prefiere
`public/notas-de-cordada/<slug>/` salvo que el repo ya tenga otra convención
canónica. Referencia su URL pública desde `/`, no el path del filesystem. No
hotlinkees un adjunto ni lo dejes en Downloads.

Nunca generes diagramas AI de maniobras de escalada. No inventes Grigri, anclajes,
recorridos de cuerda, reuniones ni hardware que no aparezcan en la foto. Si no
hay una imagen técnicamente honesta, usa una field card de texto o pide otra
foto.

La paleta base de fondos es **blanco, negro y beige**.

## 6. Resolver portada, papeo y tipo

La portada usa una foto real a sangre. El chrome de la app va **sobre el bleed**,
no en una barra que reduzca o tape la foto.

- Mantén contador y cierre discretos.
- Pon título y navegación donde respeten el punto focal.
- Si existe papeo local, incluye un CTA de sección como «Ir al papeo».
- Pon el cue «leer historia» abajo, cerca del contenido, con una indicación
  vertical sutil.
- No ocupes el cielo o la zona visual más limpia con controles.

Si hay papeo, usa la dirección **editorial flat** ya existente: planos duros,
pregunta italic, respuesta regular y metadata chica. No uses foil, linen, stamps,
bordes de carta ni paletas ajenas. El CTA de portada es interfaz, no parte del
objeto compartible.

`FillType` debe medir el espacio útil real después de padding, footer, chrome y
safe areas. Ajusta el rango tipográfico o el espacio reservado si falta contenido.
Nunca cortes texto, uses ellipsis ni escondas el último párrafo.

## 7. Mantener Compartir JPEG

La acción visible se llama **Compartir**. Debe generar un JPEG de esa card, no una
captura del viewport completo.

Integra las cards nuevas con el mecanismo existente. Verifica que la identidad
enviada al endpoint sea inequívoca para el post y la card; sigue el contrato
actual si usa `postId`, `cardId` u otro shape. No abras un segundo endpoint sólo
para el post nuevo.

El JPEG debe incluir el ícono de Apidame y `apidame.com`, y excluir contador,
Cerrar, CTA, estado del botón y demás chrome. Usa Web Share cuando acepte el
archivo y descarga como fallback. Verifica el JPEG real, no sólo el DOM.

## 8. Publicar metadata y OG

El índice y cada post deben exponer metadata canónica. Sigue el patrón actual de
Next.js y deriva los datos del registry, no de parámetros sin validar.

Para `/notas-de-cordada/[slug]`, verifica:

- `title` y `description` del post;
- `alternates.canonical` con `/notas-de-cordada/<slug>`;
- `openGraph.title`, `openGraph.description`, `openGraph.url` e imagen real de
  portada con alt fiel;
- comportamiento de slug inexistente según la route actual.

La metadata, los OG assets y los links del índice nunca deben apuntar a
`/estetica/feed`.

## 9. Verificar mobile y voz

Prueba el índice, la URL directa del post y Compartir en un viewport mobile
realista. Revisa snap, safe areas, portada, `FillType`, scroll completo y el JPEG
resultante. Ejecuta los checks de lint y TypeScript que ya use el repo.

Escribe en español chileno con tuteo, sin voseo. Mantén el vocabulario técnico en
inglés cuando así lo use el equipo. Escribe **Apidame**, con i latina. Corrige el
dictado sin borrar la voz de la persona.

## Listo para share

- [ ] El dictado quedó reconstruido por sentido, no por puntuación automática.
- [ ] Cada field card contiene un takeaway completo y no una frase decorativa.
- [ ] `posts.ts` se leyó como fuente de verdad y el post respeta su shape actual.
- [ ] El slug es único y la descripción sirve para índice, metadata y OG.
- [ ] Todas las fotos son reales, aprobadas y técnicamente honestas.
- [ ] La portada respeta el bleed, el punto focal y el cue de scroll.
- [ ] El papeo es opcional y, si existe, usa editorial flat.
- [ ] La URL canónica vive bajo `/notas-de-cordada`.
- [ ] En mobile no se corta ninguna línea ni el footer, y el snap funciona.
- [ ] Compartir genera el JPEG de la card correcta.
- [ ] El JPEG lleva ícono, `apidame.com` y no incluye chrome de la app.
- [ ] Metadata y OG usan el post y su portada real.
- [ ] La voz suena chilena, usa tuteo y escribe Apidame correctamente.

## Anti-patrones

- Publicar o enlazar `/estetica/feed` como destino final.
- Copiar el singleton antiguo sin leer el registry vigente.
- Demasiadas cards de una oración.
- Portada AI con técnica de escalada inventada.
- Diagramas de gear o maniobras no confirmadas por el usuario.
- Foil, linen o bordes que rompen el lenguaje editorial flat.
- Chrome arriba tapando la foto o el cielo.
- Copiar la paleta de una campaña usada sólo como referencia.
- Agregar CMS, auto-advance o una arquitectura paralela para un post.
