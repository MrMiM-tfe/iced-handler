const slugify = require('slugify')

exports.modelsPath

const generateData = async (datas, req) => {

    let Data = {}

    for await (const data of datas) {
        if (typeof (data) == 'string') {
            Data[data] = req.body[data]
        } else if (typeof (data) == 'object') {
            const key = Object.entries(data)[0][0]
            const value = Object.entries(data)[0][1]
            if (typeof (value) == 'string') {
                Data[key] = await exptions[value](req, data.args)
            } else if (typeof (data) == 'object') {
                Data[key] = await value()
            }
        }
    }

    return Data
}

const getModel = (ModelName) => {
    if (exports.modelsPath) {
        const Models = require('../../' + exports.modelsPath)
        return Models[ModelName]
    } else {
        return ModelName
    }
}

exports.index = async (req, ModelName, query = {}) => {

    console.log(Model);

    const limit = req.query.limit || 10
    const page = req.query.page - 1 || 0

    const totalCount = await Model.countDocuments({})
    const totalPage = Math.ceil(totalCount / limit)


    try {
        const items = await Model.find(query).skip(limit * page).limit(limit)
        if (items) {
            return { page: page + 1, limit, totalCount, totalPage, items }
        } else {
            return { msg: "page is empty" }
        }
    } catch (err) {
        return { err: err.message }
    }
}

exports.postCreate = async (req, ModelName, data = []) => {
    const Model = getModel(ModelName)
    try {
        const Data = await generateData(data, req)
        const item = await Model.create(Data)
        return item
    } catch (err) {
        return { err: err.message }
    }

}

exports.getEdit = async (req, ModelName) => {
    const Model = getModel(ModelName)
    const slug = req.params.slug
    try {
        const item = Model.findOne({ slug })
        return item
    } catch (err) {
        return { err: err.message }
    }
}

exports.putEdit = async (req, ModelName, data = []) => {
    const Model = getModel(ModelName)
    const slug = req.params.slug

    try {
        const Data = await generateData(data, req)
        const item = await Model.findOneAndUpdate({ slug }, Data)
        return item
    } catch (err) {
        return { err: err.message }
    }
}

exports.delete = async (req, ModelName) => {
    const Model = getModel(ModelName)
    const slug = req.params.slug
    try {
        const item = await Model.findOneAndDelete({ slug })
        return item
    } catch (err) {
        return { err: err.message }
    }
}

// ---------------------------------------------------------------
const exptions = {}

exptions.slug = async (req, args) => {
    const slug = slugify(req.body[args[0]])
    return slug
}

exports.exptions = exptions