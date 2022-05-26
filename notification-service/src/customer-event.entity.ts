import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator"
import { Event } from "./event.entity"

export class CustomerEvent {
    @ValidateNested()
    event: Event = new Event()

    @IsUUID()
    customerId: string

    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    address?: string

    @IsString()
    @IsOptional()
    city?: string

    @IsEmail()
    @IsOptional()
    email?: string

    @IsPhoneNumber()
    @IsOptional()
    phonenumber?: string

    @IsBoolean()
    isActive: boolean = true
}
