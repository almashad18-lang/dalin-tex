(function () {
  "use strict";
  var S = window.SITE, P = window.PRODUCTS;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function waUrl(text) {
    return "https://wa.me/" + S.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  /* ---------- روابط التواصل ---------- */
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = waUrl("مرحبًا دالين تكس، أريد الاستفسار عن منتجاتكم");
    a.target = "_blank"; a.rel = "noopener";
  });
  var phoneLink = document.getElementById("phone-link");
  phoneLink.textContent = S.phone;
  phoneLink.href = "tel:" + S.phone;
  document.getElementById("call-link").href = "tel:" + S.phone;
  if (S.facebook) {
    var fb = document.getElementById("fb-link");
    fb.href = S.facebook; fb.hidden = false;
  }
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- بطاقات المنتجات ---------- */
  var cards = document.getElementById("product-cards");
  P.forEach(function (p) {
    var a = el("a", "p-card");
    a.href = "#" + p.id;
    a.innerHTML =
      '<div class="p-card-img"><img src="' + p.cover + '" alt="' + esc(p.title) + '" loading="lazy"></div>' +
      '<div class="p-card-body"><span class="p-no">' + p.no + "</span>" +
      '<small>' + esc(p.group) + "</small><h3>" + esc(p.title) + "</h3><p>" + esc(p.summary) + "</p>" +
      '<span class="p-more">التفاصيل والمقاسات ←</span></div>';
    cards.appendChild(a);
  });

  /* ---------- تفاصيل كل منتج ---------- */
  var wrap = document.getElementById("product-details");
  P.forEach(function (p, i) {
    var sec = el("section", "section product" + (i % 2 ? " section-alt" : ""));
    sec.id = p.id;
    var h = '<div class="container">';
    h += '<p class="eyebrow">' + p.no + " · " + esc(p.group) + "</p>";
    h += "<h2>" + esc(p.title) + "</h2>";
    if (p.badge) h += '<span class="badge">' + esc(p.badge) + "</span>";
    h += '<p class="lead-sm">' + esc(p.summary) + "</p>";

    h += '<div class="p-images n' + p.images.length + '">';
    p.images.forEach(function (src, k) {
      h += '<button class="zoom" data-group="' + p.id + '-main" data-index="' + k + '"><img src="' + src + '" alt="' + esc(p.title) + '" loading="lazy"></button>';
    });
    h += "</div>";

    h += '<div class="p-info">';
    // المواصفات
    h += '<div class="p-col"><h3>الخامة والمواصفات</h3>';
    if (p.specs && p.specs.length) {
      h += '<dl class="specs">';
      p.specs.forEach(function (s) { h += "<div><dt>" + esc(s[0]) + ":</dt><dd>" + esc(s[1]) + "</dd></div>"; });
      h += "</dl>";
    }
    if (p.colors) {
      h += '<ul class="swatches">';
      p.colors.forEach(function (c) { h += '<li><span style="background:' + c[1] + '"></span>' + esc(c[0]) + "</li>"; });
      h += "</ul>";
    }
    if (p.features) {
      h += '<ul class="ticks">';
      p.features.forEach(function (f) { h += "<li>" + esc(f) + "</li>"; });
      h += "</ul>";
    }
    h += "</div>";

    // المقاسات أو الأطقم
    h += '<div class="p-col">';
    if (p.sizes) {
      h += '<h3>المقاسات المتاحة <small>' + esc(p.sizesNote || "") + "</small></h3><table class='sizes'><tbody>";
      p.sizes.forEach(function (s) { h += "<tr><td>" + esc(s[0]) + '</td><td class="num" dir="ltr">' + esc(s[1]) + "</td></tr>"; });
      h += "</tbody></table>";
    }
    if (p.sets) {
      h += "<h3>" + esc(p.setsTitle || "الأطقم المتاحة") + "</h3><table class='sizes sets'><tbody>";
      p.sets.forEach(function (s) { h += "<tr><td><b>" + esc(s[0]) + "</b><small>" + esc(s[1]) + '</small></td><td class="num">' + esc(s[2]) + "</td></tr>"; });
      h += "</tbody></table>";
    }
    h += "</div></div>";

    if (p.care) {
      h += '<div class="care">';
      p.care.forEach(function (c) { h += "<div><h4>" + esc(c[0]) + "</h4><p>" + esc(c[1]) + "</p></div>"; });
      h += "</div>";
    }

    if (p.gallery && p.gallery.length) {
      h += '<h3 class="sub-title">تصميمات مختارة</h3><p class="muted">اضغط على التصميم للتكبير، واذكر رقمه عند الطلب. التشكيلة الكاملة متاحة عند التواصل معنا.</p>';
      h += '<div class="gallery">';
      p.gallery.forEach(function (src, k) {
        var code = p.no + "-" + String(k + 1).padStart(2, "0");
        h += '<button class="zoom g-item" data-group="' + p.id + '-g" data-index="' + k + '" data-code="' + code + '"><img src="' + src + '" alt="تصميم رقم ' + code + '" loading="lazy"><span>تصميم ' + code + "</span></button>";
      });
      h += "</div>";
    }

    h += '<div class="p-cta"><p><b>للطلب:</b> أرسل المقاس المطلوب أو صورة للمكان، أو الكميات المطلوبة مع رقم التصميم.</p>';
    h += '<a class="btn btn-gold" target="_blank" rel="noopener" href="' + waUrl("مرحبًا دالين تكس، أريد الاستفسار عن: " + p.title) + '">اطلب ' + esc(p.title) + "</a></div>";
    h += "</div>";
    sec.innerHTML = h;
    wrap.appendChild(sec);
  });

  /* ---------- نموذج الطلب ---------- */
  var fp = document.getElementById("f-product"), fs = document.getElementById("f-size");
  P.forEach(function (p) { fp.appendChild(new Option(p.title, p.id)); });
  function fillSizes() {
    var p = P.filter(function (x) { return x.id === fp.value; })[0];
    fs.innerHTML = "";
    var list = (p.sizes || []).map(function (s) { return s[0] + " — " + s[1] + " سم"; })
      .concat((p.sets || []).map(function (s) { return s[0]; }));
    list.forEach(function (t) { fs.appendChild(new Option(t, t)); });
    fs.appendChild(new Option("مقاس خاص (اكتبه في التفاصيل)", "مقاس خاص"));
  }
  fp.addEventListener("change", fillSizes);
  fillSizes();

  document.getElementById("order-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var lines = [
      "طلب جديد من موقع دالين تكس",
      "المنتج: " + fp.options[fp.selectedIndex].text,
      "المقاس / الطقم: " + fs.value,
      "الكمية: " + (f.qty.value || 1)
    ];
    if (f.city.value.trim()) lines.push("المحافظة: " + f.city.value.trim());
    if (f.notes.value.trim()) lines.push("تفاصيل: " + f.notes.value.trim());
    window.open(waUrl(lines.join("\n")), "_blank", "noopener");
  });

  /* ---------- القائمة على الموبايل ---------- */
  var toggle = document.querySelector(".nav-toggle"), nav = document.getElementById("nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }
  });

  /* ---------- عارض الصور ---------- */
  var lb = document.getElementById("lightbox"), lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".lb-cap");
  var items = [], idx = 0;
  function show(i) {
    idx = (i + items.length) % items.length;
    var b = items[idx];
    lbImg.src = b.querySelector("img").src;
    lbImg.alt = b.querySelector("img").alt;
    lbCap.textContent = b.dataset.code ? "تصميم رقم " + b.dataset.code : "";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".zoom");
    if (!b) return;
    items = Array.prototype.slice.call(document.querySelectorAll('.zoom[data-group="' + b.dataset.group + '"]'));
    show(items.indexOf(b));
    lb.hidden = false; document.body.style.overflow = "hidden";
  });
  function close() { lb.hidden = true; document.body.style.overflow = ""; }
  lb.querySelector(".lb-close").onclick = close;
  lb.querySelector(".lb-next").onclick = function () { show(idx + 1); };
  lb.querySelector(".lb-prev").onclick = function () { show(idx - 1); };
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx + 1);
    if (e.key === "ArrowRight") show(idx - 1);
  });
})();
