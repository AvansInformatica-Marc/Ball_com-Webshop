import { Controller, ValidationPipe } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { validate } from "class-validator";
import { validationOptions } from "./app.constants";
import { SupplierEvent } from "./command/supplier-event.entity";
import { Supplier } from "./query/supplier.entity";
import { SupplierService } from "./query/supplier.service";

@Controller()
export class MqController {
    constructor(
        private readonly supplierService: SupplierService
    ) {}

    @MessagePattern("SupplierCreated")
    async onSupplierCreated(@Payload(new ValidationPipe(validationOptions)) supplierEvent: SupplierEvent) {
        const supplier = new Supplier()
        Object.assign(supplier, supplierEvent)
        validate(supplier, validationOptions)
        await this.supplierService.create(supplier)
    }

    @MessagePattern("SupplierUpdated")
    async onSupplierUpdated(@Payload(new ValidationPipe(validationOptions)) supplierEvent: SupplierEvent) {
        const supplier = new Supplier()
        Object.assign(supplier, supplierEvent)
        validate(supplier, validationOptions)
        await this.supplierService.update(supplierEvent.supplierId, supplier)
    }

    @MessagePattern("SupplierDeleted")
    async onSupplierRemoved(@Payload(new ValidationPipe(validationOptions)) supplierEvent: SupplierEvent) {
        await this.supplierService.update(supplierEvent.supplierId, { isActive: false })
    }
}
