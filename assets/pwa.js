(function () {
  var deferred = null;
  function standalone() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches)
      || window.navigator.standalone === true;
  }
  function sync() {
    var btn = document.getElementById("ht-install-btn");
    if (!btn) return;
    if (!standalone() && deferred) btn.removeAttribute("hidden");
    else btn.setAttribute("hidden", "");
  }
  window.HT_syncInstallButton = sync;
  window.HT_promptInstall = function () {
    if (!deferred) return;
    var ev = deferred;
    deferred = null;
    sync();
    ev.prompt().catch(function () {}).then(function () {
      deferred = null;
      sync();
    });
  };
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    sync();
  });
  window.addEventListener("appinstalled", function () {
    deferred = null;
    sync();
  });
  document.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest && e.target.closest("#ht-install-btn");
    if (!btn) return;
    e.preventDefault();
    window.HT_promptInstall();
  });
  if ("serviceWorker" in navigator) {
    var host = location.hostname;
    var ok = location.protocol === "https:" || host === "localhost" || host === "127.0.0.1";
    if (ok) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").catch(function () {});
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sync);
  else sync();
})();
