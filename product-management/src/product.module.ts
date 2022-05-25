import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductCommandController } from './command/product-command.controller'
import { ProductEventService } from './command/product-event.service'
import { MqService } from './mq.service'
import { ProductQueryController } from './query/product-query.controller'
import { Product } from './query/product.entity'
import { ProductService } from './query/product.service'
import { Supplier } from './query/supplier.entity'
import { SupplierService } from './query/supplier.service'
import { ProductEvent } from './command/product-event.entity'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'

@Module({
    imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: "ball",
                    type: "fanout"
                }
            ],
            uri: process.env["MQ_URL"]!
        }),
        TypeOrmModule.forFeature([Product, ProductEvent, Supplier])
    ],
    controllers: [ProductQueryController, ProductCommandController],
    providers: [ProductService, SupplierService, ProductEventService, MqService]
})
export class ProductModule {}
