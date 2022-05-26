import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CustomerCreateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    city: string

    @IsEmail()
    @ApiProperty()
    email: string

    @IsPhoneNumber()
    @IsOptional()
    @ApiPropertyOptional()
    phonenumber?: string
}
