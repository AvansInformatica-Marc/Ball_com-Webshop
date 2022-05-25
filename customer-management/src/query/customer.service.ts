import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Customer } from "./customer.entity"

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>
    ) {}

    findOne(customerId: string): Promise<Customer | undefined> {
        return this.customerRepository.findOne(customerId)
    }

    create(customer: Customer): Promise<Customer> {
        return this.customerRepository.save(customer)
    }

    async update(customerId: string, customer: Partial<Customer>): Promise<Partial<Customer>> {
        customer.customerId = customerId
        await this.customerRepository.update({ customerId: customerId }, customer)
        return customer
    }
}
