/* IV3 Arquitectura — Secciones nuevas (listo para WordPress / Elementor)
   JavaScript sin dependencias (no requiere jQuery).
   - Animación de entrada (.iv3-reveal)
   - Cifras animadas ([data-iv3-count])
   - Testimonios ([data-iv3-testimonios]): foto grande + lista de 2 opiniones
   Se puede cargar en el footer del sitio (p. ej. con WPCode) o en un widget HTML. */
(function () {
  "use strict";
  if (window.__iv3Secciones) return;
  window.__iv3Secciones = true;
  document.documentElement.classList.add("iv3-js");

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hasIO = "IntersectionObserver" in window;

    /* ---- Animación de entrada ------------------------------------------- */
    var reveals = document.querySelectorAll(".iv3-reveal");
    if (hasIO && !reduce) {
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); rio.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      reveals.forEach(function (r) { rio.observe(r); });
    } else {
      reveals.forEach(function (r) { r.classList.add("is-in"); });
    }

    /* ---- Cifras animadas -------------------------------------------------- */
    function fmt(n, sep) {
      var s = String(Math.round(n));
      return sep ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s;
    }
    function count(el) {
      var to = parseFloat(el.getAttribute("data-iv3-count")) || 0;
      var sep = el.getAttribute("data-iv3-sep") || "";
      if (reduce) { el.textContent = fmt(to, sep); return; }
      var t0 = null, dur = 1800;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)), sep);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var nums = document.querySelectorAll("[data-iv3-count]");
    if (hasIO) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { count(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      nums.forEach(function (n) { cio.observe(n); });
    }

    /* ---- Testimonios ------------------------------------------------------ */
    document.querySelectorAll("[data-iv3-testimonios]").forEach(function (root) {
      var items = Array.prototype.slice.call(root.querySelectorAll(".iv3-titem"));
      var photos = root.querySelectorAll(".iv3-tphotos img");
      var dots = root.querySelectorAll(".iv3-dots button");
      var countEl = root.querySelector(".iv3-tcount");
      var prev = root.querySelector(".iv3-arrow.prev"), next = root.querySelector(".iv3-arrow.next");
      var n = items.length, active = 0, page = -1, timer = null;
      var pad = function (x) { return (x < 10 ? "0" : "") + x; };

      function perPage() { return window.innerWidth <= 767 ? 1 : 2; }
      function set(i, user) {
        active = (i + n) % n;
        var per = perPage(), p = Math.floor(active / per);
        items.forEach(function (it, k) {
          var visible = Math.floor(k / per) === p;
          if (visible && (p !== page || !it.classList.contains("is-visible"))) {
            it.classList.remove("is-visible"); void it.offsetWidth; // reinicia la animación
          }
          it.classList.toggle("is-visible", visible);
          it.classList.toggle("is-active", k === active);
          it.setAttribute("aria-hidden", visible ? "false" : "true");
        });
        page = p;
        Array.prototype.forEach.call(photos, function (ph, k) { ph.classList.toggle("is-active", k === active); });
        Array.prototype.forEach.call(dots, function (d, k) { d.setAttribute("aria-current", k === active ? "true" : "false"); });
        if (countEl) countEl.innerHTML = "<b>" + pad(active + 1) + "</b> / " + pad(n);
        if (user) play();
      }
      function stop() { if (timer) clearInterval(timer); timer = null; }
      function play() {
        if (reduce) return;
        stop();
        timer = setInterval(function () { set(active + 1); }, 6500);
      }

      if (prev) prev.addEventListener("click", function () { set(active - 1, true); });
      if (next) next.addEventListener("click", function () { set(active + 1, true); });
      Array.prototype.forEach.call(dots, function (d, k) { d.addEventListener("click", function () { set(k, true); }); });
      items.forEach(function (it, k) {
        it.addEventListener("click", function () { set(k, true); });
        it.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(k, true); } });
      });
      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", play);
      root.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") set(active - 1, true);
        if (e.key === "ArrowRight") set(active + 1, true);
      });
      var x0 = null;
      root.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
      root.addEventListener("touchend", function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) set(active + (dx < 0 ? 1 : -1));
        x0 = null; play();
      });
      // Alto fijo = página más alta, para que la sección no "salte" al cambiar
      var list = root.querySelector(".iv3-titems");
      function measure() {
        var per = perPage(), max = 0;
        list.style.minHeight = "";
        for (var p = 0; p * per < n; p++) {
          var h = 0;
          items.forEach(function (it, k) {
            if (Math.floor(k / per) !== p) return;
            var was = it.style.display;
            it.style.display = "grid";
            h += it.getBoundingClientRect().height;
            it.style.display = was;
          });
          max = Math.max(max, h);
        }
        list.style.minHeight = Math.ceil(max) + "px";
      }
      var lastPer = perPage(), rz = null;
      window.addEventListener("resize", function () {
        clearTimeout(rz);
        rz = setTimeout(function () {
          if (perPage() !== lastPer) { lastPer = perPage(); page = -1; set(active); }
          measure();
        }, 150);
      });
      measure();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
      set(0);
      play();
    });
  });
})();
