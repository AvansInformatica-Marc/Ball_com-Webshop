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
    async getNotifications(@Payload(new ValidationPipe()) supplierEvent: SupplierEvent) {
        const supplier = new Supplier()
        supplier.id = supplierEvent.supplierId
        supplier.name = supplierEvent.name
        supplier.isActive = supplierEvent.isActive
        await this.supplierService.create(supplier)
    }
}
