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

    /* ---- Testimonios: tarjeta destacada + miniaturas ---------------------- */
    document.querySelectorAll("[data-iv3-testimonios]").forEach(function (root) {
      var stage = root.querySelector(".iv3-tstage");
      var slides = Array.prototype.slice.call(root.querySelectorAll(".iv3-tslide"));
      var thumbs = Array.prototype.slice.call(root.querySelectorAll(".iv3-tthumb"));
      var countEl = root.querySelector(".iv3-tcount");
      var prev = root.querySelector(".iv3-arrow.prev"), next = root.querySelector(".iv3-arrow.next");
      var n = slides.length, active = 0, timer = null, DUR = 7000;
      var pad = function (x) { return (x < 10 ? "0" : "") + x; };
      stage.style.setProperty("--iv3-dur", DUR / 1000 + "s");

      function restartProgress() {
        stage.classList.remove("is-playing");
        void stage.offsetWidth;
        if (!reduce) stage.classList.add("is-playing");
      }
      function set(i) {
        active = (i + n) % n;
        slides.forEach(function (s, k) {
          s.classList.toggle("is-active", k === active);
          s.setAttribute("aria-hidden", k === active ? "false" : "true");
        });
        thumbs.forEach(function (t, k) {
          t.classList.toggle("is-active", k === active);
          if (k === active) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current");
        });
        if (countEl) countEl.innerHTML = "<b>" + pad(active + 1) + "</b> / " + pad(n);
        play();
      }
      function stop() { if (timer) clearTimeout(timer); timer = null; }
      function play() {
        stop();
        restartProgress();
        if (reduce || paused) return;
        timer = setTimeout(function () { set(active + 1); }, DUR);
      }
      var paused = false;
      function pause() { paused = true; stop(); stage.classList.add("is-paused"); }
      function resume() { paused = false; stage.classList.remove("is-paused"); play(); }

      if (prev) prev.addEventListener("click", function () { set(active - 1); });
      if (next) next.addEventListener("click", function () { set(active + 1); });
      thumbs.forEach(function (t, k) { t.addEventListener("click", function () { set(k); }); });
      stage.addEventListener("mouseenter", pause);
      stage.addEventListener("mouseleave", resume);
      root.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") set(active - 1);
        if (e.key === "ArrowRight") set(active + 1);
      });
      var x0 = null;
      stage.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      stage.addEventListener("touchend", function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) set(active + (dx < 0 ? 1 : -1));
        x0 = null;
      });
      // Solo corre el autoplay cuando la sección está en pantalla
      if (hasIO) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) { if (!timer && !paused) play(); } else { stop(); stage.classList.remove("is-playing"); } });
        }, { threshold: 0.3 }).observe(stage);
      }
      set(0);
    });
  });
})();
