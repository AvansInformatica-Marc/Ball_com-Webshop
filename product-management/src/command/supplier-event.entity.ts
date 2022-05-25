import { IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { Event } from "./event.entity"

export class SupplierEvent {
    @ValidateNested()
    event: Event = new Event()

    @IsUUID()
    supplierId: string

    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    address?: string

    @IsString()
    @IsOptional()
    city?: string

    @IsBoolean()
    isActive: boolean = true
}
