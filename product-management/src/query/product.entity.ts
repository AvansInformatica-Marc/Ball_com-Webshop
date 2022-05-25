import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, IsUUID, ValidateNested } from "class-validator"
import { Supplier } from "./supplier.entity"

@Entity()
export class Product {
    @IsUUID()
    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    productId: string

    @IsString()
    @ApiProperty()
    @Column()
    name: string

    @IsString()
    @ApiProperty()
    @Column()
    description: string

    @IsNumber()
    @ApiProperty()
    @Column("double precision")
    price: number

    @ValidateNested()
    @ApiProperty()
    @ManyToOne(() => Supplier, { eager: true })
    supplier: Supplier

    @IsNumber()
    @ApiProperty()
    @Column()
    stock: number
}
