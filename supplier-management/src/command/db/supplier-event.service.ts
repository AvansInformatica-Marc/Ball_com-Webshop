import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { SupplierEvent } from "./supplier-event.entity"

@Injectable()
export class SupplierEventService {
    constructor(
        @InjectRepository(SupplierEvent)
        private supplierEventStore: Repository<SupplierEvent>
    ) {}

    findEventsForSupplier(id: string): Promise<SupplierEvent[]> {
        return this.supplierEventStore.find({
            supplierId: id
        })
    }

    insert(supplierEvent: SupplierEvent): Promise<SupplierEvent> {
        return this.supplierEventStore.save(supplierEvent)
    }
}
