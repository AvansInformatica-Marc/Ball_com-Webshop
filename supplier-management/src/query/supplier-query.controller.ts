import { Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, ValidationPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Supplier } from './supplier.entity'
import { SupplierService } from './supplier.service'

@ApiTags("supplier query")
@Controller({
    path: "suppliers",
    version: "1"
})
export class SupplierQueryController {
    constructor(private readonly supplierService: SupplierService) {}

    @Get()
    @ApiOkResponse({ type: [Supplier] })
    getAllSuppliers(): Promise<Supplier[]> {
        return this.supplierService.findAll()
    }

    @Get(":supplierId")
    @ApiNotFoundResponse()
    @ApiOkResponse({ type: Supplier })
    @ApiBadRequestResponse()
    async getSupplierById(
        @Param("supplierId", new ParseUUIDPipe()) supplierId: string
    ): Promise<Supplier> {
        const supplier = await this.supplierService.findOne(supplierId)

        if (supplier == undefined) {
            throw new NotFoundException()
        }

        return supplier
    }
}
