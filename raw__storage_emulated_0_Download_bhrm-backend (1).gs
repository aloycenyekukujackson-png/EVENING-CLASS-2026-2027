/* BHRM Evening Class 2026/2027 — backend (Google Apps Script)
   Inahifadhi data kwenye Google Sheet na mafaili kwenye Google Drive. */

var PIN = "Bhrm@IB2026"; // BADILISHA: password ya CR (iko hapa tu, si kwenye HTML)

/* Endesha mara moja (Run > setup) ili kutoa ruhusa na kutengeneza Sheet + Folder */
function setup() { ss_(); folder_(); Logger.log("Tayari: " + ss_().getUrl()); }

function ss_() {
  var p = PropertiesService.getScriptProperties(), id = p.getProperty("SSID");
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) {} }
  var s = SpreadsheetApp.create("BHRM Data");
  p.setProperty("SSID", s.getId());
  return s;
}
function folder_() {
  var p = PropertiesService.getScriptProperties(), id = p.getProperty("FID");
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  var f = DriveApp.createFolder("BHRM Files");
  p.setProperty("FID", f.getId());
  return f;
}
function sh_(name) {
  var s = ss_(), t = s.getSheetByName(name);
  if (!t) { t = s.insertSheet(name); t.appendRow(["id", "created", "json"]); }
  return t;
}
function list_(name) {
  var t = sh_(name), n = t.getLastRow(), out = [];
  if (n < 2) return out;
  t.getRange(2, 3, n - 1, 1).getValues().forEach(function (r) {
    try { out.push(JSON.parse(r[0])); } catch (e) {}
  });
  return out.sort(function (a, b) { return String(b.created || "").localeCompare(String(a.created || "")); });
}
function add_(name, it) {
  if (!it || !it.id) throw new Error("bad item");
  var js = JSON.stringify(it);
  if (js.length > 45000) throw new Error("too big");
  sh_(name).appendRow([it.id, it.created || new Date().toISOString(), js]);
}
function row_(name, id) {
  var t = sh_(name), n = t.getLastRow();
  if (n < 2) return 0;
  var ids = t.getRange(2, 1, n - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (ids[i][0] === id) return i + 2;
  return 0;
}
function saveFile_(f) {
  var blob = Utilities.newBlob(Utilities.base64Decode(f.data), f.mime || "application/octet-stream", f.name || "file");
  var file = folder_().createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { url: file.getUrl(), name: f.name || "file" };
}
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() { return out_({ ok: true, msg: "BHRM backend inafanya kazi" }); }

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var b = JSON.parse(e.postData.contents), a = b.action, isCR = (b.pin === PIN);
    var PUBLIC = { listMat: 1, addRuh: 1, addRes: 1 }; // wanafunzi wote
    if (!PUBLIC[a] && !isCR) return out_({ ok: false, error: "unauthorized" });

    switch (a) {
      case "auth":    return out_({ ok: true });
      case "listMat": return out_({ ok: true, items: list_("mat") });
      case "listRuh": return out_({ ok: true, items: list_("ruh") });
      case "listRes": return out_({ ok: true, items: list_("res") });

      case "addMat": {
        var it = b.item;
        if (b.file && b.file.data) { var f = saveFile_(b.file); it.url = f.url; it.fileName = f.name; }
        add_("mat", it);
        return out_({ ok: true, item: it });
      }
      case "addRuh": { var r = b.item; r.status = "pending"; add_("ruh", r); return out_({ ok: true }); }
      case "addRes": { add_("res", b.item); return out_({ ok: true }); }

      case "setStatus": {
        if (["pending", "approved", "rejected"].indexOf(b.status) < 0) return out_({ ok: false, error: "bad status" });
        var rw = row_("ruh", b.id);
        if (!rw) return out_({ ok: false, error: "not found" });
        var t = sh_("ruh"), o = JSON.parse(t.getRange(rw, 3).getValue());
        o.status = b.status;
        t.getRange(rw, 3).setValue(JSON.stringify(o));
        return out_({ ok: true });
      }
      case "delMat": {
        var rm = row_("mat", b.id);
        if (rm) sh_("mat").deleteRow(rm);
        return out_({ ok: true });
      }
    }
    return out_({ ok: false, error: "unknown action" });
  } catch (err) {
    return out_({ ok: false, error: String(err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}
