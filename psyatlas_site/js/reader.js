/* Trình đọc nội dung gốc: bấm một mục trong Giáo trình để đọc đoạn tương ứng trích ngay từ file PDF của bạn
   (file nằm trong Thư viện, trên máy này). Phần "Đối chiếu" đặt các mục tương ứng ở các sách khác cạnh nhau.
   Văn bản được đọc trực tiếp trong trình duyệt của bạn; PsyAtlas không chứa và không gửi nội dung sách đi đâu. */
window.PsyReader = (function () {
  "use strict";
  var P = window.PSY, U = window.PsyUtil, esc = U.esc, store = U.store;
  var PDFJS = "3.11.174";
  var CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" + PDFJS + "/";
  var STEP = 4;                       // số trang đọc mỗi lần bấm "Đọc tiếp"
  var FLAT = {}, DOCS = {}, LINES = {}, libP = null, entriesP = null;

  /* ---------- Dữ liệu mục ---------- */
  function flat(key) {
    if (!FLAT[key]) {
      var a = [];
      (P.books[key] || []).forEach(function (c) { c.sections.forEach(function (s) { a.push({ c: c, s: s }); }); });
      FLAT[key] = a;
    }
    return FLAT[key];
  }
  function locate(key, sec) {
    var a = flat(key), off = ((P.srcInfo[key] || {}).pdfOffset) || 0;
    for (var i = 0; i < a.length; i++) {
      if (a[i].s.sec === sec) return { key: key, i: i, c: a[i].c, s: a[i].s, prev: a[i - 1] || null, next: a[i + 1] || null, off: off };
    }
    return null;
  }
  /* Khoảng trang PDF của một mục. Mục kế tiếp cùng chương: đọc tới trang chứa tiêu đề mục đó rồi cắt.
     Mục cuối chương: đọc tới hết chương (cắt ở "Key Terms"/"Summary" nếu có). */
  function rangeOf(loc) {
    var start = loc.s.pg + loc.off, n = loc.next, end, nextTitle = null, chapterEnd = false;
    if (!n) { end = start + 7; chapterEnd = true; }
    else if (n.c !== loc.c) { end = Math.max(start, n.c.pg + loc.off - 1); chapterEnd = true; }
    else { end = Math.max(start, n.s.pg + loc.off); nextTitle = n.s.title; }
    return { start: start, end: end, nextTitle: nextTitle, chapterEnd: chapterEnd };
  }
  function pgText(key, loc, r) {
    var info = P.srcInfo[key], off = loc.off;
    var a = loc.s.pg, b = r.nextTitle ? loc.next.s.pg : (r.end - off);
    var lab = info.pgLabel || "tr.";
    return lab + " " + (b > a ? a + "–" + b : a) + (off ? " · trang PDF " + r.start + (r.end > r.start ? "–" + r.end : "") : "");
  }

  /* ---------- pdf.js ---------- */
  function loadLib() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (libP) return libP;
    libP = new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = CDN + "pdf.min.js";
      s.onload = function () {
        var l = window.pdfjsLib;
        if (!l) { libP = null; rej(new Error("Bộ đọc PDF tải xong nhưng không khởi tạo được.")); return; }
        l.GlobalWorkerOptions.workerSrc = CDN + "pdf.worker.min.js";
        res(l);
      };
      s.onerror = function () { libP = null; rej(new Error("Không tải được bộ đọc PDF (pdf.js) từ cdnjs.cloudflare.com. Cần có kết nối mạng ở lần đầu.")); };
      document.head.appendChild(s);
    });
    return libP;
  }
  /* Đọc theo từng đoạn byte của Blob để file lớn (hơn 200 MB) không phải nạp hết vào bộ nhớ */
  function openDoc(key, blob) {
    var id = key + ":" + blob.size;
    if (DOCS[id]) return DOCS[id];
    DOCS[id] = loadLib().then(function (lib) {
      var first = Math.min(blob.size, 65536);
      return blob.slice(0, first).arrayBuffer().then(function (buf) {
        var tr = new lib.PDFDataRangeTransport(blob.size, new Uint8Array(buf));
        tr.requestDataRange = function (begin, end) {
          blob.slice(begin, end).arrayBuffer().then(function (b) { tr.onDataRange(begin, new Uint8Array(b)); });
        };
        return lib.getDocument({ range: tr, length: blob.size, disableAutoFetch: true, disableStream: true }).promise;
      });
    }).catch(function (e) { delete DOCS[id]; throw e; });
    return DOCS[id];
  }

  /* ---------- Tách đoạn văn từ trang PDF ---------- */
  function median(a) { if (!a.length) return 10; var s = a.slice().sort(function (x, y) { return x - y; }); return s[Math.floor(s.length / 2)]; }
  function buildParas(items, H) {
    var rows = [];
    items.forEach(function (it) {
      var h = Math.abs(it.transform[3]) || it.height || 10, y = it.transform[5], row = null;
      for (var i = rows.length - 1; i >= 0 && i >= rows.length - 8; i--) {
        if (Math.abs(rows[i].y - y) < Math.max(1.5, Math.min(h, rows[i].h) * 0.45)) { row = rows[i]; break; }
      }
      if (!row) { row = { y: y, h: h, items: [] }; rows.push(row); }
      row.items.push({ x: it.transform[4], w: it.width || 0, s: it.str, h: h });
      if (h > row.h) row.h = h;
    });
    rows.sort(function (a, b) { return b.y - a.y; });
    rows.forEach(function (r) {
      r.items.sort(function (a, b) { return a.x - b.x; });
      var t = "", end = null;
      r.items.forEach(function (it) {
        if (end !== null && it.x - end > it.h * 0.18 && !/\s$/.test(t) && !/^\s/.test(it.s)) t += " ";
        t += it.s; end = it.x + it.w;
      });
      r.text = t.replace(/\s+/g, " ").trim();
      r.x0 = r.items.length ? r.items[0].x : 0;
    });
    rows = rows.filter(function (r) {
      if (!r.text) return false;
      if (r.y > H * 0.945 || r.y < H * 0.05) return false;                  // đầu trang, chân trang
      if (/^\d+$/.test(r.text) || /^Access for free at openstax\.org/i.test(r.text) || /^Saylor URL:/i.test(r.text) || /^Saylor\.org$/i.test(r.text) || /^This page titled .* is shared under/i.test(r.text) || /^(and\/or curated by|via source content that was edited)/i.test(r.text) || /^via source content/i.test(r.text)) return false;
      return true;
    });
    var hs = [], tot = 0;
    rows.forEach(function (r) { var w = Math.min(r.text.length, 80); for (var i = 0; i < Math.ceil(w / 10); i++) hs.push(r.h); tot += w; });
    var body = median(hs), paras = [], cur = null, prev = null;
    function flush() { if (cur) { paras.push(cur); cur = null; } }
    rows.forEach(function (r) {
      var head = r.h > body * 1.18 && r.text.length < 140, gap = prev ? prev.y - r.y : 0;
      if (head) {
        if (cur && cur.t === "h" && gap < r.h * 1.8 && Math.abs(cur.h - r.h) < 0.8) cur.s += " " + r.text; else { flush(); cur = { t: "h", s: r.text, h: r.h }; }
      } else {
        var bullet = /^[•◦▪–·]\s*|^\(?[0-9a-z]{1,2}[.)]\s+[A-Z]/.test(r.text);
        if (!cur || cur.t === "h" || gap > body * 1.55 || bullet) { flush(); cur = { t: "p", s: r.text }; }
        else if (/-$/.test(cur.s) && /^[a-z]/.test(r.text)) cur.s = cur.s.slice(0, -1) + r.text;
        else cur.s += " " + r.text;
      }
      prev = r;
    });
    flush();
    return paras;
  }
  /* Trang hai cột (nhiều trang của sách thần kinh học): đọc hết cột trái rồi tới cột phải */
  function splitColumns(items, W) {
    var bins = [], b, n = Math.ceil(W / 4) + 2, narrow = [];
    for (b = 0; b < n; b++) bins.push(0);
    items.forEach(function (it) {
      var x0 = it.transform[4], w = it.width || 0;
      if (!it.str.trim() || w > W * 0.55) return;
      narrow.push(it);
      for (b = Math.max(0, Math.floor(x0 / 4)); b <= Math.min(n - 1, Math.floor((x0 + w) / 4)); b++) bins[b]++;
    });
    if (narrow.length < 12) return null;
    var lo = Math.floor(W * 0.36 / 4), hi = Math.floor(W * 0.64 / 4), best = null, run = null;
    for (b = lo; b <= hi + 1; b++) {
      if (b <= hi && bins[b] === 0) { if (run === null) run = b; }
      else { if (run !== null && (!best || b - run > best.len)) best = { s: run, len: b - run }; run = null; }
    }
    if (!best || best.len < 3) return null;
    var gx = (best.s + best.len / 2) * 4, L = [], R = [];
    items.forEach(function (it) { if (it.transform[4] + (it.width || 0) / 2 < gx) L.push(it); else R.push(it); });
    var nl = narrow.filter(function (it) { return it.transform[4] + (it.width || 0) / 2 < gx; }).length;
    if (nl < narrow.length * 0.3 || narrow.length - nl < narrow.length * 0.3) return null;
    return [L, R];
  }
  function pageParas(key, doc, n) {
    var id = key + ":" + doc.fingerprints[0] + ":" + n;
    if (LINES[id]) return LINES[id];
    LINES[id] = doc.getPage(n).then(function (page) {
      var H = page.getViewport({ scale: 1 }).height;
      return page.getTextContent().then(function (tc) {
        var items = tc.items.filter(function (it) { return it.transform && typeof it.str === "string"; });
        var cols = splitColumns(items, page.getViewport({ scale: 1 }).width);
        return cols ? buildParas(cols[0], H).concat(buildParas(cols[1], H)) : buildParas(items, H);
      });
    });
    return LINES[id];
  }
  function nk(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, ""); }
  /* Tìm đoạn là tiêu đề mục: bắt đầu bằng "số mục + vài từ đầu của tiêu đề" (sách Saylor viết liền "2.3You Can…"),
     hoặc là một dòng ngắn chứa các từ đó. */
  function findHead(paras, title, sec) {
    var words = String(title).replace(/[:\-–—]/g, " ").split(/\s+/).filter(Boolean).slice(0, 4), key = nk(words.join(""));
    if (key.length < 6) key = nk(title);
    var full = sec ? nk(sec) + key : null, i, k;
    if (full) for (i = 0; i < paras.length; i++) { if (nk(paras[i].s).indexOf(full) === 0) return i; }
    for (i = 0; i < paras.length; i++) {
      k = nk(paras[i].s);
      if (k.indexOf(key) >= 0 && paras[i].s.length < String(title).length + 24) return i;
    }
    return -1;
  }
  var STOP = /^(Key Terms|Section Summary|Chapter Summary|Summary|Review Questions|Critical Thinking Questions|Personal Application Questions)$/i;

  /* ---------- Khối hiển thị văn bản gốc (dùng cho mục chính và các thẻ đối chiếu) ---------- */
  function mountText(el, key, loc, entry) {
    var r = rangeOf(loc), st = { cur: r.start, done: false, busy: false, noHead: false };
    el.innerHTML = '<div class="rd-body"></div><div class="rd-foot"></div>';
    var body = el.querySelector(".rd-body"), foot = el.querySelector(".rd-foot");
    function status(msg, cls) { foot.innerHTML = '<p class="' + (cls || "muted") + '" role="status">' + esc(msg) + "</p>"; }
    function more() {
      if (st.busy || st.done) return;
      st.busy = true; status("Đang đọc trang từ file của bạn…");
      openDoc(key, entry.blob).then(function (doc) {
        var last = Math.min(r.end, doc.numPages), stop = Math.min(st.cur + STEP - 1, last), chain = Promise.resolve();
        for (var p = st.cur; p <= stop; p++) (function (pn) {
          chain = chain.then(function () {
            if (st.done) return null;
            return pageParas(key, doc, pn).then(function (paras) {
              if (st.done) return;
              paras = paras.slice();
              var cutEnd = paras.length;
              if (pn === r.start) {
                var h = findHead(paras, loc.s.title, loc.s.sec);
                if (h >= 0) paras = paras.slice(h); else st.noHead = true;
              }
              if (pn === r.end && r.nextTitle) {
                var e = findHead(paras, r.nextTitle, loc.next.s.sec);
                if (e >= 0 && !(pn === r.start && e === 0)) { paras = paras.slice(0, e); st.done = true; }
              }
              if (r.chapterEnd) {
                for (var i = 0; i < paras.length; i++) if (STOP.test(paras[i].s) && !(pn === r.start && i === 0)) { paras = paras.slice(0, i); st.done = true; break; }
              }
              var html = !paras.length ? "" : '<div class="pgmark">trang PDF ' + pn + "</div>" + paras.map(function (q) {
                return q.t === "h" ? "<h4>" + esc(q.s) + "</h4>" : "<p>" + esc(q.s) + "</p>";
              }).join("");
              body.insertAdjacentHTML("beforeend", html);
            });
          });
        })(p);
        return chain.then(function () {
          st.cur = stop + 1;
          if (st.cur > last) st.done = true;
          st.busy = false;
          var msg = "";
          if (st.noHead) msg = "Không thấy tiêu đề mục ở trang dự kiến. Có thể file này là bản khác với bản mình dùng để lập số trang, hãy đối chiếu lại số trang.";
          if (st.done) { foot.innerHTML = (msg ? '<p class="notice">' + esc(msg) + "</p>" : "") + '<p class="muted">Hết mục. Văn bản được trích tự động nên bảng, hình và công thức có thể không hiện đủ; mở PDF để xem nguyên trang.</p>' + openBtn(); }
          else { foot.innerHTML = (msg ? '<p class="notice">' + esc(msg) + "</p>" : "") + '<button class="btn sm" type="button" data-more>Đọc tiếp ' + STEP + ' trang</button> ' + openBtn(); }
          var mb = foot.querySelector("[data-more]"); if (mb) mb.onclick = more;
          bindOpen();
        });
      }).catch(function (err) {
        st.busy = false; status("Không đọc được: " + err.message, "notice");
      });
    }
    function openBtn() { return '<button class="btn sm ghost" type="button" data-open>Xem ảnh trang ' + (st.cur - 1 > r.start ? st.cur - 1 : r.start) + " trong PDF</button>"; }
    function bindOpen() {
      var b = foot.querySelector("[data-open]"); if (!b) return;
      b.onclick = function () { viewPage(key, entry, st.cur - 1 > r.start ? st.cur - 1 : r.start); };
    }
    more();
  }

  /* Xem nguyên trang PDF dưới dạng ảnh (vẽ bằng pdf.js). Không mở tab blob: trang chạy trong khung cô lập nên Chrome chặn blob: mở ngoài. */
  function viewPage(key, entry, pn) {
    var d = document.getElementById("rd-dlg");
    if (!d) { d = document.createElement("dialog"); d.id = "rd-dlg"; d.className = "rd-dlg"; document.body.appendChild(d); }
    d.innerHTML = '<div class="rd-dlg-bar"><button class="btn sm ghost" type="button" data-p>←</button><span id="rd-dlg-n" role="status"></span><button class="btn sm ghost" type="button" data-n>→</button><button class="btn sm" type="button" data-x>Đóng</button></div><div class="rd-dlg-body"><canvas id="rd-cv"></canvas></div>';
    if (!d.open) d.showModal();
    var token = 0;
    function show(n) {
      var my = ++token, lab = d.querySelector("#rd-dlg-n"); lab.textContent = "Đang vẽ trang " + n + "…";
      openDoc(key, entry.blob).then(function (doc) {
        n = Math.max(1, Math.min(doc.numPages, n)); pn = n;
        return doc.getPage(n).then(function (page) {
          var vp0 = page.getViewport({ scale: 1 }), cv = d.querySelector("#rd-cv"), sc = Math.min(2, Math.max(1, 900 / vp0.width)), vp = page.getViewport({ scale: sc });
          if (my !== token) return;
          cv.width = vp.width; cv.height = vp.height;
          return page.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise.then(function () { if (my === token) lab.textContent = "Trang PDF " + n + " / " + doc.numPages; });
        });
      }).catch(function (e) { lab.textContent = "Không vẽ được trang: " + e.message; });
    }
    d.querySelector("[data-p]").onclick = function () { show(pn - 1); };
    d.querySelector("[data-n]").onclick = function () { show(pn + 1); };
    d.querySelector("[data-x]").onclick = function () { d.close(); };
    show(pn);
  }

  /* ---------- Tìm file sách trong Thư viện ---------- */
  function entries() {
    if (!window.PsyDB) return Promise.resolve([]);
    return window.PsyDB.all().then(function (a) { return a || []; }).catch(function () { return []; });
  }
  var NAMEHINT = {
    psy: function (n) { return /^psychology([ ._(]|$)/i.test(n) && !/introduction/i.test(n); },
    nb: function (n) { return /behavioral.?neuroscience/i.test(n); },
    ls: function (n) { return /^introduction to psychology\.pdf$/i.test(n.trim()); },
    sl: function (n) { return /^introduction to psychology \(1\)/i.test(n.trim()); },
    gw: function (n) { return /gateways.to.mind.and.behavior|coon.and.mitterer/i.test(n); },
    fr: function (n) { return /general.introduction.to.psychoanalysis|freud/i.test(n); }
  };
  function findEntry(key, all) {
    var withFile = all.filter(function (b) { return b.blob; });
    var map = store("psy.bookmap") || {}, id = map[key], e = null;
    if (id) e = withFile.filter(function (b) { return b.id === id; })[0];
    if (!e) e = withFile.filter(function (b) { return b.size === P.srcInfo[key].fileSize; })[0];
    if (!e) e = withFile.filter(function (b) { return NAMEHINT[key](b.fileName || ""); })[0];
    return e || null;
  }
  function saveMap(key, id) { var m = store("psy.bookmap") || {}; m[key] = id; store("psy.bookmap", m); }
  function fileBox(key, box, done) {
    var info = P.srcInfo[key];
    box.innerHTML = '<div class="filebox"><p><strong>Chưa có file của sách này trong Thư viện.</strong> Chọn file PDF để đọc nội dung gốc ngay tại đây. File chỉ lưu trong trình duyệt của bạn.</p>' +
      '<p class="muted" style="margin:0 0 10px">Cần: ' + esc(info.full) + (info.fileSize ? ", khoảng " + (info.fileSize / 1048576).toFixed(0) + " MB" : "") + '. Số trang trong PsyAtlas lập theo đúng bản này.</p>' +
      '<div class="toolbar" style="margin:0"><label class="btn" for="rd-file-' + key + '">Chọn file PDF</label><input id="rd-file-' + key + '" type="file" accept=".pdf,application/pdf" hidden>' +
      '<select id="rd-sel-' + key + '" aria-label="Hoặc chọn từ Thư viện"><option value="">Hoặc chọn file đã có trong Thư viện…</option></select></div><p class="notice" id="rd-msg-' + key + '" role="status" hidden></p></div>';
    var msg = box.querySelector("#rd-msg-" + key), sel = box.querySelector("#rd-sel-" + key), inp = box.querySelector("input[type=file]");
    entries().then(function (all) {
      all.filter(function (b) { return b.blob && /pdf/i.test((b.fileType || "") + (b.fileName || "")); }).forEach(function (b) {
        var o = document.createElement("option"); o.value = b.id; o.textContent = b.title + " (" + (b.size / 1048576).toFixed(0) + " MB)"; sel.appendChild(o);
      });
    });
    sel.onchange = function () { if (!sel.value) return; saveMap(key, +sel.value); done(); };
    inp.onchange = function () {
      var f = inp.files && inp.files[0]; if (!f) return;
      if (!/\.pdf$/i.test(f.name) && !/pdf/i.test(f.type)) { msg.hidden = false; msg.textContent = "Chỉ đọc được file PDF."; return; }
      msg.hidden = false; msg.textContent = "Đang lưu vào Thư viện…";
      window.PsyDB.put({ title: info.full, author: "", tags: ["giáo trình"], notes: "", status: "reading", page: 0, total: 0, fileName: f.name, fileType: f.type, size: f.size, blob: f, addedAt: Date.now() })
        .then(function (id) {
          saveMap(key, id);
          if (info.fileSize && Math.abs(f.size - info.fileSize) / info.fileSize > 0.02) store("psy.sizewarn." + key, 1);
          done();
        }).catch(function (e) { msg.textContent = "Không lưu được (có thể hết dung lượng trình duyệt): " + e.message; });
    };
  }

  /* ---------- Trang đọc ---------- */
  function bookName(k) { return P.srcInfo[k].short; }
  function secLabel(k, sec) { var l = locate(k, sec); return l ? sec + " " + l.s.title : sec; }

  function xrefOf(key, sec) {
    return (P.xref || []).filter(function (g) { return g.members.some(function (m) { return m.b === key && m.sec === sec; }); });
  }
  function matrix(g, key, sec) {
    var books = [];
    g.members.forEach(function (m) { if (books.indexOf(m.b) < 0) books.push(m.b); });
    var secsBy = {};
    g.members.forEach(function (m) { (secsBy[m.b] = secsBy[m.b] || []).push(m.sec); });
    var th = books.map(function (b) { return "<th" + (b === key ? ' class="me"' : "") + ">" + esc(bookName(b)) + '<span class="sub">mục ' + esc(secsBy[b].join(", ")) + "</span></th>"; }).join("");
    var wrow = books.map(function (b) { return '<td class="n">≈ ' + (g.words[b] || 0).toLocaleString("vi-VN") + "</td>"; }).join("");
    var rows = g.kw.map(function (k) {
      return "<tr><th scope=\"row\">" + esc(k.k) + "</th>" + books.map(function (b) {
        var n = k.n[b] || 0; return '<td class="n' + (n ? "" : " z") + '">' + (n || "–") + "</td>";
      }).join("") + "</tr>";
    }).join("");
    return '<div class="xwrap"><table class="xtab"><thead><tr><th>Từ khóa (tiếng Anh)</th>' + th + "</tr></thead><tbody>" +
      '<tr class="wrow"><th scope="row">Độ dài phần tương ứng (số từ)</th>' + wrow + "</tr>" + rows + "</tbody></table></div>";
  }

  function render(view, key, sec, ctx) {
    var loc = locate(key, sec);
    if (!P.books[key] || !loc) {
      view.innerHTML = '<div class="empty">Không tìm thấy mục này trong giáo trình. <a href="#/books">Về Giáo trình</a></div>';
      return;
    }
    ctx = ctx || {};
    var info = P.srcInfo[key], r = rangeOf(loc), read = store("psy.read") || {}, rk = key + ":" + sec;
    document.title = sec + " " + loc.s.title + " · PsyAtlas";
    function nav(t, x) {
      return x ? '<a class="btn sm ghost" href="#/read/' + esc(key) + "/" + esc(x.s.sec) + '">' + t + " " + esc(x.s.sec) + "</a>" : "";
    }
    var back = ctx.lessonBack ? '<a href="' + esc(ctx.lessonBack.href) + '">← Về bài: ' + esc(ctx.lessonBack.title) + "</a>" : '<a href="#/books/' + esc(key) + "/" + esc(sec) + '">← Giáo trình</a>';
    var groups = xrefOf(key, sec);
    view.innerHTML =
      '<p class="crumb">' + back + "</p>" +
      '<div class="page-head"><h1>' + esc(sec) + " " + esc(loc.s.title) + '</h1><p class="lead">' + esc(info.short) + " · Chương " + loc.c.n + ". " + esc(loc.c.vi) + " · " + esc(pgText(key, loc, r)) + '. <span class="muted">Giấy phép ' + esc(info.license) + "</span></p></div>" +
      '<div class="toolbar rd-actions"><label class="rdchk"><input type="checkbox" id="rd-read"' + (read[rk] ? " checked" : "") + '> Đã đọc mục này</label>' + nav("← Mục trước", loc.prev) + nav("Mục sau →", loc.next) + "</div>" +
      '<div class="panel"><h2>Nội dung gốc</h2><div id="rd-main"></div></div>' +
      '<div class="panel" id="rd-x"><h2>Đối chiếu với các sách khác</h2><div id="rd-xbody"></div></div>' +
      '<div id="rd-rel"></div>';
    var cb = view.querySelector("#rd-read");
    cb.onchange = function () { var m = store("psy.read") || {}; if (cb.checked) m[rk] = 1; else delete m[rk]; store("psy.read", m); };

    /* Liên quan trong PsyAtlas */
    var ids = (ctx.secIdx && ctx.secIdx[rk]) || [];
    if (ids.length) view.querySelector("#rd-rel").innerHTML = '<div class="panel"><h2>Liên quan trong PsyAtlas</h2><p class="muted">Các mục của PsyAtlas được tóm lược từ phần này.</p>' + ctx.pills(ids) + "</div>";

    /* Đối chiếu */
    var xb = view.querySelector("#rd-xbody");
    if (!groups.length) {
      xb.innerHTML = '<p class="muted">Chưa có nhóm đối chiếu cho mục này. Các nhóm được lập cho phần lớn nội dung Giai đoạn nền tảng và đang được bổ sung.</p>';
    } else {
      xb.innerHTML = '<p class="muted">Mỗi nhóm gồm các mục cùng chủ đề ở những sách khác nhau. Bảng từ khóa đếm tự động từ chính văn bản các sách: ô gạch ngang nghĩa là phần đó không nhắc tới từ khóa. Mở từng thẻ để đọc đoạn gốc và so sánh cách trình bày.</p>' +
        groups.map(function (g, gi) {
          var cards = g.members.filter(function (m) { return !(m.b === key && m.sec === sec); }).map(function (m, mi) {
            var l = locate(m.b, m.sec), rr = rangeOf(l);
            return '<details class="xcard" data-b="' + esc(m.b) + '" data-s="' + esc(m.sec) + '"><summary><strong>' + esc(bookName(m.b)) + "</strong> · " + esc(m.sec) + " " + esc(l.s.title) + ' <span class="muted">· ' + esc(pgText(m.b, l, rr)) + "</span></summary>" +
              '<div class="xc-body"></div><p class="xc-links"><a href="#/read/' + esc(m.b) + "/" + esc(m.sec) + '">Mở trang đọc đầy đủ</a> · <a href="#/books/' + esc(m.b) + "/" + esc(m.sec) + '">Xem trong Giáo trình</a></p></details>';
          }).join("");
          return '<section class="xgroup"><h3>' + esc(g.vi) + ' <span class="en">' + esc(g.en) + "</span></h3>" + matrix(g, key, sec) + (cards ? '<div class="xcards">' + cards + "</div>" : "") + "</section>";
        }).join("");
      xb.querySelectorAll("details.xcard").forEach(function (d) {
        d.addEventListener("toggle", function () {
          if (!d.open || d.getAttribute("data-loaded")) return;
          d.setAttribute("data-loaded", "1");
          var k = d.getAttribute("data-b"), s = d.getAttribute("data-s"), body = d.querySelector(".xc-body");
          loadInto(body, k, locate(k, s));
        });
      });
    }

    /* Nội dung chính */
    loadInto(view.querySelector("#rd-main"), key, loc);
  }

  function loadInto(el, key, loc) {
    el.innerHTML = '<p class="muted">Đang tìm file sách trong Thư viện…</p>';
    entries().then(function (all) {
      var e = findEntry(key, all);
      if (!e) { fileBox(key, el, function () { loadInto(el, key, loc); }); return; }
      var warn = store("psy.sizewarn." + key) ? '<p class="notice">File này có kích thước khác bản mình dùng để lập số trang, nên số trang có thể lệch vài trang.</p>' : "";
      el.innerHTML = warn + '<div class="rd-text"></div>';
      mountText(el.querySelector(".rd-text"), key, loc, e);
    });
  }

  return { render: render, _t: { buildParas: buildParas, findHead: findHead, rangeOf: rangeOf, locate: locate, xrefOf: xrefOf } };
})();
