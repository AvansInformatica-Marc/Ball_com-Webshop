import { Module } from '@nestjs/common'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SupplierCommandController } from './command/api/supplier-command.controller'
import { SupplierEvent } from './command/db/supplier-event.entity'
import { SupplierEventService } from './command/db/supplier-event.service'
import { MqService } from './mq.service'
import { SupplierQueryController } from './query/supplier-query.controller'
import { Supplier } from './query/supplier.entity'
import { SupplierService } from './query/supplier.service'
import { MQ_EXCHANGE } from './app.constants'
import { EventStoreController } from './event-store.controller'

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
            connectionInitOptions: { wait: false }
        }),
        TypeOrmModule.forFeature([Supplier, SupplierEvent])
    ],
    controllers: [SupplierQueryController, SupplierCommandController, EventStoreController],
    providers: [SupplierService, SupplierEventService, MqService]
})
export class SupplierModule {}
