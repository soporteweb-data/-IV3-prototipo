# Prototipo IV3 Arquitectura

Prototipo del sitio [iv3arquitectura.com](https://iv3arquitectura.com/) — en línea en
https://soporteweb-data.github.io/-IV3-prototipo/

| Página | Archivo | Cambios frente al sitio actual |
|---|---|---|
| Inicio | `index.html` | Se retiraron "IV3 Arquitectura" (con contadores) y "Cuatro pilares". Nueva sección de testimonios (carrusel) debajo de "Diseñar es escuchar". |
| Portafolio | `portafolio.html` | Sin cambios de contenido. |
| Contacto | `contacto.html` | Sin cambios de contenido. |
| Sobre nosotros | `sobre-nosotros.html` | Página nueva: hero con cifras, /01 IV3 Arquitectura, /02 Trayectoria, /03 Cuatro pilares, /04 Nuestro enfoque, /05 Identidad arquitectónica y la sección de contacto. |

Menú: Inicio · Portafolio · Contacto · Sobre nosotros (también en la barra inferior móvil y el footer).

## Integración en WordPress

La carpeta **`wordpress/`** trae lo necesario para llevar las secciones nuevas al sitio con Elementor
(un CSS, un JS y un HTML por sección) y su propio README con los pasos.

## Estructura

```
secciones/                  ← fuente de cada sección nueva (la usa el prototipo y el paquete de WP)
assets/css/iv3-secciones.css← estilos de las secciones nuevas (los mismos que van a WordPress)
assets/js/iv3-secciones.js  ← carrusel, cifras y animaciones (los mismos que van a WordPress)
assets/css/prototipo.css    ← solo prototipo: reemplaza el JS de Elementor en el clon estático
assets/js/site.js           ← solo prototipo: menú, pestañas, paginación y formularios de prueba
wordpress/                  ← paquete listo para integrar
```

## Verlo en local

```bash
python -m http.server 8000
```

y abrir http://localhost:8000. Los formularios **no envían datos** (prototipo).
