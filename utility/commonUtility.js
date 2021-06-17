class APIFeatures {
  constructor(model, queryObj) {
    this.model = model; // Art
    this.queryObj = queryObj; //req.query
    this.query = null; //query that we will chain methods
  }

  filter() {
    //filtering
    var { sort, page, fields, limit, ...resQueries } = this.queryObj;
    var queryStr = JSON.stringify(resQueries);
    var modifiedQuery = queryStr.replace(
      /\b(gt|lt|gte|lte|in)\b/g,
      (match) => `$${match}`
    );
    var queryObj = JSON.parse(modifiedQuery);
    this.query = this.model.find(queryObj);
    return this;
  }
  sort() {
    //sorting
    var { sort } = this.queryObj;
    if (sort) {
      sort = sort.split(",").join(" ");
      this.query = this.query.sort(sort);
    } else {
      this.query = this.query.sort("createdAt"); // default sort condition
    }
    return this;
  }
  limitFields() {
    //field limiting
    var { fields } = this.queryObj;
    if (fields) {
      fields = fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    //pagination
    var { page, limit } = this.queryObj;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 2;
    var skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  get() {
    return this.query;
  }
}

module.exports = APIFeatures;
