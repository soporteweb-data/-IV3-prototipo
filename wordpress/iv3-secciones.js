/* IV3 Arquitectura — Secciones nuevas (listo para WordPress / Elementor)
   JavaScript sin dependencias (no requiere jQuery).
   - Animación de entrada (.iv3-reveal)
   - Cifras animadas ([data-iv3-count])
   - Carrusel de testimonios ([data-iv3-carousel])
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

    /* ---- Carrusel de testimonios ----------------------------------------- */
    document.querySelectorAll("[data-iv3-carousel]").forEach(function (root) {
      var track = root.querySelector(".iv3-track");
      var cards = Array.prototype.slice.call(track.children);
      var prev = root.querySelector(".iv3-arrow.prev"), next = root.querySelector(".iv3-arrow.next");
      var dotsWrap = root.querySelector(".iv3-dots");
      var index = 0, timer = null;

      function perView() { return window.innerWidth <= 767 ? 1 : window.innerWidth <= 1024 ? 2 : 3; }
      function maxIndex() { return Math.max(0, cards.length - perView()); }
      function buildDots() {
        dotsWrap.innerHTML = "";
        for (var i = 0; i <= maxIndex(); i++) {
          var b = document.createElement("button");
          b.type = "button";
          b.setAttribute("aria-label", "Ir al testimonio " + (i + 1));
          b.setAttribute("data-i", i);
          dotsWrap.appendChild(b);
        }
      }
      function go(i) {
        index = Math.max(0, Math.min(i, maxIndex()));
        var cs = getComputedStyle(track);
        var gap = parseFloat(cs.columnGap || cs.gap) || 0;
        var w = cards[0].getBoundingClientRect().width + gap;
        track.style.transform = "translateX(" + (-index * w) + "px)";
        prev.disabled = index === 0;
        next.disabled = index === maxIndex();
        Array.prototype.forEach.call(dotsWrap.children, function (d, k) {
          d.setAttribute("aria-current", k === index ? "true" : "false");
        });
        cards.forEach(function (c, k) {
          c.setAttribute("aria-hidden", k >= index && k < index + perView() ? "false" : "true");
        });
      }
      function stop() { if (timer) clearInterval(timer); timer = null; }
      function play() {
        if (reduce) return;
        stop();
        timer = setInterval(function () { go(index >= maxIndex() ? 0 : index + 1); }, 6000);
      }

      prev.addEventListener("click", function () { go(index - 1); play(); });
      next.addEventListener("click", function () { go(index + 1); play(); });
      dotsWrap.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (b) { go(parseInt(b.getAttribute("data-i"), 10)); play(); }
      });
      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", play);
      root.addEventListener("focusin", stop);
      root.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      });
      var x0 = null;
      track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
      track.addEventListener("touchend", function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        x0 = null; play();
      });
      var lastPer = perView();
      window.addEventListener("resize", function () {
        if (perView() !== lastPer) { lastPer = perView(); buildDots(); }
        go(index);
      });
      buildDots();
      go(0);
      play();
    });
  });
})();
