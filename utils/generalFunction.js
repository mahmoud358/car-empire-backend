const getPagination = (Query) => {
    const page = parseInt(Query.page) || 1;
    const limit = parseInt(Query.limit) || 10;
    const skip = (page - 1) * limit;

  return { limit, page, skip  };
}

module.exports = {
    getPagination
}