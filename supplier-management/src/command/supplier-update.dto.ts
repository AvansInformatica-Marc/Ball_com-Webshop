import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SupplierUpdateDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    name?: string
}
