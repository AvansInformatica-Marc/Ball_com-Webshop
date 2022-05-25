import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { CustomerEvent } from "./customer-event.entity"

@Injectable()
export class CustomerEventService {
    constructor(
        @InjectRepository(CustomerEvent)
        private customerEventStore: Repository<CustomerEvent>
    ) {}

    findEventsForCustomer(customerId: string): Promise<CustomerEvent[]> {
        return this.customerEventStore.find({ customerId })
    }

    insert(customerEvent: CustomerEvent): Promise<CustomerEvent> {
        return this.customerEventStore.save(customerEvent)
    }
}
