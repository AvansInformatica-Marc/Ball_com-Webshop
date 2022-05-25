import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID, isUUID } from "class-validator";

export class ProductCreateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string

    @IsNumber()
    @ApiProperty()
    price: number

    @IsUUID()
    @ApiProperty()
    supplierId: string

    @IsNumber()
    @ApiPropertyOptional({ default: 0 })
    stock: number = 0
}
