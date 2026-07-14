const { toIST } = require('./time');

function summarize(db) {
  return Object.entries(db)
    .map(([id, record]) => {
      const opens = (record.opens || []).slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const openCount = opens.length;
      const lastOpen = openCount ? opens[openCount - 1] : null;

      return {
        id,
        to: record.to || null,
        subject: record.subject || null,
        sentAt: record.sentAt || null,
        sentAtIST: record.sentAt ? toIST(record.sentAt) : null,
        opened: openCount > 0,
        openCount,
        lastOpenedAtIST: lastOpen ? toIST(lastOpen.timestamp) : null,
        opens: opens.map((o) => ({
          timestampIST: toIST(o.timestamp),
          ip: o.ip || null,
          browser: o.browser || null,
          os: o.os || null,
          device: o.device || null,
        })),
      };
    })
    .sort((a, b) => new Date(b.sentAt || 0) - new Date(a.sentAt || 0));
}

module.exports = { summarize };
