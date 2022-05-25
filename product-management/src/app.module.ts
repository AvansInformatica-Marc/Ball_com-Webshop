import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Supplier } from './query/supplier.entity'
import { ProductModule } from './product.module'
import { Product } from './query/product.entity'
import { ProductEvent } from './command/product-event.entity'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env["POSTGRES_HOST"],
            port: parseInt(process.env["POSTGRES_PORT"]!),
            username: process.env["POSTGRES_USER"],
            password: process.env["POSTGRES_PASSWORD"],
            database: process.env["POSTGRES_DB"],
            entities: [Product, ProductEvent, Supplier],
            synchronize: true
        }),
        ProductModule
    ]
})
export class AppModule {}
