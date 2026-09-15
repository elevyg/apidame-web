---
name: apidame-crear-blog
description: >-
  Crea posts, blogs y feeds de Apidame a partir de dictado mediante conversación
  y destile editorial. Úsala cuando el usuario quiera convertir una idea hablada
  en field cards mobile-first, con fotos reales, sección local o papeo y cards
  compartibles, en vez de un artículo tipo Medium.
---

# Crear un post de Apidame

Convierte el dictado en una pieza editorial de Apidame. La secuencia es
**capturar → conversar → destilar → probar la forma con el usuario → compartir**.
No conviertas el dictado directamente en slides ni lo fuerces a una plantilla de
blog.

## Antes de empezar

Si trabajas en `apidame-web`, revisa primero el estado actual de:

- `src/components/estetica/feed/FeedPost.tsx`
- `src/components/estetica/feed/posts.ts`
- `src/components/estetica/feed/cuerdas.md`, si existe
- `src/app/estetica/feed/`
- `src/app/api/estetica/feed/share/route.ts`

No reemplaces decisiones vigentes por un sistema nuevo. El feed es un lab:
mantén el copy en TypeScript o Markdown. No agregues un CMS salvo que el usuario
lo pida.

## 1. Capturar el dictado

Deja que el usuario termine antes de editar o segmentar. Cursor agrega puntos
agresivamente cuando detecta pausas; trátalos como respiraciones mientras la
persona piensa, no como límites de oración ni de card.

1. Reensambla oraciones por sentido.
2. Elimina muletillas sólo cuando no aportan voz.
3. Conserva experiencia, matices, dudas y vocabulario de escalada.
4. Señala términos inciertos y confirma la corrección; no adivines técnica.
5. Devuelve primero una versión continua y legible del relato.

No uses cada frase dictada como una slide. Primero recupera el argumento; después
encuentra sus unidades editoriales.

## 2. Conversar antes de destilar

Haz preguntas breves, apoyadas en lo que ya dijo el usuario. Como mínimo,
resuelve:

- **Foto:** «¿Qué foto real quieres como portada y qué parte no se puede
  recortar?»
- **Jerarquía:** «De este bloque, ¿qué es contexto y qué idea quieres que alguien
  se lleve?»
- **Sección local:** «¿Hay un papeo para el Cerro Apidame, o esta pieza queda como
  ensayo general?»
- **Precisión:** confirma nombres, lugares, equipo y técnicas que el dictado haya
  deformado.

No conviertas esto en un formulario. Pregunta durante la conversación y muestra
cómo cada respuesta cambia la pieza. Si el usuario pide conversar sobre una
dirección visual, no la implementes antes de que la elija.

## 3. Destilar en field cards

Medium es el anti-modelo. Tampoco construyas IG Stories con auto-advance,
temporizador o navegación a taps.

La unidad es una **field card full-viewport con scroll-snap vertical**. Cada card
contiene un takeaway que alguien podría «llevarse» o compartir. Un takeaway suele
ser un párrafo, o varios párrafos que sostienen el mismo pensamiento; no es un
poster de una oración.

Propón al usuario un orden breve:

1. portada;
2. contexto necesario;
3. field cards con ideas completas;
4. fotos reales cuando aporten evidencia o ritmo;
5. papeo local, si existe.

Explica por qué cada corte corresponde a un cambio de idea. Une cards débiles en
vez de inflar el conteo. Mantén separado el relato general del consejo local.

## 4. Usar fotos sin inventar técnica

Usa solamente fotos reales entregadas o aprobadas por el usuario. Pregunta por el
encuadre, el punto focal y un alt text fiel.

Si el usuario adjunta una foto, entrega un path local, un archivo en Downloads o
assets del chat, cópiala siempre a `public/` del repo (convención actual:
`public/estetica/feed/` o la carpeta del post) y referencia la URL pública
(`/estetica/feed/...`). No dejes el path temporal del adjunto, no hotlinkees
archivos fuera del repo ni uses la imagen del chat sin copiarla al repo.

Nunca generes diagramas AI de maniobras de escalada. No inventes Grigri, anclajes,
recorridos de cuerda, reuniones ni hardware que no aparezcan en la foto. Si no
hay una imagen técnicamente honesta, usa una field card de texto o pide otra
foto.

La paleta base de fondos es **blanco, negro y beige**.

## 5. Resolver la portada

La portada usa una foto real a sangre. El chrome de la app va **sobre el bleed**,
no en una barra que reduzca o tape la foto.

- Mantén contador y cierre discretos.
- Pon título y navegación donde respeten el punto focal.
- Si existe papeo local, incluye un CTA de sección como «Ir al papeo».
- Pon el cue «leer historia» abajo, cerca del contenido, con una indicación
  vertical sutil.
- No ocupes el cielo o la zona visual más limpia con controles.

El CTA debe leerse como interfaz. No lo disfraces de foil, souvenir ni parte del
objeto compartible.

## 6. Iterar la forma con el usuario

Separa contenido y forma: valida primero la reconstrucción y los takeaways;
después prueba el lenguaje visual. Presenta experimentos como hipótesis y
pregunta qué sensación producen en lectura real.

En esta exploración se descartaron dos metáforas:

- el foil holográfico no consiguió que la pieza pesara como objeto;
- el linen, el stamp y los bordes de «carta física» no servían cuando el usuario
  quería una página flat.

Para slides especiales de papeo, la dirección que sí cerró fue **editorial flat**:
planos duros, pregunta italic, respuesta regular, metadata chica y una paleta
propia de Apidame. El chrome queda fuera de esa página impresa. No copies colores
de campañas o referencias ajenas; toma su gramática, no su identidad.

Descarta una propuesta cuando no logra la sensación buscada. No sigas
perfeccionando un efecto sólo porque ya está implementado.

## 7. Hacer compartible cada card

La acción visible se llama **Compartir**. Debe generar un JPEG de esa card, no una
captura del viewport completo.

1. Captura el objeto de la card en el cliente.
2. Envía la imagen y el `postId` a una server function que valide y produzca
   `image/jpeg`.
3. Usa Web Share con el archivo cuando esté disponible.
4. Si Web Share no funciona, descarga el JPEG.
5. Incluye el ícono de Apidame y `apidame.com` en una esquina del JPEG.
6. Excluye contador, Cerrar, CTA, estado del botón y demás chrome de app.

La versión compartida debe conservar la jerarquía de la card. Verifica el JPEG
real, no sólo el DOM.

## 8. Verificar mobile y voz

Prueba al menos un viewport mobile realista. `FillType` debe medir el espacio
útil después de márgenes, padding, footer, chrome y safe areas. Si faltan líneas,
reduce el tipo o reserva más espacio; nunca cortes, uses ellipsis ni ocultes el
último párrafo.

Escribe en español chileno con tuteo, sin voseo. Mantén el vocabulario técnico en
inglés cuando así lo use el equipo. Escribe **Apidame**, con i latina. Corrige el
dictado sin borrar la voz de la persona.

## Listo para share

- [ ] El dictado quedó reconstruido por sentido, no por puntuación automática.
- [ ] Cada field card contiene un takeaway completo y no una frase decorativa.
- [ ] El usuario distinguió contexto, takeaway y papeo local.
- [ ] Todas las fotos son reales, aprobadas y técnicamente honestas.
- [ ] La portada respeta el bleed, el punto focal y el cue de scroll.
- [ ] Las cards de papeo usan editorial flat si esa sigue siendo la dirección
      aprobada.
- [ ] En mobile no se corta ninguna línea ni el footer.
- [ ] Compartir genera el JPEG de la card correcta.
- [ ] El JPEG lleva ícono, `apidame.com` y no incluye chrome de la app.
- [ ] La voz suena chilena, usa tuteo y escribe Apidame correctamente.

## Anti-patrones de esta exploración

- Demasiadas cards de una oración.
- Portada AI con técnica de escalada inventada.
- Foil holográfico usado como CTA.
- Linen fingiendo carta cuando el usuario pidió una página flat.
- Chrome arriba tapando la foto o el cielo.
- Copiar la paleta de una campaña usada sólo como referencia.
- Implementar un efecto mientras el usuario todavía quiere conversar la forma.
- Agregar CMS, auto-advance o arquitectura editorial que el lab no necesita.
