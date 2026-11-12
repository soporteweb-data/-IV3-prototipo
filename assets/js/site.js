/* IV3 Arquitectura — prototipo
   Reemplaza el JS de Elementor que se retiró del clon: contadores, menú,
   pestañas, paginación del portafolio, formularios de prueba y el carrusel
   de testimonios. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Header: sombra al hacer scroll ---------------------------------- */
  var header = document.querySelector(".elementor-location-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 10); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Menú (tablet: modo desplegable) ---------------------------------- */
  document.querySelectorAll(".e-n-menu").forEach(function (nav) {
    var btn = nav.querySelector(".e-n-menu-toggle");
    var setLayout = function () {
      nav.setAttribute("data-layout", window.innerWidth <= 1024 ? "dropdown" : "horizontal");
      if (window.innerWidth > 1024 && btn) btn.setAttribute("aria-expanded", "false");
    };
    setLayout();
    window.addEventListener("resize", setLayout);
    if (btn) btn.addEventListener("click", function () {
      if (header) nav.style.setProperty("--iv3-menu-top", Math.round(header.getBoundingClientRect().bottom) + "px");
      btn.setAttribute("aria-expanded", btn.getAttribute("aria-expanded") === "true" ? "false" : "true");
    });
  });

  /* ---- Contadores -------------------------------------------------------- */
  function fmt(n, delim) {
    var s = String(Math.round(n));
    return delim ? s.replace(/\B(?=(\d{3})+(?!\d))/g, delim) : s;
  }
  function runCounter(el) {
    var from = parseFloat(el.dataset.fromValue || 0), to = parseFloat(el.dataset.toValue || 0);
    var dur = parseInt(el.dataset.duration || 2000, 10), delim = el.dataset.delimiter || "";
    if (reduce) { el.textContent = fmt(to, delim); return; }
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e, delim);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll(".elementor-counter-number[data-to-value]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  } else counters.forEach(runCounter);

  /* ---- Revelado de secciones nuevas ------------------------------------- */
  var reveals = document.querySelectorAll(".iv3-reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); rio.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (r) { rio.observe(r); });
  } else reveals.forEach(function (r) { r.classList.add("is-in"); });

  /* ---- Pestañas (Portafolio) -------------------------------------------- */
  document.querySelectorAll(".e-n-tabs").forEach(function (tabs) {
    var titles = tabs.querySelectorAll(".e-n-tab-title");
    var panels = tabs.querySelectorAll(".e-n-tabs-content > .e-con");
    titles.forEach(function (t) {
      t.addEventListener("click", function () {
        var idx = t.getAttribute("data-tab-index");
        titles.forEach(function (x) {
          var on = x === t;
          x.setAttribute("aria-selected", on ? "true" : "false");
          x.setAttribute("tabindex", on ? "0" : "-1");
        });
        panels.forEach(function (p) { p.classList.toggle("e-active", p.getAttribute("data-tab-index") === idx); });
      });
    });
  });

  /* ---- Paginación del portafolio (sin AJAX) ------------------------------ */
  document.querySelectorAll("[data-iv3-paginate]").forEach(function (grid) {
    var per = parseInt(grid.getAttribute("data-iv3-paginate"), 10) || 6;
    var items = Array.prototype.slice.call(grid.querySelectorAll(".elementor-loop-container > .e-loop-item"));
    var nav = grid.querySelector(".elementor-pagination");
    var pages = Math.ceil(items.length / per);
    var current = 1;
    function render() {
      items.forEach(function (it, i) { it.classList.toggle("iv3-hidden", Math.floor(i / per) + 1 !== current); });
      if (!nav) return;
      var html = "";
      html += current > 1 ? '<a class="page-numbers prev" data-page="' + (current - 1) + '" href="#">Anterior</a>'
                          : '<span class="page-numbers prev">Anterior</span>';
      for (var p = 1; p <= pages; p++) {
        html += p === current ? '<span aria-current="page" class="page-numbers current"><span class="elementor-screen-only">Página</span>' + p + "</span>"
                              : '<a class="page-numbers" data-page="' + p + '" href="#"><span class="elementor-screen-only">Página</span>' + p + "</a>";
      }
      html += current < pages ? '<a class="page-numbers next" data-page="' + (current + 1) + '" href="#">Siguiente</a>'
                              : '<span class="page-numbers next">Siguiente</span>';
      nav.innerHTML = html;
    }
    if (nav) nav.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-page]");
      if (!a) return;
      e.preventDefault();
      current = parseInt(a.getAttribute("data-page"), 10);
      render();
      var top = grid.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
    });
    render();
  });

  /* ---- Formularios: prototipo, no envían datos --------------------------- */
  document.querySelectorAll("form[data-prototype-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var msg = f.querySelector(".iv3-form-ok");
      if (!msg) {
        msg = document.createElement("div");
        msg.className = "iv3-form-ok";
        msg.setAttribute("role", "status");
        f.appendChild(msg);
      }
      msg.textContent = "¡Gracias! Recibimos tu solicitud. Un asesor te contactará en menos de 24 horas. (Prototipo: el formulario no envía datos).";
      f.reset();
      if (window.jQuery && jQuery.fn.select2) jQuery(f).find("select").trigger("change");
    });
  });

  /* ---- Select2 como en el sitio original -------------------------------- */
  if (window.jQuery && jQuery.fn.select2) {
    jQuery("#form-field-ubicacion, #form-field-ubicacion_2, #form-field-ubicacion_3").select2({
      minimumResultsForSearch: Infinity, width: "100%"
    });
  }

  /* ---- Carrusel de testimonios ------------------------------------------ */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
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
        b.dataset.i = i;
        dotsWrap.appendChild(b);
      }
    }
    function go(i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      var w = cards[0].getBoundingClientRect().width + gap;
      track.style.transform = "translateX(" + (-index * w) + "px)";
      prev.disabled = index === 0;
      next.disabled = index === maxIndex();
      Array.prototype.forEach.call(dotsWrap.children, function (d, k) { d.setAttribute("aria-current", k === index ? "true" : "false"); });
      cards.forEach(function (c, k) {
        var visible = k >= index && k < index + perView();
        c.setAttribute("aria-hidden", visible ? "false" : "true");
      });
    }
    function play() {
      if (reduce) return;
      stop();
      timer = setInterval(function () { go(index >= maxIndex() ? 0 : index + 1); }, 6000);
    }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    prev.addEventListener("click", function () { go(index - 1); play(); });
    next.addEventListener("click", function () { go(index + 1); play(); });
    dotsWrap.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (b) { go(parseInt(b.dataset.i, 10)); play(); }
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", stop);
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { go(index - 1); }
      if (e.key === "ArrowRight") { go(index + 1); }
    });
    // swipe
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
})();
