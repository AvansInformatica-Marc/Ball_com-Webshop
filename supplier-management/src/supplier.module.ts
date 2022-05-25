import { Module } from '@nestjs/common'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SupplierCommandController } from './command/api/supplier-command.controller'
import { SupplierEvent } from './command/supplier-event.entity'
import { SupplierEventService } from './command/db/supplier-event.service'
import { MqService } from './mq.service'
import { SupplierQueryController } from './query/supplier-query.controller'
import { Supplier } from './query/supplier.entity'
import { SupplierService } from './query/supplier.service'

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
        TypeOrmModule.forFeature([Supplier, SupplierEvent])
    ],
    controllers: [SupplierQueryController, SupplierCommandController],
    providers: [SupplierService, SupplierEventService, MqService]
})
export class SupplierModule {}
