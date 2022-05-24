import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsString, IsUUID } from "class-validator"

@Entity()
export class Supplier {
    @IsUUID()
    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    supplierId: string

    @IsString()
    @ApiProperty()
    @Column()
    name: string

    @IsString()
    @ApiProperty()
    @Column()
    address: string

    @IsString()
    @ApiProperty()
    @Column()
    city: string

    @IsBoolean()
    @ApiProperty()
    @Column({ default: true })
    isActive: boolean = true
}
