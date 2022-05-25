import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { Column, Entity } from "typeorm"
import { Event } from "./event.entity"

@Entity()
export class ProductEvent {
    @ValidateNested()
    @ApiProperty()
    @Column(() => Event)
    event: Event = new Event()

    @Column("uuid")
    @IsUUID()
    @ApiProperty()
    productId: string

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    @Column({ nullable: true })
    name?: string

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    @Column({ nullable: true })
    description?: string

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    @Column({ nullable: true, type: "double precision" })
    price?: number

    @IsUUID()
    @IsOptional()
    @ApiPropertyOptional()
    @Column({ nullable: true })
    supplierId?: string

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    @Column({ nullable: true })
    stock?: number
}
