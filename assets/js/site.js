/* IV3 Arquitectura — SOLO PROTOTIPO
   Reemplaza el JS de Elementor que se retiró del clon estático: header,
   menú en tablet, contadores de Elementor, pestañas, paginación del
   portafolio y formularios de prueba. En WordPress no se usa.
   Las secciones nuevas usan iv3-secciones.js. */
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

  /* ---- Contadores de Elementor ------------------------------------------ */
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
      var html = current > 1 ? '<a class="page-numbers prev" data-page="' + (current - 1) + '" href="#">Anterior</a>'
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
      window.scrollTo({ top: grid.getBoundingClientRect().top + window.scrollY - 140, behavior: reduce ? "auto" : "smooth" });
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
})();
