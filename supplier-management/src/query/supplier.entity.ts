import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsString, IsUUID } from "class-validator"

@Entity()
export class Supplier {
    @IsUUID()
    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    id: string

    @IsString()
    @ApiProperty()
    @Column()
    name: string

    @IsBoolean()
    @ApiProperty()
    @Column({ default: true })
    isActive: boolean = true
}
