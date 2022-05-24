import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SupplierCommandController } from './command/supplier-command.controller'
import { SupplierEvent } from './command/supplier-event.entity'
import { SupplierEventService } from './command/supplier-event.service'
import { MqController } from './mq.controller'
import { SupplierQueryController } from './query/supplier-query.controller'
import { Supplier } from './query/supplier.entity'
import { SupplierService } from './query/supplier.service'

@Module({
    imports: [
        ClientsModule.register([
            {
                name: "SUPPLIER_SERVICE",
                transport: Transport.RMQ,
                options: {
                    urls: [process.env["MQ_URL"]!],
                    queue: 'suppliers',
                    queueOptions: {
                        durable: false
                    }
                },
            }
        ]),
        TypeOrmModule.forFeature([Supplier, SupplierEvent])
    ],
    controllers: [SupplierQueryController, SupplierCommandController, MqController],
    providers: [SupplierService, SupplierEventService]
})
export class SupplierModule {}
