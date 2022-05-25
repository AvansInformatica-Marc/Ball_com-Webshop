import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator"
import { Column, Entity } from "typeorm"
import { Event } from "./event.entity"

@Entity()
export class CustomerEvent {
    @ValidateNested()
    @ApiProperty()
    @Column(() => Event)
    event: Event = new Event()

    @Column("uuid")
    @IsUUID()
    @ApiProperty()
    customerId: string

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

    @IsEmail()
    @IsOptional()
    @ApiPropertyOptional()
    @Column({ nullable: true })
    email?: string

    @IsPhoneNumber()
    @IsOptional()
    @ApiPropertyOptional()
    @Column({ nullable: true })
    phonenumber?: string

    @Column({ default: true })
    @IsBoolean()
    @ApiProperty()
    isActive: boolean = true
}
