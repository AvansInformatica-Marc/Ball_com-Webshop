import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsUUID } from "class-validator"

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
}
