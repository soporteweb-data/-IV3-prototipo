# Integración en WordPress (Elementor) — IV3 Arquitectura

Este paquete trae **solo lo nuevo**: la sección de testimonios de Inicio y la página "Sobre nosotros".
Portafolio y Contacto no cambian. Todo el código usa clases con prefijo `iv3-`, así que no choca
con Elementor ni con el tema, y usa la fuente **Century** que el sitio ya tiene cargada.

```
wordpress/
├── iv3-secciones.css          ← estilos de todas las secciones nuevas (una sola vez en el sitio)
├── iv3-secciones.js           ← carrusel, cifras animadas y animación de entrada (una sola vez)
├── imagenes-para-subir/       ← 4 fotos de testimonios para la Biblioteca de medios
└── secciones/                 ← un archivo = un widget HTML de Elementor
    ├── inicio-testimonios.html
    ├── nosotros-01-hero.html
    ├── nosotros-02-iv3.html
    ├── nosotros-03-trayectoria.html
    ├── nosotros-04-pilares.html
    ├── nosotros-05-enfoque.html
    └── nosotros-06-identidad.html
```

Las imágenes que ya existen en el sitio (logo IV3, foto "Nosotros", Ciudadela El Dorado) apuntan a
sus URLs reales en `iv3arquitectura.com/wp-content/uploads/…`. Solo hay que subir las de testimonios.

---

## 1. CSS y JS (una sola vez para todo el sitio)

**CSS** — elige una opción:
- Elementor → *Ajustes del sitio* → *CSS personalizado* → pega el contenido de `iv3-secciones.css`.
- o *Apariencia → Personalizar → CSS adicional*.

**JS** — elige una opción:
- Plugin **WPCode** → *Añadir snippet* → *JavaScript* → pega `iv3-secciones.js` → ubicación
  *Pie de página en todo el sitio* → activar.
- o en cada página que lo use, un widget HTML al final con `<script>` + el contenido del archivo.
  (El JS se protege para no ejecutarse dos veces.)

Si el JS no carga, las secciones se ven igual pero sin animaciones ni carrusel automático.

## 2. Fotos de testimonios

1. *Medios → Añadir nuevo* → sube los 4 archivos de `imagenes-para-subir/`.
2. Copia la URL de cada una y reemplázala en `inicio-testimonios.html` donde dice
   `https://iv3arquitectura.com/wp-content/uploads/SUBIR-AQUI/Testimonio_N.jpeg`.
   Cada foto aparece **dos veces**: en la foto grande (`<img>`) y en el avatar redondo
   (`background-image` del `iv3-tavatar`). Con "Buscar y reemplazar" se cambian ambas.
3. Si tienen los nombres de los clientes, cámbienlos en cada `Cliente IV3 Arquitectura`.

## 3. Inicio

1. Edita *Inicio* con Elementor.
2. Elimina los contenedores **"Cuatro pilares, un mismo oficio."**, **"IV3 Arquitectura"** y el de
   **contadores** (26 años · 1,500+ · 3 · 100.000 m²). Ese contenido ahora vive en Sobre nosotros.
3. Debajo del contenedor oscuro **"Diseñar es escuchar…"** agrega un contenedor nuevo:
   - *Ancho del contenido*: **Ancho completo** · *Relleno*: **0** en los 4 lados · *Separación*: 0.
   - Dentro, un widget **HTML** con el contenido de `secciones/inicio-testimonios.html`.

## 4. Página "Sobre nosotros"

1. *Páginas → Añadir nueva* → título **Sobre nosotros** (slug `sobre-nosotros`) → plantilla
   **Elementor ancho completo** (mantiene header y footer).
2. Para cada archivo `nosotros-0N-….html`, en orden del 01 al 06:
   contenedor **ancho completo, relleno 0** + widget **HTML** con el contenido del archivo.
   (También se pueden pegar los 6 en un solo widget HTML, uno debajo del otro.)
3. Al final agrega la sección de contacto **"¿Buscas invertir o construir con nosotros?"** que ya
   existe en Inicio: en Inicio, clic derecho sobre ese contenedor → *Guardar como plantilla*, y aquí
   insértala desde *Mis plantillas* (o cópiala y pégala).
4. *Ajustes de la página* (SEO): título "Sobre nosotros | IV3 Arquitectura" y la descripción que prefieran.

## 5. Menú (header y footer)

En *Plantillas → Theme Builder → Header* (y *Footer*):
- **Mega menú (escritorio)**: agrega el ítem **Sobre nosotros** → `/sobre-nosotros/`, **después de Contacto**.
  Orden final: Inicio · Portafolio · Contacto · Sobre nosotros.
- **Barra inferior en móvil** (cuadros de ícono): duplica el de *Contacto*, cambia el texto a
  **Nosotros**, el ícono a *fas fa-users* y el enlace a `/sobre-nosotros/`. Queda de última.
- **Footer** (lista "Portafolio | Contacto"): agrega **Sobre nosotros** al final.

## Cuidados importantes (probado sobre el sitio real)

Estas secciones se probaron insertándolas en iv3arquitectura.com con su tema, Elementor y estilos
reales: se ven y funcionan igual que en el prototipo (escritorio y móvil, sin desbordes). Para que
quede igual en producción:

1. **Usa el widget "HTML"**, no el de "Editor de texto": el editor de texto agrega `<p>` y `<br>`
   automáticamente y desarma el diseño.
2. **El CSS debe cargar en el `<head>`** (Ajustes del sitio → CSS personalizado, o CSS adicional del
   Personalizador). Si se carga tarde, por un instante se ven los 4 testimonios encimados.
3. **Contenedores en ancho completo y relleno 0**: Elementor pone por defecto contenido "en caja" y
   10 px de relleno; si se deja así, las secciones quedan con márgenes blancos.
4. **Página Sobre nosotros**: el slug debe ser `sobre-nosotros` (los enlaces apuntan ahí) y hay que
   activar *Ocultar título* en los ajustes de la página, porque el hero ya trae el título (H1).
5. **Plugins de caché/optimización** (LiteSpeed, WP Rocket, Autoptimize…): si tienen "retrasar JS",
   excluye `iv3-secciones` para que el carrusel y las cifras arranquen de inmediato. Después de
   publicar, purga la caché.
6. Pegar `<script>` en widgets HTML requiere un usuario **Administrador**.

## Notas

- Los textos se editan dentro del widget HTML (son párrafos y títulos normales).
- Los cortes responsive son los mismos de Elementor (1024 px tablet, 767 px móvil).
- Si en algún momento se quiere editar todo con widgets nativos de Elementor (sin HTML), se puede
  convertir a una plantilla `.json` importable.
