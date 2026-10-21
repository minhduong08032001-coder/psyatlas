/* Lưu sách trong IndexedDB của trình duyệt (file nằm trên máy bạn, không gửi đi đâu). */
window.PsyDB = (function () {
  "use strict";
  var NAME = "psyatlas", STORE = "books", dbp = null;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise(function (resolve, reject) {
      if (!window.indexedDB) { reject(new Error("Trình duyệt không hỗ trợ IndexedDB.")); return; }
      var req = indexedDB.open(NAME, 1);
      req.onupgradeneeded = function () {
        req.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
    return dbp;
  }
  function tx(mode, fn) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var t = db.transaction(STORE, mode), s = t.objectStore(STORE), r = fn(s);
        t.oncomplete = function () { resolve(r && r.result); };
        t.onerror = function () { reject(t.error); };
        t.onabort = function () { reject(t.error || new Error("Giao dịch bị hủy (có thể hết dung lượng).")); };
      });
    });
  }
  return {
    all: function () { return tx("readonly", function (s) { return s.getAll(); }); },
    get: function (id) { return tx("readonly", function (s) { return s.get(id); }); },
    put: function (rec) { return tx("readwrite", function (s) { return s.put(rec); }); },
    del: function (id) { return tx("readwrite", function (s) { return s.delete(id); }); }
  };
})();
