export const validationOptions = {
    transform: true,
    whitelist: true
}

export const supplierMqOptions = {
    urls: [process.env["MQ_URL"]!],
    queue: 'suppliers',
    queueOptions: {
        durable: false
    }
}
