/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
//window.SITE_CONFIG['baseUrl'] = 'http://192.168.10.5:8040/lifepay-mgr';
window.SITE_CONFIG['baseUrl'] = 'http://192.168.10.115:8211/health-qr-admin';
//window.SITE_CONFIG['baseUrl'] = 'http://192.168.10.85:8211/health-qr-admin';
//window.SITE_CONFIG['baseUrl'] = 'http://192.168.10.101:8040/lifepay-mgr';
//window.SITE_CONFIG['baseUrl'] = 'http://192.168.10.139:8040/lifepay-mgr';
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();
