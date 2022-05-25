import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ProductEvent } from "./product-event.entity"

@Injectable()
export class ProductEventService {
    constructor(
        @InjectRepository(ProductEvent)
        private productEventStore: Repository<ProductEvent>
    ) {}

    findEventsForProduct(productId: string): Promise<ProductEvent[]> {
        return this.productEventStore.find({ productId })
    }

    insert(productEvent: ProductEvent): Promise<ProductEvent> {
        return this.productEventStore.save(productEvent)
    }
}
