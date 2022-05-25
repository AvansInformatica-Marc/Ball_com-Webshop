import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SupplierEvent } from './command/db/supplier-event.entity'
import { Supplier } from './query/supplier.entity'
import { SupplierModule } from './supplier.module'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env["POSTGRES_HOST"],
            port: parseInt(process.env["POSTGRES_PORT"]!),
            username: process.env["POSTGRES_USER"],
            password: process.env["POSTGRES_PASSWORD"],
            database: process.env["POSTGRES_DB"],
            entities: [Supplier, SupplierEvent],
            synchronize: true
        }),
        SupplierModule
    ]
})
export class AppModule {}
