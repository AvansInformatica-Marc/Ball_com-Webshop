import { Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, ValidationPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Customer } from './customer.entity'
import { CustomerService } from './customer.service'

@ApiTags("customer query")
@Controller({
    path: "customers",
    version: "1"
})
export class CustomerQueryController {
    constructor(private readonly customerService: CustomerService) {}

    @Get(":customerId")
    @ApiNotFoundResponse()
    @ApiOkResponse({ type: Customer })
    @ApiBadRequestResponse()
    async getCustomerById(
        @Param("customerId", new ParseUUIDPipe()) customerId: string
    ): Promise<Customer> {
        const customer = await this.customerService.findOne(customerId)

        if (customer == undefined) {
            throw new NotFoundException()
        }

        return customer
    }
}
