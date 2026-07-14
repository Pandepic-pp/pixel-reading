const { UAParser } = require('ua-parser-js');

function parseUserAgent(userAgent) {
  if (!userAgent) return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };

  const { browser, os, device } = new UAParser(userAgent).getResult();

  return {
    browser: browser.name ? `${browser.name} ${browser.version || ''}`.trim() : 'Unknown',
    os: os.name ? `${os.name} ${os.version || ''}`.trim() : 'Unknown',
    device: device.model || device.type || 'Desktop',
  };
}

module.exports = { parseUserAgent };
