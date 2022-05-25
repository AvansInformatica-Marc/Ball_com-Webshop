import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator"

@Entity()
export class Customer {
    @IsUUID()
    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    customerId: string

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

    @IsEmail()
    @ApiProperty()
    @Column()
    email: string

    @IsPhoneNumber()
    @IsOptional()
    @ApiPropertyOptional()
    @Column({ nullable: true })
    phonenumber?: string

    @IsBoolean()
    @ApiProperty()
    @Column({ default: true })
    isActive: boolean = true
}
