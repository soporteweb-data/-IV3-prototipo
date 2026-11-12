# Prototipo IV3 Arquitectura

Prototipo estático del sitio [iv3arquitectura.com](https://iv3arquitectura.com/) con 4 páginas:

| Página | Archivo | Cambios frente al sitio actual |
|---|---|---|
| Inicio | `index.html` | Se retiraron las secciones "IV3 Arquitectura" y "Cuatro pilares". Nueva sección de testimonios de clientes (carrusel) debajo de "Diseñar es escuchar". |
| Sobre nosotros | `sobre-nosotros.html` | Página nueva: contenido retirado de Inicio + trayectoria, enfoque e identidad arquitectónica. |
| Portafolio | `portafolio.html` | Sin cambios de contenido. |
| Contacto | `contacto.html` | Sin cambios de contenido. |

El menú, la barra inferior en móvil y el pie de página incluyen el enlace a "Sobre nosotros".

## Cómo verlo

Desde esta carpeta:

```bash
python -m http.server 8000
```

y abrir http://localhost:8000. (Si se abre `index.html` con doble clic, la fuente Century puede no cargar.)

## Notas

- Los formularios **no envían datos**: muestran un mensaje de confirmación de prototipo.
- Estilos, fuentes e imágenes se copiaron del sitio actual a `assets/`. Los estilos nuevos están en `assets/css/prototipo.css` y el comportamiento (carrusel, contadores, pestañas, paginación, menú) en `assets/js/site.js`.
- Fotos de testimonios: `assets/testimonios/`.
