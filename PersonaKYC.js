/*
 * Tuyo KYC - Sumsub WebSDK Link Extractor
 * Shadowrocket only
 *
 * 直接匹配已经实际访问的 Sumsub KYC 页面：
 * https://in.sumsub.com/websdk/p/...
 *
 * 脚本类型：http-request
 */

(function () {
  try {
    if (typeof $request === "undefined" || !$request || !$request.url) {
      $done({});
      return;
    }

    var url = String($request.url);
    var prefix = "https://in.sumsub.com/websdk/p/";

    if (url.indexOf(prefix) !== 0) {
      $done({});
      return;
    }

    // 仅接受 /websdk/p/ 后存在实际路径内容的 URL
    if (!/^https:\/\/in\.sumsub\.com\/websdk\/p\/[A-Za-z0-9_-]+(?:[?#].*)?$/.test(url)) {
      $done({});
      return;
    }

    if (typeof $notification !== "undefined" && $notification.post) {
      $notification.post("Tuyo KYC", "Sumsub KYC 链接", url);
    }

    if (typeof console !== "undefined" && console.log) {
      console.log("[Tuyo KYC] " + url);
    }

    $done({});
  } catch (err) {
    if (typeof console !== "undefined" && console.log) {
      console.log("[Tuyo KYC] Error: " + err);
    }
    $done({});
  }
})();
