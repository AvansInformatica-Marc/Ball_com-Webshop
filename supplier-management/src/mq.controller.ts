import { Controller, ValidationPipe } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { SupplierEvent } from "./command/supplier-event.entity";
import { Supplier } from "./query/supplier.entity";
import { SupplierService } from "./query/supplier.service";

@Controller()
export class MqController {
    constructor(
        private readonly supplierService: SupplierService
    ) {}

    @MessagePattern("SupplierCreated")
    async onSupplierCreated(@Payload(new ValidationPipe()) supplierEvent: SupplierEvent) {
        const supplier = new Supplier()
        supplier.id = supplierEvent.supplierId
        supplier.name = supplierEvent.name!
        supplier.isActive = supplierEvent.isActive
        await this.supplierService.create(supplier)
    }

    @MessagePattern("SupplierUpdated")
    async onSupplierUpdated(@Payload(new ValidationPipe()) supplierEvent: SupplierEvent) {
        await this.supplierService.update(supplierEvent.supplierId, { name: supplierEvent.name })
    }

    @MessagePattern("SupplierDeleted")
    async onSupplierRemoved(@Payload(new ValidationPipe()) supplierEvent: SupplierEvent) {
        await this.supplierService.update(supplierEvent.supplierId, { isActive: false })
    }
}
