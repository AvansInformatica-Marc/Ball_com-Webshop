const sample = require('../samples/sample_product')

const createProduct = (zapierPlatform, bundle) => {
    const product = {
        title: bundle.inputData.title,
        description: bundle.inputData.description,
        price: parseInt(bundle.inputData.price),
        supplierId: bundle.inputData.supplierId,
        stock: bundle.inputData.stock ? parseInt(bundle.inputData.stock) : undefined,
    }

    const responsePromise = zapierPlatform.request({
        method: 'POST',
        url: "http://localhost:3100/v1/products/",
        body: JSON.stringify(product, undefined, 4)
    })

    return responsePromise.then(response => JSON.parse(response.content))
}

module.exports = {
    key: 'product',
    noun: 'Product',

    display: {
        label: 'Register Product',
        description: 'Registers a product.'
    },

    operation: {
        inputFields: [
            { key: 'name', label:'Name', required: true, type: "string" },
            { key: 'description', label:'Description', required: true, type: "text" },
            { key: 'price', label:'Price', required: true, type: "number" },
            { key: 'supplierId', label:'Supplier ID', required: true, type: "string" },
            { key: 'stock', label:'Stock', required: false, type: "integer" }
        ],
        perform: createProduct,
        sample: sample
    }
}
