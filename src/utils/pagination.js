const { getConfig } = require("../config");

function parsePagination(q) {
  const { pagination } = getConfig();
  const def = pagination?.defaultPageSize ?? 20;
  const max = pagination?.maxPageSize ?? 100;
  const page = Math.max(1, parseInt(q.page, 10) || 1);
  let pageSize = parseInt(q.pageSize, 10) || def;
  pageSize = Math.max(1, Math.min(pageSize, max));
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  return { page, pageSize, skip, take };
}

module.exports = { parsePagination };
