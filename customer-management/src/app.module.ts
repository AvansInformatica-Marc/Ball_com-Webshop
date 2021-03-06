import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerEvent } from './command/db/customer-event.entity'
import { Customer } from './query/customer.entity'
import { CustomerModule } from './customer.module'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env["POSTGRES_HOST"],
            port: parseInt(process.env["POSTGRES_PORT"]!),
            username: process.env["POSTGRES_USER"],
            password: process.env["POSTGRES_PASSWORD"],
            database: process.env["POSTGRES_DB"],
            entities: [Customer, CustomerEvent],
            synchronize: true
        }),
        CustomerModule
    ]
})
export class AppModule {}
