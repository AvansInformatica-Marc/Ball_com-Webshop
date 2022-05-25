import { Module } from '@nestjs/common'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerCommandController } from './command/api/customer-command.controller'
import { CustomerEvent } from './command/db/customer-event.entity'
import { CustomerEventService } from './command/db/customer-event.service'
import { MqService } from './mq.service'
import { CustomerQueryController } from './query/customer-query.controller'
import { Customer } from './query/customer.entity'
import { CustomerService } from './query/customer.service'
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
            connectionInitOptions: {
                timeout: 10000
            }
        }),
        TypeOrmModule.forFeature([Customer, CustomerEvent])
    ],
    controllers: [CustomerQueryController, CustomerCommandController, EventStoreController],
    providers: [CustomerService, CustomerEventService, MqService]
})
export class CustomerModule {}
