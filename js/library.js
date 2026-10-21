/* Thư viện sách: tải lên, ghi chú, theo dõi tiến độ. Dữ liệu ở IndexedDB trên máy bạn. */
window.PsyLibrary = (function () {
  "use strict";
  var U = window.PsyUtil, esc = U.esc, norm = U.norm;
  var STATUS = { want: "Muốn đọc", reading: "Đang đọc", done: "Đã đọc" };
  var SUGGEST = [
    { title: "Psychology 2e", author: "OpenStax", tags: ["nhập môn", "giáo trình"], note: "Xương sống nhập môn, tải miễn phí tại openstax.org." },
    { title: "Introduction to Behavioral Neuroscience", author: "OpenStax", tags: ["thần kinh"], note: "Đào sâu chọn lọc phần sinh học của hành vi." },
    { title: "Abnormal Psychology", author: "Ronald Comer & Jonathan Comer", tags: ["tâm bệnh học"], note: "Dùng với DSM-5-TR để kiểm chứng tiêu chuẩn." },
    { title: "Development Through the Lifespan", author: "Laura Berk", tags: ["phát triển"], note: "" },
    { title: "Theory and Practice of Counseling and Psychotherapy", author: "Gerald Corey", tags: ["trị liệu"], note: "" }
  ];
  var state = { q: "", status: "", tag: "" };
  var root, books = [];

  function fmtSize(n) {
    if (!n) return "";
    return n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB";
  }
  function parseTags(s) { return String(s || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean); }
  function titleFromName(n) { return n.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").trim(); }

  function load() {
    return window.PsyDB.all().then(function (r) { books = r || []; });
  }
  function toast(msg) {
    var n = document.getElementById("lib-msg");
    if (n) { n.textContent = msg; n.hidden = false; setTimeout(function () { n.hidden = true; }, 5000); }
  }

  function render(view) {
    root = view;
    root.innerHTML =
      '<div class="page-head"><h1>Thư viện</h1><p class="lead">Sách và tài liệu của riêng bạn. File lưu ngay trong trình duyệt trên máy này, không tải lên máy chủ nào.</p></div>' +
      '<div class="dropzone" id="drop"><p style="margin:0 0 10px">Kéo thả file PDF, EPUB, TXT, MD, DOCX vào đây, hoặc</p>' +
      '<div class="toolbar" style="justify-content:center;margin:0"><label class="btn" for="file">Chọn file từ máy</label>' +
      '<input id="file" type="file" multiple accept=".pdf,.epub,.txt,.md,.docx,.doc,.mobi,.azw3" hidden>' +
      '<button class="btn ghost" id="add-nofile" type="button">Thêm sách không có file</button></div></div>' +
      '<p class="notice" id="lib-msg" role="status" hidden></p>' +
      '<div class="toolbar"><div class="field" style="margin:0;flex:1;min-width:200px"><input id="lq" type="search" placeholder="Lọc theo tên, tác giả, thẻ, ghi chú" aria-label="Lọc thư viện"></div>' +
      '<div class="chips" id="lchips" style="margin:0"></div></div>' +
      '<div class="grid" id="lgrid"></div>' +
      '<div class="panel" style="margin-top:24px"><h2>Gợi ý từ lộ trình của bạn</h2><p class="muted">Bấm để thêm vào thư viện như một mục chưa có file. Sau đó có thể đính file khi bạn có.</p><div id="sugg" class="pillrow"></div></div>' +
      '<div class="panel"><h2>Lưu trữ và sao lưu</h2><p id="quota" class="muted"></p>' +
      '<p class="notice">Dữ liệu nằm trong trình duyệt này. Xóa dữ liệu trình duyệt hoặc đổi máy sẽ mất. Hãy giữ bản gốc của sách ở nơi khác và xuất danh sách định kỳ.</p>' +
      '<div class="toolbar"><button class="btn ghost sm" id="export" type="button">Xuất danh sách (JSON, không kèm file)</button></div></div>' +
      '<dialog id="dlg"></dialog>';

    var drop = document.getElementById("drop"), file = document.getElementById("file");
    file.addEventListener("change", function () { addFiles(file.files); file.value = ""; });
    ["dragenter", "dragover"].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
    drop.addEventListener("drop", function (e) { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
    document.getElementById("add-nofile").addEventListener("click", function () { editDialog(null); });
    document.getElementById("lq").addEventListener("input", function (e) { state.q = e.target.value; draw(); });
    document.getElementById("export").addEventListener("click", exportList);

    document.getElementById("sugg").innerHTML = SUGGEST.map(function (s, i) {
      return '<button class="pill" type="button" data-i="' + i + '">+ ' + esc(s.title) + "</button>";
    }).join("");
    document.getElementById("sugg").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var s = SUGGEST[+b.getAttribute("data-i")];
      saveNew({ title: s.title, author: s.author, tags: s.tags, notes: s.note, status: "want" }).then(function () { toast("Đã thêm: " + s.title); });
    });
    document.getElementById("lgrid").addEventListener("click", onGridClick);
    document.getElementById("lchips").addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      var k = b.getAttribute("data-k"), v = b.getAttribute("data-v");
      state[k] = state[k] === v ? "" : v; draw();
    });

    quota();
    load().then(draw).catch(function (err) {
      document.getElementById("lgrid").innerHTML = '<div class="empty">Không mở được kho lưu trữ: ' + esc(err.message) + "</div>";
    });
  }

  function quota() {
    var n = document.getElementById("quota"); if (!n) return;
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(function (e) {
        n.textContent = "Đã dùng khoảng " + fmtSize(e.usage) + " trên " + fmtSize(e.quota) + " dung lượng trình duyệt cho phép.";
      });
      if (navigator.storage.persist) navigator.storage.persist();
    } else n.textContent = "";
  }

  function draw() {
    var grid = document.getElementById("lgrid"); if (!grid) return;
    var tags = {};
    books.forEach(function (b) { (b.tags || []).forEach(function (t) { tags[t] = 1; }); });
    var ch = Object.keys(STATUS).map(function (k) {
      return '<button class="chip" type="button" data-k="status" data-v="' + k + '" aria-pressed="' + (state.status === k) + '">' + STATUS[k] + "</button>";
    }).join("") + Object.keys(tags).sort().map(function (t) {
      return '<button class="chip" type="button" data-k="tag" data-v="' + esc(t) + '" aria-pressed="' + (state.tag === t) + '">#' + esc(t) + "</button>";
    }).join("");
    document.getElementById("lchips").innerHTML = ch;

    var q = norm(state.q);
    var shown = books.filter(function (b) {
      if (state.status && b.status !== state.status) return false;
      if (state.tag && (b.tags || []).indexOf(state.tag) < 0) return false;
      if (q && norm([b.title, b.author, (b.tags || []).join(" "), b.notes].join(" ")).indexOf(q) < 0) return false;
      return true;
    }).sort(function (a, b) { return (b.addedAt || 0) - (a.addedAt || 0); });

    if (!books.length) { grid.innerHTML = '<div class="empty" style="grid-column:1/-1">Thư viện đang trống. Kéo file vào khung phía trên hoặc thêm từ gợi ý bên dưới.</div>'; return; }
    if (!shown.length) { grid.innerHTML = '<div class="empty" style="grid-column:1/-1">Không có sách khớp bộ lọc.</div>'; return; }

    grid.innerHTML = shown.map(function (b) {
      var pct = b.total ? Math.min(100, Math.round((b.page || 0) / b.total * 100)) : (b.status === "done" ? 100 : 0);
      return '<article class="book" data-id="' + b.id + '"><div><h3>' + esc(b.title) + '</h3><div class="muted" style="font-size:.88rem">' + esc(b.author || "Chưa rõ tác giả") + "</div></div>" +
        '<div><span class="tag">' + STATUS[b.status || "want"] + "</span>" + (b.tags || []).map(function (t) { return '<span class="tag">#' + esc(t) + "</span>"; }).join("") + "</div>" +
        '<div class="progress" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100" aria-label="Tiến độ đọc"><div style="width:' + pct + '%"></div></div>' +
        '<div class="muted" style="font-size:.8rem">' + (b.total ? "Trang " + (b.page || 0) + "/" + b.total + " · " : "") + (b.blob ? esc(b.fileName || "") + " · " + fmtSize(b.size) : "Chưa đính file") + "</div>" +
        (b.notes ? '<p class="muted" style="font-size:.88rem;margin:0">' + esc(b.notes) + "</p>" : "") +
        '<div class="actions">' + (b.blob ? '<button class="btn sm" data-a="open" type="button">Mở</button>' : "") +
        '<button class="btn sm ghost" data-a="edit" type="button">Sửa</button><button class="btn sm danger" data-a="del" type="button">Xóa</button></div></article>';
    }).join("");
  }

  function onGridClick(e) {
    var btn = e.target.closest("button[data-a]"); if (!btn) return;
    var id = +btn.closest(".book").getAttribute("data-id");
    var b = books.filter(function (x) { return x.id === id; })[0]; if (!b) return;
    var a = btn.getAttribute("data-a");
    if (a === "open") openBook(b);
    else if (a === "edit") editDialog(b);
    else if (a === "del") {
      if (confirm("Xóa \"" + b.title + "\" khỏi thư viện? File lưu trong trình duyệt cũng bị xóa.")) {
        window.PsyDB.del(id).then(load).then(draw).then(quota);
      }
    }
  }

  function openBook(b) {
    var url = URL.createObjectURL(b.blob);
    var viewable = /pdf|text|plain|markdown/.test(b.fileType || "") || /\.(pdf|txt|md)$/i.test(b.fileName || "");
    if (viewable) { window.open(url, "_blank", "noopener"); }
    else {
      var a = document.createElement("a"); a.href = url; a.download = b.fileName || b.title; document.body.appendChild(a); a.click(); a.remove();
      toast("Định dạng này trình duyệt không tự mở được nên file được tải về máy.");
    }
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  }

  function saveNew(partial) {
    var rec = Object.assign({ author: "", tags: [], notes: "", status: "want", page: 0, total: 0, addedAt: Date.now() }, partial);
    return window.PsyDB.put(rec).then(load).then(draw).then(quota).catch(function (err) { toast("Không lưu được: " + err.message); });
  }

  function addFiles(list) {
    var arr = Array.prototype.slice.call(list || []);
    if (!arr.length) return;
    var ok = /\.(pdf|epub|txt|md|docx|doc|mobi|azw3)$/i;
    var good = arr.filter(function (f) { return ok.test(f.name); });
    var bad = arr.length - good.length;
    var chain = Promise.resolve();
    good.forEach(function (f) {
      chain = chain.then(function () {
        return window.PsyDB.put({
          title: titleFromName(f.name), author: "", tags: [], notes: "", status: "want", page: 0, total: 0,
          fileName: f.name, fileType: f.type, size: f.size, blob: f, addedAt: Date.now()
        });
      });
    });
    chain.then(load).then(draw).then(quota).then(function () {
      toast("Đã thêm " + good.length + " file." + (bad ? " Bỏ qua " + bad + " file có định dạng không hỗ trợ." : ""));
    }).catch(function (err) { toast("Không lưu được (có thể hết dung lượng): " + err.message); });
  }

  function editDialog(b) {
    var d = document.getElementById("dlg"), isNew = !b;
    b = b || { title: "", author: "", tags: [], status: "want", page: 0, total: 0, notes: "" };
    d.innerHTML = '<form method="dialog" id="bf"><h2>' + (isNew ? "Thêm sách" : "Sửa thông tin") + "</h2>" +
      '<div class="field"><label for="f-title">Tên sách</label><input id="f-title" required value="' + esc(b.title) + '"></div>' +
      '<div class="field"><label for="f-author">Tác giả</label><input id="f-author" value="' + esc(b.author) + '"></div>' +
      '<div class="field"><label for="f-tags">Thẻ (cách nhau bằng dấu phẩy)</label><input id="f-tags" value="' + esc((b.tags || []).join(", ")) + '"></div>' +
      '<div class="field"><label for="f-status">Trạng thái</label><select id="f-status">' + Object.keys(STATUS).map(function (k) { return '<option value="' + k + '"' + (b.status === k ? " selected" : "") + ">" + STATUS[k] + "</option>"; }).join("") + "</select></div>" +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label for="f-page">Đang ở trang</label><input id="f-page" type="number" min="0" value="' + (b.page || 0) + '"></div>' +
      '<div class="field"><label for="f-total">Tổng số trang</label><input id="f-total" type="number" min="0" value="' + (b.total || 0) + '"></div></div>' +
      '<div class="field"><label for="f-notes">Ghi chú</label><textarea id="f-notes" rows="4">' + esc(b.notes) + "</textarea></div>" +
      '<div class="toolbar" style="justify-content:flex-end;margin:0"><button class="btn ghost" value="cancel" formnovalidate>Hủy</button><button class="btn" value="ok">Lưu</button></div></form>';
    d.showModal();
    d.querySelector("#bf").addEventListener("submit", function (ev) {
      if (ev.submitter && ev.submitter.value !== "ok") return;
      var rec = Object.assign({}, b, {
        title: d.querySelector("#f-title").value.trim() || "Chưa đặt tên",
        author: d.querySelector("#f-author").value.trim(),
        tags: parseTags(d.querySelector("#f-tags").value),
        status: d.querySelector("#f-status").value,
        page: +d.querySelector("#f-page").value || 0,
        total: +d.querySelector("#f-total").value || 0,
        notes: d.querySelector("#f-notes").value.trim()
      });
      if (!rec.addedAt) rec.addedAt = Date.now();
      window.PsyDB.put(rec).then(load).then(draw).catch(function (err) { toast("Không lưu được: " + err.message); });
    });
  }

  function exportList() {
    var out = books.map(function (b) {
      return { title: b.title, author: b.author, tags: b.tags, status: b.status, page: b.page, total: b.total, notes: b.notes, fileName: b.fileName || null };
    });
    var blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "psyatlas-thu-vien.json";
    document.body.appendChild(a); a.click(); a.remove();
  }

  return { render: render };
})();
