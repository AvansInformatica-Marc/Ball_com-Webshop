import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from "class-validator"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class SupplierEvent {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    @ApiProperty()
    eventId: string

    @Column()
    @IsString()
    @ApiProperty()
    eventName: string

    @Column("uuid")
    @IsUUID()
    @ApiProperty()
    supplierId: string

    @CreateDateColumn({
        type: 'timestamp',
        precision: 3
    })
    @IsDateString()
    @ApiProperty()
    eventDate: Date

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    name?: string

    @Column({ default: true })
    @IsBoolean()
    @ApiProperty()
    isActive: boolean = true
}
