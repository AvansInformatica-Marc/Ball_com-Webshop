import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { validate } from "class-validator";
import { constructFromObjects, MQ_EXCHANGE, MQ_ROUTING_KEY, validationOptions } from "./app.constants";
import { Event } from "./command/db/event.entity";
import { ProductEvent } from "./command/db/product-event.entity";
import { SupplierEvent } from "./command/db/supplier-event.entity";
import { Product } from "./query/product.entity";
import { ProductService } from "./query/db/product.service";
import { Supplier } from "./query/supplier.entity";
import { SupplierService } from "./query/db/supplier.service";

@Injectable()
export class MqService {
    constructor(
        private readonly supplierService: SupplierService,
        private readonly productService: ProductService
    ) {}

    @RabbitSubscribe({
        exchange: MQ_EXCHANGE,
        routingKey: MQ_ROUTING_KEY,
        queue: 'product',
    })
    async onMessage(message: { event: Event, [key: string]: any }) {
        switch (message.event.eventName) {
            case "SupplierCreated": {
                await this.onSupplierCreated(this.createSupplierEventFromMessage(message))
                break
            }
            case "SupplierUpdated": {
                await this.onSupplierUpdated(this.createSupplierEventFromMessage(message))
                break
            }
            case "SupplierDeleted": {
                await this.onSupplierRemoved(this.createSupplierEventFromMessage(message))
                break
            }
            case "ProductCreated": {
                await this.onProductCreated(this.createProductEventFromMessage(message))
                break
            }
            case "ProductUpdated": {
                await this.onProductUpdated(this.createProductEventFromMessage(message))
                break
            }
            case "ProductDeleted": {
                await this.onProductRemoved(this.createProductEventFromMessage(message))
                break
            }
        }
    }

    private createSupplierEventFromMessage(message: { [key: string]: any }): SupplierEvent {
        return constructFromObjects(SupplierEvent, message)
    }

    private createProductEventFromMessage(message: { [key: string]: any }): ProductEvent {
        return constructFromObjects(ProductEvent, message)
    }

    async onSupplierCreated(supplierEvent: SupplierEvent) {
        const supplier = constructFromObjects(Supplier, supplierEvent)
        await this.supplierService.create(supplier)
    }

    async onSupplierUpdated(supplierEvent: SupplierEvent) {
        const supplier = constructFromObjects(Supplier, supplierEvent)
        await this.supplierService.update(supplierEvent.supplierId, supplier)
    }

    async onSupplierRemoved(supplierEvent: SupplierEvent) {
        await this.productService.deleteAllFromSupplier(supplierEvent.supplierId)
        await this.supplierService.delete(supplierEvent.supplierId)
    }

    async onProductCreated(productEvent: ProductEvent) {
        const supplier = await this.supplierService.findOne(productEvent.supplierId!)
        const product = constructFromObjects(Product, productEvent, { supplier })
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
