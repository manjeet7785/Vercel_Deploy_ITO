function getPaginationParams(query, defaultLimit = 50) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.max(1, Math.min(1000, parseInt(query.limit || String(defaultLimit), 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

module.exports = { getPaginationParams };
