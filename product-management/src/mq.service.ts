import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { validate } from "class-validator";
import { validationOptions } from "./app.constants";
import { Event } from "./command/event.entity";
import { ProductEvent } from "./command/product-event.entity";
import { SupplierEvent } from "./command/supplier-event.entity";
import { Product } from "./query/product.entity";
import { ProductService } from "./query/product.service";
import { Supplier } from "./query/supplier.entity";
import { SupplierService } from "./query/supplier.service";

@Injectable()
export class MqService {
    constructor(
        private readonly supplierService: SupplierService,
        private readonly productService: ProductService
    ) {}

    @RabbitSubscribe({
        exchange: 'ball',
        routingKey: '',
        queue: 'product',
    })
    async onMessage(message: { event: Event, [key: string]: any }) {
        switch (message.event.eventName) {
            case "SupplierCreated": {
                const event = new SupplierEvent()
                Object.assign(event, message)
                validate(event, validationOptions)
                await this.onSupplierCreated(event)
                break
            }
            case "SupplierUpdated": {
                const event = new SupplierEvent()
                Object.assign(event, message)
                validate(event, validationOptions)
                await this.onSupplierUpdated(event)
                break
            }
            case "SupplierDeleted": {
                const event = new SupplierEvent()
                Object.assign(event, message)
                validate(event, validationOptions)
                await this.onSupplierRemoved(event)
                break
            }
            case "ProductCreated": {
                const event = new ProductEvent()
                Object.assign(event, message)
                validate(event, validationOptions)
                await this.onProductCreated(event)
                break
            }
            case "ProductUpdated": {
                const event = new ProductEvent()
                Object.assign(event, message)
                validate(event, validationOptions)
                await this.onProductUpdated(event)
                break
            }
            case "ProductDeleted": {
                const event = new ProductEvent()
                Object.assign(event, message)
                validate(event, validationOptions)
                await this.onProductRemoved(event)
                break
            }
        }
    }

    async onSupplierCreated(supplierEvent: SupplierEvent) {
        const supplier = new Supplier()
        Object.assign(supplier, supplierEvent)
        validate(supplier, validationOptions)
        await this.supplierService.create(supplier)
    }

    async onSupplierUpdated(supplierEvent: SupplierEvent) {
        const supplier = new Supplier()
        Object.assign(supplier, supplierEvent)
        validate(supplier, validationOptions)
        await this.supplierService.update(supplierEvent.supplierId, supplier)
    }

    async onSupplierRemoved(supplierEvent: SupplierEvent) {
        await this.supplierService.delete(supplierEvent.supplierId)
    }

    async onProductCreated(productEvent: ProductEvent) {
        const product = new Product()
        const supplier = await this.supplierService.findOne(productEvent.supplierId!)
        Object.assign(product, productEvent, { supplier })
        validate(product, validationOptions)
        await this.productService.create(product)
    }

    async onProductUpdated(productEvent: ProductEvent) {
        const product = (await this.productService.findOne(productEvent.productId))!
        this.copyKnownProperties(productEvent, product)
        validate(product, validationOptions)
        await this.productService.update(productEvent.productId, product)
    }

    private copyKnownProperties(sourceObject: { [key: string]: any }, destinationObject: { [key: string]: any }) {
        for (const key in sourceObject) {
            if (key in destinationObject && sourceObject[key] != undefined) {
                destinationObject[key] = sourceObject[key]
            }
        }
    }

    async onProductRemoved(productEvent: ProductEvent) {
        await this.onProductUpdated(productEvent)
    }
}
