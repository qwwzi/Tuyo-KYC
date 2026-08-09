#!name=Tuyo KYC
#!desc=提取Persona链接

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

    // 优先按 Persona 当前响应结构读取 data.id
    try {
      var obj = JSON.parse(body);
      if (obj && obj.data && typeof obj.data.id === "string") {
        inquiryId = obj.data.id;
      }
    } catch (e) {
      // JSON 解析失败时，后面再用正则兜底
    }

    // 兜底：直接从响应正文中寻找 inq_...
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

    // Shadowrocket 本地通知
    if (typeof $notification !== "undefined" && $notification.post) {
      $notification.post(
        "Persona KYC 链接已提取",
        inquiryId,
        kycUrl
      );
    }

    // 便于在 Shadowrocket 脚本日志中查看
    if (typeof console !== "undefined" && console.log) {
      console.log("[Persona KYC] " + kycUrl);
    }

    // 不修改原始响应
    $done({});
  } catch (err) {
    if (typeof console !== "undefined" && console.log) {
      console.log("[Persona KYC] Error: " + err);
    }
    $done({});
  }
})();
