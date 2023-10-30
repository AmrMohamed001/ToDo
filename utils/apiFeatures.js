class features {
  constructor(query, queryString) {
    this.query = query; //model.find()
    this.queryString = queryString; //req.query
    this.firstPage = 1;
    this.skip = undefined;
  }

  filter() {
    let copy = { ...this.queryString };
    const exclude = ["sort", "limit", "fields", "page"];
    exclude.forEach((ele) => delete copy[ele]);
    let advQ = JSON.stringify(copy);
    advQ = advQ.replace(/\b(lt|lte|gt|gte)\b/g, (ele) => `$${ele}`);
    this.query.find(JSON.parse(advQ));
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query.sort(sortBy);
    } else this.query.sort("-createdAt");
    return this;
  }

  pagination() {
    if (this.queryString.page) {
      const limit = this.queryString.limit * 1 || 5;
      const page = this.queryString.page * 1;
      this.skip = (page - 1) * limit;
      this.query.skip(this.skip).limit(limit);
    }
    this.query.limit(5);
    return this;
  }

  projection() {
    if (this.queryString.fields) {
      const selection = this.queryString.fields.split(",").join(" ");
      this.query.select(selection);
    } else this.query.select("-__v");
    return this;
  }
}

module.exports = features;
