/* IV3 · Propuestas de hero: selector de versión, ventana "Te llamamos" y formularios de prueba (solo prototipo). */
(function () {
  "use strict";
  var heroes = document.querySelectorAll("[data-iv3-hero]");
  if (!heroes.length) return;

  /* Versiones propuestas (la actual sigue disponible con ?hero=actual) */
  var VERS = ["1", "2", "3"];
  var KEY = "iv3-hero";
  var actual = "1";

  function leer() {
    var m = location.search.match(/[?&]hero=(\w+)/);
    if (m) return m[1];
    try { return localStorage.getItem(KEY) || "1"; } catch (e) { return "1"; }
  }
  function mostrar(v) {
    if (!document.querySelector('[data-iv3-hero="' + v + '"]')) v = "1";
    actual = v;
    heroes.forEach(function (h) { h.hidden = h.getAttribute("data-iv3-hero") !== v; });
    var h = document.querySelector('[data-iv3-hero="' + v + '"]');
    var i = VERS.indexOf(v);
    txt.innerHTML = "<small>Propuesta de hero</small>" + (i < 0 ? "Versión actual" :
      "<b>" + (i + 1) + "</b> / " + VERS.length + '<span class="iv3-switch-name"> · ' + (h.getAttribute("data-iv3-hero-name") || "") + "</span>");
    try { localStorage.setItem(KEY, v); } catch (e) {}
    try { history.replaceState(null, "", location.pathname + "?hero=" + v + location.hash); } catch (e) {}
  }
  function mover(paso) {
    var i = VERS.indexOf(actual);
    i = i < 0 ? 0 : (i + paso + VERS.length) % VERS.length;
    mostrar(VERS[i]);
    if (window.scrollY > 200) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  var FLECHA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var bar = document.createElement("div");
  bar.className = "iv3-switch";
  bar.setAttribute("role", "group");
  bar.setAttribute("aria-label", "Cambiar versión del hero");
  bar.innerHTML = '<button type="button" data-paso="-1" aria-label="Versión anterior">' + FLECHA + "</button>" +
    '<span class="iv3-switch-txt" aria-live="polite"></span>' +
    '<button type="button" data-paso="1" aria-label="Versión siguiente" style="transform:scaleX(-1)">' + FLECHA + "</button>";
  var txt = bar.querySelector(".iv3-switch-txt");
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) mover(+b.getAttribute("data-paso"));
  });
  document.body.appendChild(bar);

  /* Ubicar el selector justo debajo del header */
  function alto() {
    var hd = document.querySelector(".elementor-location-header");
    if (hd) document.documentElement.style.setProperty("--iv3-hdr-h", Math.round(hd.getBoundingClientRect().height) + "px");
  }
  alto();
  window.addEventListener("resize", alto);
  mostrar(leer());

  /* Ventana emergente */
  var ultimo = null;
  function abrir(id) {
    var m = document.getElementById(id);
    if (!m) return;
    ultimo = document.activeElement;
    m.hidden = false;
    document.documentElement.classList.add("iv3-modal-open");
    var f = m.querySelector("select, input");
    if (f) f.focus();
  }
  function cerrar(m) {
    m.hidden = true;
    document.documentElement.classList.remove("iv3-modal-open");
    if (ultimo) ultimo.focus();
  }
  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-iv3-open]");
    if (o) { e.preventDefault(); abrir(o.getAttribute("data-iv3-open")); return; }
    var c = e.target.closest("[data-iv3-close]");
    if (c) cerrar(c.closest(".iv3-modal"));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var m = document.querySelector(".iv3-modal:not([hidden])");
    if (m) cerrar(m);
  });

  /* Formularios de prueba: validan, pero no envían nada */
  document.querySelectorAll("[data-iv3-proto-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (el) {
        var valido = el.type === "checkbox" ? el.checked : el.value.trim() !== "" && (el.type !== "email" || /\S+@\S+\.\S+/.test(el.value));
        var campo = el.closest(".iv3-hfield");
        if (campo) campo.classList.toggle("is-error", !valido);
        if (!valido) ok = false;
      });
      var msg = form.querySelector(".iv3-hform-msg");
      msg.hidden = false;
      msg.textContent = ok ? "Prototipo: el formulario funciona, pero aquí no se envía. En el sitio real llega al CRM como hoy."
                           : "Revisa los campos marcados.";
    });
  });
})();
