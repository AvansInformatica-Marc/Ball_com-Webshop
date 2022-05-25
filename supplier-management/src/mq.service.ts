import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { validate } from "class-validator";
import { validationOptions } from "./app.constants";
import { Event } from "./command/event.entity";
import { SupplierEvent } from "./command/supplier-event.entity";
import { Supplier } from "./query/supplier.entity";
import { SupplierService } from "./query/supplier.service";

@Injectable()
export class MqService {
    constructor(
        private readonly supplierService: SupplierService
    ) {}

    @RabbitSubscribe({
        exchange: 'ball',
        routingKey: '',
        queue: 'supplier',
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
        await this.supplierService.update(supplierEvent.supplierId, { isActive: false })
    }
}
