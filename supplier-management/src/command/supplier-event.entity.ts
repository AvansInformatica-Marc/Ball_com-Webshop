import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDate, IsDateString, IsString, IsUUID } from "class-validator"
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

    @Column()
    @IsString()
    @ApiProperty()
    name: string

    @Column({ default: true })
    @IsBoolean()
    @ApiProperty()
    isActive: boolean = true
}
