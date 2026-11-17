/* IV3 · Propuestas de hero: selector de versión, ventana "Te llamamos" y formularios de prueba (solo prototipo). */
(function () {
  "use strict";
  var heroes = document.querySelectorAll("[data-iv3-hero]");
  if (!heroes.length) return;

  var OPCIONES = [["actual", "Actual"], ["1", '1<span class="iv3-sw-name"> · Dividido</span>'],
    ["2", '2<span class="iv3-sw-name"> · Inmersivo</span>'], ["3", '3<span class="iv3-sw-name"> · Con formulario</span>']];
  var KEY = "iv3-hero";

  function leer() {
    var m = location.search.match(/[?&]hero=(\w+)/);
    if (m) return m[1];
    try { return localStorage.getItem(KEY) || "1"; } catch (e) { return "1"; }
  }
  function mostrar(v) {
    if (!document.querySelector('[data-iv3-hero="' + v + '"]')) v = "1";
    heroes.forEach(function (h) { h.hidden = h.getAttribute("data-iv3-hero") !== v; });
    bar.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", b.value === v ? "true" : "false"); });
    try { localStorage.setItem(KEY, v); } catch (e) {}
    try { history.replaceState(null, "", location.pathname + "?hero=" + v + location.hash); } catch (e) {}
  }

  var bar = document.createElement("div");
  bar.className = "iv3-switch";
  bar.setAttribute("role", "group");
  bar.setAttribute("aria-label", "Versión del hero");
  bar.innerHTML = '<span class="iv3-switch-label">Versión del hero</span>' +
    OPCIONES.map(function (o) { return '<button type="button" value="' + o[0] + '">' + o[1] + "</button>"; }).join("");
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    mostrar(b.value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.body.appendChild(bar);
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
