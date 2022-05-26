import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { Column, Entity } from "typeorm"
import { Event } from "./event.entity"

@Entity()
export class SupplierEvent {
    @ValidateNested()
    @ApiProperty()
    @Column(() => Event)
    event: Event = new Event()

    @Column("uuid")
    @IsUUID()
    @ApiProperty()
    supplierId: string

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    name?: string

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    address?: string

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    city?: string

    @Column({ default: true })
    @IsBoolean()
    @ApiProperty()
    isActive: boolean = true
}
