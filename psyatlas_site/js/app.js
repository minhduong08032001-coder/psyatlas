/* PsyAtlas — ứng dụng một trang, không cần build. Mở index.html là chạy. */
(function () {
  "use strict";
  var P = window.PSY;
  var view = document.getElementById("view");

  /* ---------- Tiện ích ---------- */
  var U = window.PsyUtil, esc = U.esc, norm = U.norm, store = U.store;

  /* ---------- Chỉ mục toàn bộ mục ---------- */
  var ALL = [], BY = {};
  function add(e, kind, kindLabel, group) {
    e._kind = kind; e._kindLabel = kindLabel; e._group = group || "";
    e._alias = norm(e.alias || "");
    e._search = norm([e.vi, e.en, e.alias, e.def, e.summary, e.role, (e.features || []).join(" "), (e.functions || []).join(" ")].join(" "));
    ALL.push(e); BY[e.id] = e;
  }
  P.terms.forEach(function (t) { add(t, "term", "Thuật ngữ", t.area); });
  P.disorders.forEach(function (d) { add(d, "disorder", "Rối loạn", d.group); });
  P.neuro.regions.forEach(function (n) { add(n, "neuro", "Thần kinh", n.kind); });
  P.neuro.systems.forEach(function (n) { add(n, "neuro", "Thần kinh", n.kind); });

  /* Liên kết hai chiều */
  var REFS = {};
  function link2(a, b) {
    if (!BY[a] || !BY[b] || a === b) return;
    (REFS[a] = REFS[a] || {})[b] = 1;
    (REFS[b] = REFS[b] || {})[a] = 1;
  }
  ALL.forEach(function (e) {
    (e.related || []).concat(e.links || [], e.neuro || []).forEach(function (t) { link2(e.id, t); });
  });
  /* Chỉ mục nguồn: "psy:15.4" → các mục trích từ phần đó */
  var SECIDX = {};
  ALL.forEach(function (e) {
    (e.src || []).forEach(function (s) { (SECIDX[s.b + ":" + s.sec] = SECIDX[s.b + ":" + s.sec] || []).push(e.id); });
  });
  function srcHtml(e) {
    if (!e.src || !e.src.length) return "";
    var info = P.srcInfo;
    return '<div class="panel"><h2>Đọc thêm trong giáo trình</h2><ul class="srclist">' + e.src.map(function (s) {
      var b = info[s.b];
      return "<li><a href=\"#/read/" + esc(s.b) + "/" + esc(s.sec) + "\">" + esc(b.short) + "</a> · mục " + esc(s.sec) + " · " + (b.pgLabel || "tr.") + " " + esc(s.pg) + ' <span class="muted">(' + esc(b.license) + ")</span></li>";
    }).join("") + '</ul><p class="muted" style="font-size:.85rem;margin:8px 0 0">Số trang là số in trong sách. Nội dung ở đây là bản tóm lược diễn giải lại bằng tiếng Việt.</p></div>';
  }
  function refsOf(id) { return Object.keys(REFS[id] || {}).map(function (k) { return BY[k]; }); }

  /* ---------- Đã lưu ---------- */
  function favs() { return store("psy.fav") || []; }
  function toggleFav(id) {
    var f = favs(), i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.push(id);
    store("psy.fav", f);
    return i < 0;
  }

  /* ---------- Thành phần HTML ---------- */
  function pill(id) {
    var e = BY[id]; if (!e) return "";
    return '<a class="pill" href="#/e/' + esc(id) + '">' + esc(e.vi) + "</a>";
  }
  function pills(ids) { return '<div class="pillrow">' + ids.map(pill).join("") + "</div>"; }
  function list(items) {
    if (!items || !items.length) return '<p class="muted">Chưa có dữ liệu.</p>';
    return "<ul>" + items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
  }
  function card(e) {
    var sub = e._kind === "disorder" ? e.icd : e.en;
    var txt = e.def || e.summary || (e.functions ? e.functions[0] : e.role) || "";
    return '<a class="card" href="#/e/' + esc(e.id) + '"><h3>' + esc(e.vi) + '</h3><div class="meta">' + esc(sub) + "</div><p>" + esc(txt) + "</p></a>";
  }
  var VERIFY = {
    term: "Tóm lược để học bằng lời riêng. Hãy kiểm chứng định nghĩa với giáo trình (OpenStax, Myers, Corey) trước khi dùng trong bài hay thực hành.",
    disorder: "Đây là tóm lược, KHÔNG phải tiêu chuẩn chẩn đoán. Hãy đối chiếu tiêu chí đầy đủ, ngưỡng thời gian và mã trong DSM-5-TR, ICD-11 hoặc Comer. Chẩn đoán cần đánh giá lâm sàng bởi người có chuyên môn.",
    neuro: "Mô tả giáo khoa đơn giản hóa. Chức năng não vận hành theo mạng lưới; hãy kiểm chứng với giáo trình thần kinh học trước khi suy luận lâm sàng."
  };
  function verify(kind) { return '<div class="verify" role="note"><strong>Cần kiểm chứng.</strong> ' + esc(VERIFY[kind]) + "</div>"; }

  /* ---------- Điều hướng ---------- */
  function route() {
    var h = (location.hash || "#/").replace(/^#\/?/, "");
    var parts = h.split("/");
    return { name: parts[0] || "", arg: decodeURIComponent(parts.slice(1).join("/")) };
  }
  function setNav(name) {
    var links = document.querySelectorAll("#nav a");
    for (var i = 0; i < links.length; i++) {
      var on = links[i].getAttribute("data-r") === name;
      if (on) links[i].setAttribute("aria-current", "page"); else links[i].removeAttribute("aria-current");
    }
  }
  function render() {
    var r = route();
    if (r.name !== "e" && r.name !== "learn" && r.name !== "books" && r.name !== "read") lessonCtx = null;
    var nav = r.name === "e" ? (BY[r.arg] ? ({ term: "terms", disorder: "disorders", neuro: "neuro" })[BY[r.arg]._kind] : "") : (r.name === "read" ? "books" : r.name);
    setNav(nav);
    document.getElementById("side").classList.remove("open");
    document.getElementById("menu").setAttribute("aria-expanded", "false");
    ({ "": pageHome, learn: pageLearn, terms: pageTerms, disorders: pageDisorders, neuro: pageNeuro, books: pageBooks, read: pageRead, library: pageLibrary, e: pageEntry }[r.name] || pageHome)(r.arg);
    window.scrollTo(0, 0);
  }

  /* ---------- Trang chủ ---------- */
  function pageHome() {
    document.title = "PsyAtlas";
    var saved = favs().filter(function (id) { return BY[id]; });
    view.innerHTML =
      '<section class="hero"><h1>Tra cứu nhanh, học chủ động.</h1>' +
      '<p class="lead">Sổ tay cho sinh viên tâm lý và người làm lâm sàng: thuật ngữ, rối loạn, mối liên hệ giữa não bộ và biểu hiện, cùng thư viện sách cá nhân.</p></section>' +
      '<div class="tiles">' +
      '<a class="tile" href="#/learn"><h3>Chương trình học</h3><p>Lộ trình theo giai đoạn: đọc gì, học mục nào, và bài tự kiểm tra cuối mỗi bài.</p></a>' +
      '<a class="tile" href="#/terms"><h3>Thuật ngữ</h3><p>' + P.terms.length + " mục song ngữ Việt–Anh, có ví dụ và liên kết chéo.</p></a>" +
      '<a class="tile" href="#/disorders"><h3>Rối loạn &amp; hội chứng</h3><p>' + P.disorders.length + " rối loạn: biểu hiện, chẩn đoán phân biệt, cơ sở thần kinh.</p></a>" +
      '<a class="tile" href="#/neuro"><h3>Sinh lý thần kinh</h3><p>Bản đồ não tương tác, chất dẫn truyền và tra từ biểu hiện sang vùng não.</p></a>' +
      '<a class="tile" href="#/books"><h3>Giáo trình</h3><p>Mục lục Psychology 2e và Behavioral Neuroscience, đánh dấu tiến độ đọc theo lộ trình 8 tháng.</p></a>' +
      '<a class="tile" href="#/library"><h3>Thư viện</h3><p>Tải sách lên, ghi chú, theo dõi tiến độ đọc. Lưu cục bộ trên máy bạn.</p></a>' +
      "</div>" +
      '<div class="panel" id="flash"></div>' +
      '<div class="panel"><h2>Đã lưu</h2>' +
      (saved.length ? pills(saved) : '<p class="muted">Bấm \"Lưu\" ở trang chi tiết để gom các mục cần ôn tại đây.</p>') +
      "</div>" +
      '<div class="verify" role="note"><strong>Lưu ý.</strong> Nội dung là tóm lược để học, không chép nguyên văn DSM-5-TR. Luôn đối chiếu nguồn gốc. Không nhập thông tin định danh bệnh nhân thật vào web này.</div>';
    flashcard();
  }
  var flashId = null;
  function flashcard() {
    var box = document.getElementById("flash"); if (!box) return;
    var pool = P.terms.concat(P.disorders);
    var e = pool[Math.floor(Math.random() * pool.length)];
    flashId = e.id;
    box.innerHTML = '<h2>Ôn nhanh</h2><p class="muted">Tự nói ra định nghĩa bằng lời của bạn trước, rồi mới xem đáp án.</p>' +
      '<h3 style="font-size:1.4rem">' + esc(e.vi) + ' <span class="en">' + esc(e.en) + "</span></h3>" +
      '<div id="flash-ans" hidden><p>' + esc(e.def || e.summary) + '</p><p><a href="#/e/' + esc(e.id) + '">Mở chi tiết</a></p></div>' +
      '<div class="pillrow"><button class="btn sm" id="flash-show" type="button">Xem đáp án</button>' +
      '<button class="btn sm ghost" id="flash-next" type="button">Mục khác</button></div>';
    document.getElementById("flash-show").onclick = function () { document.getElementById("flash-ans").hidden = false; this.hidden = true; };
    document.getElementById("flash-next").onclick = flashcard;
  }

  /* ---------- Danh sách có lọc ---------- */
  function listPage(opts) {
    document.title = opts.title + " · PsyAtlas";
    var items = opts.items, groups = {};
    items.forEach(function (e) { groups[e._group] = (groups[e._group] || 0) + 1; });
    var gnames = Object.keys(groups).sort(function (a, b) { return a.localeCompare(b, "vi"); });
    var active = "";
    view.innerHTML =
      '<div class="page-head"><h1>' + esc(opts.title) + '</h1><p class="lead">' + esc(opts.lead) + "</p></div>" + opts.extra +
      '<div class="chips" id="chips"></div><div class="grid" id="grid"></div>';
    function draw() {
      document.getElementById("chips").innerHTML =
        '<button class="chip" type="button" data-g="" aria-pressed="' + (active === "") + '">Tất cả (' + items.length + ")</button>" +
        gnames.map(function (g) { return '<button class="chip" type="button" data-g="' + esc(g) + '" aria-pressed="' + (active === g) + '">' + esc(g) + " (" + groups[g] + ")</button>"; }).join("");
      var shown = items.filter(function (e) { return !active || e._group === active; })
        .sort(function (a, b) { return a.vi.localeCompare(b.vi, "vi"); });
      document.getElementById("grid").innerHTML = shown.map(card).join("");
    }
    document.getElementById("chips").addEventListener("click", function (ev) {
      var b = ev.target.closest(".chip"); if (!b) return;
      active = b.getAttribute("data-g"); draw();
    });
    draw();
  }
  function pageTerms() {
    listPage({ title: "Thuật ngữ", lead: "Tra cứu khái niệm song ngữ. Bấm vào mục để xem ví dụ và các khái niệm liên quan.", items: P.terms, extra: "" });
  }
  function pageDisorders() {
    listPage({
      title: "Rối loạn & hội chứng", lead: "Tóm lược biểu hiện, chẩn đoán phân biệt và cơ sở thần kinh. Dùng như bản đồ ôn tập rồi quay lại DSM-5-TR và ICD-11 để xem tiêu chuẩn.",
      items: P.disorders, extra: verify("disorder")
    });
  }

  /* ---------- Trang chi tiết ---------- */
  function pageEntry(id) {
    var e = BY[id];
    if (!e) { view.innerHTML = '<div class="empty">Không tìm thấy mục này. <a href="#/">Về trang chủ</a></div>'; return; }
    document.title = e.vi + " · PsyAtlas";
    var back = e._kind === "term" ? "#/terms" : e._kind === "disorder" ? "#/disorders" : "#/neuro";
    var html = (lessonCtx && LBY[lessonCtx] ? '<a class="back" href="#/learn/' + lessonCtx + '">← Về bài: ' + esc(LBY[lessonCtx].title) + "</a>" : '<a class="back" href="' + back + '">← Quay lại</a>') +
      '<div class="page-head"><div class="pillrow" style="margin-bottom:10px"><span class="tag">' + esc(e._kindLabel) + '</span><span class="tag">' + esc(e._group) + "</span></div>" +
      "<h1>" + esc(e.vi) + '</h1><p class="en lead">' + esc(e.en) + "</p>" +
      '<button class="star" id="star" type="button" aria-pressed="' + (favs().indexOf(id) >= 0) + '">' + (favs().indexOf(id) >= 0 ? "Đã lưu" : "Lưu để ôn") + "</button></div>";

    if (e._kind === "term") {
      html += '<div class="panel"><h2>Định nghĩa</h2><p>' + esc(e.def) + "</p><h3>Ví dụ</h3><p>" + esc(e.ex) + "</p></div>";
    } else if (e._kind === "disorder") {
      html += '<div class="panel"><h2>Tóm lược</h2><p>' + esc(e.summary) + "</p>" +
        '<dl class="kv"><dt>Tên theo DSM</dt><dd>' + esc(e.dsm) + "</dd><dt>Mã ICD-11</dt><dd>" + esc(e.icd) + "</dd></dl></div>" +
        '<div class="two"><div class="panel"><h2>Biểu hiện thường gặp</h2>' + list(e.features) + '</div><div class="panel"><h2>Chẩn đoán phân biệt</h2>' + list(e.dd) + "</div></div>" +
        '<div class="panel"><h2>Hướng tiếp cận thường dùng</h2><p>' + esc(e.approach) + "</p>" + (e.note ? '<p class="muted"><strong>Lưu ý:</strong> ' + esc(e.note) + "</p>" : "") + "</div>";
      if (e.neuro && e.neuro.length) html += '<div class="panel"><h2>Cơ sở thần kinh liên quan</h2>' + pills(e.neuro) + "</div>";
    } else {
      if (e.functions) {
        html += '<div class="two"><div class="panel"><h2>Chức năng chính</h2>' + list(e.functions) + '</div><div class="panel"><h2>Khi tổn thương hoặc hoạt động bất thường</h2>' + list(e.impairment) + "</div></div>";
      } else {
        html += '<div class="panel"><h2>Vai trò</h2><p>' + esc(e.role) + "</p>" +
          (e.high ? "<h3>Khi tăng</h3><p>" + esc(e.high) + "</p>" : "") + (e.low ? "<h3>Khi giảm</h3><p>" + esc(e.low) + "</p>" : "") + "</div>";
      }
      if (e.note) html += '<div class="panel"><p class="muted" style="margin:0"><strong>Lưu ý:</strong> ' + esc(e.note) + "</p></div>";
    }

    var refs = refsOf(id);
    var by = { term: [], disorder: [], neuro: [] };
    refs.forEach(function (r) { by[r._kind].push(r.id); });
    if (e._kind !== "term" || refs.length) {
      var parts = [];
      if (by.term.length) parts.push("<h3>Thuật ngữ liên quan</h3>" + pills(by.term));
      if (by.disorder.length && e._kind !== "disorder") parts.push("<h3>Rối loạn liên quan</h3>" + pills(by.disorder));
      if (by.disorder.length && e._kind === "disorder") parts.push("<h3>Rối loạn liên quan</h3>" + pills(by.disorder));
      if (by.neuro.length && e._kind !== "disorder") parts.push("<h3>Thần kinh liên quan</h3>" + pills(by.neuro));
      if (parts.length) html += '<div class="panel"><h2>Nối kết</h2>' + parts.join("") + "</div>";
    }
    html += srcHtml(e);
    html += verify(e._kind);
    view.innerHTML = html;
    document.getElementById("star").onclick = function () {
      var on = toggleFav(id);
      this.setAttribute("aria-pressed", on); this.textContent = on ? "Đã lưu" : "Lưu để ôn";
    };
  }

  /* ---------- Sinh lý thần kinh ---------- */
  var LOBE_SHAPES = [
    { id: "n-frontal", pts: "40,20 215,20 200,95 185,135 130,185 40,185", lx: 100, ly: 110, alt: false },
    { id: "n-parietal", pts: "215,20 305,20 295,150 260,140 185,135 200,95", lx: 245, ly: 80, alt: true },
    { id: "n-occipital", pts: "305,20 370,20 370,230 285,230 295,150", lx: 335, ly: 130, alt: false },
    { id: "n-temporal", pts: "130,185 185,135 260,140 295,150 285,230 40,230 40,185", lx: 180, ly: 195, alt: true }
  ];
  var OUTLINE = "M60 170 C40 100 100 35 200 35 C300 35 355 90 350 160 C348 200 320 215 290 215 L215 220 C200 215 170 225 130 218 C85 212 65 195 60 170 Z";
  var brainSel = "n-frontal";
  function brainSvg() {
    var s = '<svg viewBox="0 0 400 310" role="group" aria-label="Bản đồ não nhìn từ bên, phía trước ở bên trái">' +
      '<defs><clipPath id="clip"><path d="' + OUTLINE + '"/></clipPath></defs><g clip-path="url(#clip)">';
    LOBE_SHAPES.forEach(function (l) {
      s += '<polygon class="lobe' + (l.alt ? " alt" : "") + '" data-id="' + l.id + '" points="' + l.pts + '" tabindex="0" role="button" aria-label="' + esc(BY[l.id].vi) + '" aria-pressed="' + (brainSel === l.id) + '"/>' +
        '<text class="lobe-label" x="' + l.lx + '" y="' + l.ly + '" text-anchor="middle">' + esc(BY[l.id].vi.split(" (")[0]) + "</text>";
    });
    s += '</g><path class="outline" d="' + OUTLINE + '"/>' +
      '<ellipse class="lobe alt" data-id="n-cerebellum" cx="300" cy="238" rx="56" ry="24" tabindex="0" role="button" aria-label="Tiểu não" aria-pressed="' + (brainSel === "n-cerebellum") + '"/>' +
      '<text class="lobe-label" x="300" y="242" text-anchor="middle">Tiểu não</text>' +
      '<path class="lobe" data-id="n-brainstem" d="M222 218 L262 218 L254 300 L228 300 Z" tabindex="0" role="button" aria-label="Thân não" aria-pressed="' + (brainSel === "n-brainstem") + '"/>' +
      '<text class="lobe-label" x="198" y="270" text-anchor="end">Thân não</text></svg>';
    return s;
  }
  function brainPanel() {
    var e = BY[brainSel];
    return '<div class="panel detail-box"><div class="pillrow" style="margin-bottom:8px"><span class="tag">' + esc(e.kind) + "</span></div><h2>" + esc(e.vi) + '</h2><p class="en">' + esc(e.en) + "</p>" +
      "<h3>Chức năng chính</h3>" + list(e.functions) + "<h3>Khi tổn thương hoặc bất thường</h3>" + list(e.impairment) +
      '<p><a href="#/e/' + esc(e.id) + '">Mở trang chi tiết và liên kết</a></p></div>';
  }
  function pageNeuro() {
    document.title = "Sinh lý thần kinh · PsyAtlas";
    var tab = "map";
    view.innerHTML = '<div class="page-head"><h1>Sinh lý thần kinh</h1><p class="lead">Nối cấu trúc não và hệ dẫn truyền với biểu hiện lâm sàng. Chọn vùng trên bản đồ, xem chất dẫn truyền, hoặc đi ngược từ biểu hiện về các vùng cần nghĩ tới.</p></div>' +
      '<div class="tabs" role="tablist" id="tabs">' +
      '<button class="tab" role="tab" data-t="map" aria-selected="true">Bản đồ não</button>' +
      '<button class="tab" role="tab" data-t="sys" aria-selected="false">Chất dẫn truyền &amp; hệ thống</button>' +
      '<button class="tab" role="tab" data-t="sym" aria-selected="false">Từ biểu hiện tìm vùng não</button></div>' +
      '<div id="tabbody"></div>' + verify("neuro");
    function body() {
      var b = document.getElementById("tabbody");
      if (tab === "map") {
        var deep = P.neuro.regions.filter(function (r) { return r.kind !== "Thùy não" && r.kind !== "Thân não & tiểu não"; });
        b.innerHTML = '<div class="brainwrap"><div><div class="brain">' + brainSvg() + '</div>' +
          '<p class="notice">Hình minh họa đơn giản hóa (nhìn từ bên). Chọn một vùng để xem chi tiết.</p>' +
          '<h3>Cấu trúc sâu &amp; mạng lưới</h3><div class="deeplist">' + deep.map(function (r) { return '<button class="chip" type="button" data-id="' + r.id + '" aria-pressed="' + (brainSel === r.id) + '">' + esc(r.vi) + "</button>"; }).join("") + "</div></div>" +
          '<div id="bp">' + brainPanel() + "</div></div>";
        var pick = function (id) { brainSel = id; body(); };
        b.querySelectorAll(".lobe").forEach(function (n) {
          n.addEventListener("click", function () { pick(n.getAttribute("data-id")); });
          n.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); pick(n.getAttribute("data-id")); } });
        });
        b.querySelectorAll(".deeplist .chip").forEach(function (n) { n.addEventListener("click", function () { pick(n.getAttribute("data-id")); }); });
      } else if (tab === "sys") {
        b.innerHTML = '<div class="grid">' + P.neuro.systems.map(card).join("") + "</div>";
      } else {
        b.innerHTML = P.neuro.symptoms.map(function (x) {
          return '<div class="sym-row"><h3>' + esc(x.s) + "</h3>" + pills(x.pick) + (x.note ? '<p class="muted" style="margin:10px 0 0;font-size:.9rem">' + esc(x.note) + "</p>" : "") + "</div>";
        }).join("");
      }
    }
    document.getElementById("tabs").addEventListener("click", function (ev) {
      var t = ev.target.closest(".tab"); if (!t) return;
      tab = t.getAttribute("data-t");
      document.querySelectorAll("#tabs .tab").forEach(function (x) { x.setAttribute("aria-selected", x === t); });
      body();
    });
    body();
  }


  /* ---------- Chương trình học ---------- */
  var LESSONS = [], LBY = {};
  (P.learn ? P.learn.stages : []).forEach(function (st) {
    st.modules.forEach(function (m) {
      m.lessons.forEach(function (l) { l._stage = st; l._module = m; LESSONS.push(l); LBY[l.id] = l; });
    });
  });
  var lessonCtx = null;           // bài học mà người dùng vừa đi ra từ đó
  function doneMap() { return store("psy.lessons") || {}; }
  function quizMap() { return store("psy.quiz") || {}; }
  function fmtTime(m) { return m < 60 ? m + " phút" : "≈ " + String(Math.round(m / 6) / 10).replace(".", ",") + " giờ"; }
  function lessonStatus(l) {
    var d = doneMap()[l.id], q = quizMap()[l.id];
    return { done: !!d, best: q ? q.best : null, total: q ? q.total : l.quiz.length };
  }
  function scoreLabel(pct) {
    return pct >= 85 ? "Vững" : pct >= 60 ? "Tạm ổn" : "Chưa vững";
  }
  function pageLearn(arg) {
    if (arg && LBY[arg]) return pageLesson(LBY[arg]);
    if (arg !== "") { location.hash = "#/learn"; return; }
    lessonCtx = null;
    document.title = "Chương trình học · PsyAtlas";
    var dm = doneMap();
    var next = LESSONS.filter(function (l) { return !dm[l.id]; })[0];
    var html = '<div class="page-head"><h1>Chương trình học</h1><p class="lead">Lộ trình 8 tháng chia thành bốn giai đoạn. Mỗi bài có việc cần đọc, các mục cần học, và bài tự kiểm tra ở cuối. Hiện đã mở Giai đoạn 1.</p></div>';
    if (next) html += '<div class="panel next"><div><div class="muted" style="font-size:.85rem">Bài tiếp theo</div><h2 style="margin:2px 0 0">' + esc(next.title) + '</h2></div><a class="btn" href="#/learn/' + next.id + '">Học tiếp</a></div>';
    P.learn.stages.forEach(function (st) {
      var ls = []; st.modules.forEach(function (m) { ls = ls.concat(m.lessons); });
      var nd = ls.filter(function (l) { return dm[l.id]; }).length;
      html += '<section class="stage' + (st.ready ? "" : " soon") + '"><div class="stage-head"><div><h2>' + esc(st.title) + "</h2><div class=\"muted\">" + esc(st.months) + "</div></div>" +
        (st.ready ? '<div class="prog" role="img" aria-label="Đã học ' + nd + " trên " + ls.length + ' bài"><span style="width:' + (ls.length ? Math.round(nd / ls.length * 100) : 0) + '%"></span></div><div class="muted prog-n">' + nd + "/" + ls.length + " bài</div>" : '<span class="tag">Sắp có</span>') + "</div>" +
        "<p>" + esc(st.goal) + "</p>";
      st.modules.forEach(function (m) {
        html += '<h3 class="mod">' + esc(m.month) + " · " + esc(m.title) + '</h3><ol class="lessons">' + m.lessons.map(function (l) {
          var s = lessonStatus(l), pct = s.best == null ? null : Math.round(s.best / s.total * 100);
          return '<li><a class="lesson-row" href="#/learn/' + l.id + '"><span class="chk' + (s.done ? " on" : "") + '" aria-hidden="true">' + (s.done ? "✓" : "") + '</span><span class="lt">' + esc(l.title) + '<span class="muted lm">' + fmtTime(l.minutes) + " · " + l.read.filter(function (r) { return !r.extra; }).length + " phần cần đọc · " + l.study.length + " mục · " + l.quiz.length + " câu hỏi</span></span>" +
            (pct == null ? '<span class="tag off">Chưa làm bài</span>' : '<span class="tag sc-' + (pct >= 85 ? "hi" : pct >= 60 ? "mid" : "lo") + '">' + s.best + "/" + s.total + " · " + scoreLabel(pct) + "</span>") + "</a></li>";
        }).join("") + "</ol>";
      });
      html += "</section>";
    });
    html += '<div class="verify" role="note"><strong>Cách dùng.</strong> Đọc các phần được chỉ định trong giáo trình trước, rồi mở từng mục trong PsyAtlas để đối chiếu, sau đó làm bài tự kiểm tra. Bài kiểm tra chỉ có vài câu nên chỉ cho biết bạn đang ở đâu, không thay thế việc tự giải thích lại bằng lời của mình.</div>';
    view.innerHTML = html;
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function parallelHtml(l) {
    var rows = [];
    ["ls", "sl"].forEach(function (k) {
      (P.books[k] || []).forEach(function (c) {
        if ((c.lessons || []).indexOf(l.id) >= 0) rows.push('<li><a href="#/read/' + k + "/" + esc(c.sections[0].sec) + '"><strong>' + esc(P.srcInfo[k].short) + "</strong> · chương " + c.n + " · " + esc(c.en) + " · " + P.srcInfo[k].pgLabel + " " + c.pg + "</a></li>");
      });
    });
    return rows.length ? '<div class="panel"><h3>Đọc song song (tùy chọn)</h3><p class="muted" style="font-size:.88rem">Hai giáo trình bổ sung bạn đã thêm có chương tương ứng. Số trang là trang trong file PDF.</p><ul class="srclist">' + rows.join("") + "</ul></div>" : "";
  }
  function pageLesson(l) {
    document.title = l.title + " · PsyAtlas";
    lessonCtx = l.id;
    var idx = LESSONS.indexOf(l), prev = LESSONS[idx - 1], nextL = LESSONS[idx + 1], st = lessonStatus(l);
    var info = P.srcInfo;
    var core = l.read.filter(function (r) { return !r.extra; }), extra = l.read.filter(function (r) { return r.extra; });
    function readItem(r) {
      return '<li><a href="#/read/' + r.b + "/" + esc(r.sec) + '"><strong>' + esc(info[r.b].short) + "</strong> · mục " + esc(r.sec) + " · " + (info[r.b].pgLabel || "tr.") + " " + r.pg + "</a> " + (r.why ? '<span class="muted">' + esc(r.why) + "</span>" : "") + "</li>";
    }
    var html = '<a class="back" href="#/learn">← Chương trình học</a>' +
      '<div class="page-head"><div class="pillrow" style="margin-bottom:10px"><span class="tag">' + esc(l._module.month) + '</span><span class="tag">' + esc(l._module.title) + '</span><span class="tag">' + fmtTime(l.minutes) + "</span></div><h1>" + esc(l.title) + "</h1></div>" +
      '<div class="panel"><h2>Sau bài này bạn có thể</h2>' + list(l.goals) + "</div>" +
      '<div class="panel step"><h2><span class="n">1</span> Đọc</h2><ul class="srclist">' + core.map(readItem).join("") + "</ul>" +
      (extra.length ? '<h3 style="margin-top:14px">Đọc thêm (nâng cao)</h3><ul class="srclist">' + extra.map(readItem).join("") + "</ul>" : "") +
      '<p class="muted" style="font-size:.85rem;margin:10px 0 0">Bấm vào mục để mở đúng phần trong trang Giáo trình. Số trang là số in trong sách.</p></div>' +
      parallelHtml(l) +
      '<div class="panel step"><h2><span class="n">2</span> Học trong PsyAtlas</h2><p class="muted">Mở từng mục, tự nói lại định nghĩa bằng lời của mình rồi mới đối chiếu.</p><div class="grid study">' +
      l.study.map(function (id) { var e = BY[id]; return e ? '<a class="card" data-lesson="' + l.id + '" href="#/e/' + esc(id) + '"><h3>' + esc(e.vi) + '</h3><div class="meta">' + esc(e._kindLabel) + "</div></a>" : ""; }).join("") + "</div></div>" +
      '<div class="two"><div class="panel"><h2>Ý chính</h2>' + list(l.keys) + '</div><div class="panel"><h2>Dễ nhầm</h2>' + list(l.pitfalls) + "</div></div>" +
      '<div class="panel"><h2>Nối với thực hành</h2><p style="margin:0">' + esc(l.practice) + "</p></div>" +
      '<div class="panel step" id="quizbox"><h2><span class="n">3</span> Tự kiểm tra</h2><div id="quiz"></div></div>' +
      '<div class="panel lesson-foot"><label class="donelabel"><input type="checkbox" id="done"' + (st.done ? " checked" : "") + '> Đánh dấu đã học xong bài này</label>' +
      '<div class="pillrow">' + (prev ? '<a class="pill" href="#/learn/' + prev.id + '">← ' + esc(prev.title) + "</a>" : "") + (nextL ? '<a class="pill" href="#/learn/' + nextL.id + '">' + esc(nextL.title) + " →</a>" : "") + "</div></div>" +
      '<div class="verify" role="note"><strong>Cần kiểm chứng.</strong> Nội dung bài và đáp án được tóm lược từ giáo trình OpenStax. Nếu bạn thấy một đáp án khác với sách, hãy tin sách và báo lại để mình sửa.</div>';
    view.innerHTML = html;
    document.getElementById("done").onchange = function () {
      var m = doneMap(); if (this.checked) m[l.id] = 1; else delete m[l.id]; store("psy.lessons", m);
    };
    view.querySelectorAll("a[data-lesson]").forEach(function (x) { x.addEventListener("click", function () { lessonCtx = x.getAttribute("data-lesson"); }); });
    renderQuiz(l);
  }
  function renderQuiz(l) {
    var box = document.getElementById("quiz"), qm = quizMap()[l.id];
    var qs = shuffle(l.quiz).map(function (q) { return { q: q, opts: shuffle([q.ok].concat(q.no)) }; });
    box.innerHTML = (qm ? '<p class="muted">Lần tốt nhất: ' + qm.best + "/" + qm.total + " (" + esc(qm.at) + "). Thứ tự câu và đáp án được xáo mỗi lần làm.</p>" : '<p class="muted">Làm sau khi đã đọc và học xong. ' + l.quiz.length + " câu, mỗi câu một đáp án đúng. Thứ tự được xáo mỗi lần làm.</p>") +
      '<form id="qf" novalidate>' + qs.map(function (x, i) {
        return '<fieldset class="q" id="q' + i + '"><legend><span class="qn">Câu ' + (i + 1) + ".</span> " + esc(x.q.q) + "</legend>" + x.opts.map(function (o, j) {
          return '<label class="opt"><input type="radio" name="q' + i + '" value="' + j + '"> <span>' + esc(o) + "</span></label>";
        }).join("") + '<div class="fb" hidden></div></fieldset>';
      }).join("") + '<div class="pillrow"><button class="btn" type="submit" id="grade">Chấm điểm</button></div><div id="result" aria-live="polite"></div></form>';
    var form = document.getElementById("qf");
    form.onsubmit = function (ev) {
      ev.preventDefault();
      var score = 0, wrong = [], unanswered = 0;
      qs.forEach(function (x, i) { if (!form.querySelector('input[name="q' + i + '"]:checked')) unanswered++; });
      if (unanswered) { document.getElementById("result").innerHTML = '<p class="warnline">Còn ' + unanswered + " câu chưa chọn đáp án. Hãy trả lời hết rồi chấm điểm.</p>"; return; }
      qs.forEach(function (x, i) {
        var fs = document.getElementById("q" + i), picked = +form.querySelector('input[name="q' + i + '"]:checked').value, ok = x.opts[picked] === x.q.ok;
        if (ok) score++; else wrong.push(x.q);
        fs.querySelectorAll(".opt").forEach(function (lab, j) {
          var inp = lab.querySelector("input"); inp.disabled = true;
          if (x.opts[j] === x.q.ok) lab.classList.add("right"); else if (j === picked) lab.classList.add("wrong");
        });
        var fb = fs.querySelector(".fb"); fb.hidden = false;
        fb.innerHTML = "<strong>" + (ok ? "Đúng." : "Chưa đúng.") + "</strong> " + (ok ? "" : "Đáp án: " + esc(x.q.ok) + ". ") + esc(x.q.why) + (x.q.ref.length ? pills(x.q.ref) : "");
      });
      var pct = Math.round(score / qs.length * 100), lab = scoreLabel(pct);
      var m = quizMap(), prevBest = m[l.id] ? m[l.id].best : -1;
      m[l.id] = { best: Math.max(prevBest, score), total: qs.length, last: score, at: new Date().toISOString().slice(0, 10) };
      store("psy.quiz", m);
      var advice = pct >= 85 ? "Bạn nắm khá chắc phần này. Hãy đánh dấu hoàn thành và sang bài kế tiếp."
        : pct >= 60 ? "Tạm ổn. Xem lại các mục liên quan ở câu sai bên dưới, tự giải thích lại bằng lời của mình rồi làm lại."
        : "Chưa vững. Hãy đọc lại các phần ở bước 1, học lại các mục ở bước 2 rồi làm lại bài.";
      var weak = {}; wrong.forEach(function (q) { q.ref.forEach(function (id) { weak[id] = 1; }); });
      document.getElementById("result").innerHTML = '<div class="score sc-' + (pct >= 85 ? "hi" : pct >= 60 ? "mid" : "lo") + '"><div class="big">' + score + "/" + qs.length + '</div><div><strong>' + lab + "</strong> · " + pct + "%<br>" + esc(advice) + "</div></div>" +
        (Object.keys(weak).length ? "<h3>Nên ôn lại</h3>" + pills(Object.keys(weak)) : "") +
        '<div class="pillrow" style="margin-top:14px"><button class="btn ghost" type="button" id="retry">Làm lại</button></div>';
      document.getElementById("grade").hidden = true;
      document.getElementById("retry").onclick = function () { renderQuiz(l); document.getElementById("quizbox").scrollIntoView(); };
      document.getElementById("result").scrollIntoView({ block: "nearest" });
    };
  }

  /* ---------- Giáo trình ---------- */
  var MONTHS = { 1: "Tháng 1 · 8/2026", 2: "Tháng 2 · 9/2026", 3: "Tháng 3 · 10/2026", 4: "Tháng 4 · 11/2026", 5: "Tháng 5 · 12/2026", 6: "Tháng 6 · 1/2027", 7: "Tháng 7 · 2/2027", 8: "Tháng 8 · 3–4/2027", 0: "Đọc thêm (ngoài lộ trình)" };
  function pageBooks(arg) {
    document.title = "Giáo trình · PsyAtlas";
    var parts0 = String(arg || "").split("/");
    var key = P.books[parts0[0]] ? parts0[0] : "psy", focusSec = parts0[1] || "", info = P.srcInfo[key], chapters = P.books[key];
    var read = store("psy.read") || {};
    function done(c) { return c.sections.length && c.sections.every(function (s) { return read[key + ":" + s.sec]; }); }
    function total() { var n = 0, d = 0; chapters.forEach(function (c) { c.sections.forEach(function (s) { n++; if (read[key + ":" + s.sec]) d++; }); }); return [d, n]; }
    function draw() {
      var t = total(), byMonth = {};
      chapters.forEach(function (c) { (byMonth[c.month] = byMonth[c.month] || []).push(c); });
      var order = [1, 2, 3, 4, 5, 6, 7, 8, 0].filter(function (m) { return byMonth[m]; });
      view.innerHTML = '<div class="page-head"><h1>Giáo trình</h1><p class="lead">Mục lục năm giáo trình gắn với lộ trình 8 tháng. Bấm tên một mục để đọc nội dung gốc (lấy từ file PDF của bạn trong Thư viện) và xem các sách khác viết về cùng chủ đề. Ô vuông để đánh dấu đã đọc.</p></div>' +
        '<div class="tabs" id="btabs">' + ["psy", "nb", "ls", "sl", "gw"].map(function (k) { return '<button class="tab" data-b="' + k + '" aria-selected="' + (key === k) + '">' + esc(P.srcInfo[k].short) + "</button>"; }).join("") + "</div>" +
        '<div class="panel"><h2>' + esc(info.full) + '</h2><p class="muted">Giấy phép ' + esc(info.license) + '. Nguồn: <a href="' + esc(info.url) + '" target="_blank" rel="noopener">' + esc(info.url.replace(/^https?:\/\//, "").replace(/\/$/, "")) + "</a>" + (key === "psy" || key === "nb" ? " (Access for free at openstax.org)" : "") + ". Tiến độ: " + t[0] + "/" + t[1] + " mục đã đọc.</p></div>" +
        order.map(function (m) {
          return "<h2 class=\"bk-month\">" + esc(MONTHS[m]) + "</h2>" + byMonth[m].map(function (c) {
            return '<details class="panel bk-ch"' + (done(c) ? "" : "") + "><summary><strong>Chương " + c.n + ". " + esc(c.vi) + '</strong> <span class="en">' + esc(c.en) + '</span> <span class="muted">· ' + (info.pgLabel || "tr.") + " " + c.pg + (done(c) ? " · đã đọc" : "") + "</span></summary><ul class=\"bk-secs\">" +
              c.sections.map(function (s) {
                var k = key + ":" + s.sec, ids = SECIDX[k] || [];
                return '<li><label class="rdchk"><input type="checkbox" data-k="' + esc(k) + '" aria-label="Đã đọc mục ' + esc(s.sec) + '"' + (read[k] ? " checked" : "") + '></label> <a class="seclink" href="#/read/' + esc(key) + "/" + esc(s.sec) + '">' + esc(s.sec) + " " + esc(s.title) + '</a> <span class="muted">' + (info.pgLabel || "tr.") + " " + s.pg + "</span>" + (ids.length ? pills(ids) : "") + "</li>";
              }).join("") + "</ul></details>";
          }).join("");
        }).join("");
      view.querySelectorAll("#btabs .tab").forEach(function (b) { b.onclick = function () { location.hash = "#/books/" + b.getAttribute("data-b"); }; });
      view.querySelectorAll(".bk-secs input").forEach(function (cb) {
        cb.onchange = function () {
          var k = cb.getAttribute("data-k"); if (cb.checked) read[k] = 1; else delete read[k];
          store("psy.read", read);
          var open = []; view.querySelectorAll("details").forEach(function (d, i) { if (d.open) open.push(i); });
          draw(); view.querySelectorAll("details").forEach(function (d, i) { if (open.indexOf(i) >= 0) d.open = true; });
        };
      });
    }
    draw();
    if (focusSec) {
      var cbf = view.querySelector('.bk-secs input[data-k="' + key + ":" + focusSec + '"]');
      if (cbf) {
        var li = cbf.closest("li"), det = cbf.closest("details");
        if (det) det.open = true;
        li.classList.add("hl");
        setTimeout(function () { li.scrollIntoView({ block: "center" }); }, 30);
      }
    }
  }

  /* ---------- Đọc nội dung gốc ---------- */
  function pageRead(arg) {
    var parts = String(arg || "").split("/"), key = parts[0], sec = parts[1] || "";
    if (!window.PsyReader) { view.innerHTML = '<div class="empty">Không tải được mô-đun đọc sách.</div>'; return; }
    var back = lessonCtx && LBY[lessonCtx] ? { href: "#/learn/" + lessonCtx, title: LBY[lessonCtx].title } : null;
    window.PsyReader.render(view, key, sec, { pills: pills, secIdx: SECIDX, lessonBack: back });
  }

  /* ---------- Thư viện ---------- */
  function pageLibrary() {
    document.title = "Thư viện · PsyAtlas";
    if (window.PsyLibrary) window.PsyLibrary.render(view);
    else view.innerHTML = '<div class="empty">Không tải được mô-đun thư viện.</div>';
  }

  /* ---------- Tìm kiếm toàn trang ---------- */
  var q = document.getElementById("q"), res = document.getElementById("results");
  function search() {
    var t = norm(q.value.trim());
    if (!t) { res.hidden = true; res.innerHTML = ""; return; }
    var scored = [];
    ALL.forEach(function (e) {
      var v = norm(e.vi), en = norm(e.en), s = 0;
      if (v === t || en === t) s = 100;
      else if (v.indexOf(t) === 0 || en.indexOf(t) === 0) s = 80;
      else if (e._alias && e._alias.split(" ").indexOf(t) >= 0) s = 75;
      else if (v.indexOf(t) >= 0 || en.indexOf(t) >= 0) s = 60;
      else if (e._search.indexOf(t) >= 0) s = 20;
      if (s) scored.push({ e: e, s: s });
    });
    scored.sort(function (a, b) { return b.s - a.s || a.e.vi.localeCompare(b.e.vi, "vi"); });
    var top = scored.slice(0, 8);
    res.innerHTML = top.length ? top.map(function (x) {
      return '<a href="#/e/' + esc(x.e.id) + '"><span class="kind">' + esc(x.e._kindLabel) + "</span><span>" + esc(x.e.vi) + ' <span class="en">' + esc(x.e.en) + "</span></span></a>";
    }).join("") : '<div style="padding:12px 14px" class="muted">Không có kết quả khớp.</div>';
    res.hidden = false;
  }
  q.addEventListener("input", search);
  q.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter") { var a = res.querySelector("a"); if (a) { location.hash = a.getAttribute("href"); q.blur(); res.hidden = true; } }
    if (ev.key === "Escape") { res.hidden = true; q.blur(); }
  });
  res.addEventListener("click", function () { res.hidden = true; q.value = ""; });
  document.addEventListener("click", function (ev) { if (!ev.target.closest(".search")) res.hidden = true; });
  document.addEventListener("keydown", function (ev) {
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    if (ev.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(tag)) { ev.preventDefault(); q.focus(); }
  });

  /* ---------- Giao diện, menu ---------- */
  var root = document.documentElement;
  var savedTheme = store("psy.theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  document.getElementById("theme").addEventListener("click", function () {
    var cur = root.getAttribute("data-theme") ||
      (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next); store("psy.theme", next);
  });
  document.getElementById("menu").addEventListener("click", function () {
    var s = document.getElementById("side"), open = s.classList.toggle("open");
    this.setAttribute("aria-expanded", open);
  });

  document.getElementById("c-terms").textContent = P.terms.length;
  document.getElementById("c-dis").textContent = P.disorders.length;
  window.addEventListener("hashchange", render);
  render();
})();
