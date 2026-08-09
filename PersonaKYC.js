/*
 * Persona KYC Inquiry Link Extractor
 * Shadowrocket only
 *
 * 用途：
 *   拦截 Persona 创建 Inquiry 的响应，从 data.id 中提取 inq_...
 *   并生成 Hosted Flow：
 *   https://inquiry.withpersona.com/verify?inquiry-id=inq_...
 *
 * 建议匹配：
 *   ^https:\/\/withpersona\.com\/api\/internal\/verify\/v1\/inquiries(?:\?.*)?$
 *
 * 脚本类型：
 *   http-response
 *
 * 需要响应 Body：
 *   开启
 */

(function () {
  try {
    if (typeof $response === "undefined" || !$response || !$response.body) {
      $done({});
      return;
    }

    var body = $response.body;
    var inquiryId = null;

    try {
      var obj = JSON.parse(body);
      if (obj && obj.data && typeof obj.data.id === "string") {
        inquiryId = obj.data.id;
      }
    } catch (e) {}

    if (!inquiryId) {
      var match = String(body).match(/\binq_[A-Za-z0-9_-]+\b/);
      if (match) inquiryId = match[0];
    }

    if (!inquiryId || !/^inq_[A-Za-z0-9_-]+$/.test(inquiryId)) {
      $done({});
      return;
    }

    var kycUrl =
      "https://inquiry.withpersona.com/verify?inquiry-id=" +
      encodeURIComponent(inquiryId);

    if (typeof $notification !== "undefined" && $notification.post) {
      $notification.post(
        "Tuyo KYC",
        inquiryId,
        kycUrl
      );
    }

    if (typeof console !== "undefined" && console.log) {
      console.log("[Tuyo KYC] " + kycUrl);
    }

    $done({});
  } catch (err) {
    if (typeof console !== "undefined" && console.log) {
      console.log("[Tuyo KYC] Error: " + err);
    }
    $done({});
  }
})();
