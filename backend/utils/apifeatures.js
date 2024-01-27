class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query; // Product.find()
        this.queryStr = queryStr; // the value of query i.e the search query
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword, // used for search patterns
                $options: "i" // case insensitive
            }
        }:{};


        this.query = this.query.find({...keyword}); // Product.find({to_find})

        return this;
    }

    filter() {
        // did {...this.queryStr} because if we did simple 
        // this.queryStr, then it would have been passed by reference.
        const queryCopy = {...this.queryStr}

        // Removing some fields for category

        const removeFields = ["keyword", "page", "limit"]; // page is page number

        removeFields.forEach(key => {
            delete queryCopy[key];
        });

        // Filter for Price and Rating \\ price[gt] and price[lt] are for filtering

        // console.log(queryCopy) // This shows that { price: { gt: '1210', lt: '2000' } }, but to pass to mongodb, mongodb requires $ with its operators

        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`) // using regular expressions

        // console.log(queryStr) // {"price":{"$gte":"1211","$lt":"2000"}}

        this.query = this.query.find(JSON.parse(queryStr))
        return this;

    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        // console.log(currentPage) // 2

        const skip = resultPerPage * (currentPage - 1); // resultPerPage is 8

        this.query = this.query.limit(resultPerPage).skip(skip); // limit shows 8

        return this;
    }
};


module.exports = ApiFeatures;