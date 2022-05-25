import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductCommandController } from './command/api/product-command.controller'
import { ProductEventService } from './command/db/product-event.service'
import { MqService } from './mq.service'
import { ProductQueryController } from './query/api/product-query.controller'
import { Product } from './query/product.entity'
import { ProductService } from './query/db/product.service'
import { Supplier } from './query/supplier.entity'
import { SupplierService } from './query/db/supplier.service'
import { ProductEvent } from './command/db/product-event.entity'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { MQ_EXCHANGE } from './app.constants'

@Module({
    imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: MQ_EXCHANGE,
                    type: "fanout"
                }
            ],
            uri: process.env["MQ_URL"]!,
            connectionInitOptions: {
                timeout: 10000
            }
        }),
        TypeOrmModule.forFeature([Product, ProductEvent, Supplier])
    ],
    controllers: [ProductQueryController, ProductCommandController],
    providers: [ProductService, SupplierService, ProductEventService, MqService]
})
export class ProductModule {}
