import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Supplier } from "./supplier.entity"

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier)
        private supplierRepository: Repository<Supplier>
    ) {}

    findAll(): Promise<Supplier[]> {
        return this.supplierRepository.find({
            isActive: true
        })
    }

    findOne(id: string): Promise<Supplier | undefined> {
        return this.supplierRepository.findOne(id)
    }

    create(supplier: Supplier): Promise<Supplier> {
        return this.supplierRepository.save(supplier)
    }

    async update(id: string, supplier: Partial<Supplier>): Promise<Partial<Supplier>> {
        supplier.id = id
        await this.supplierRepository.update({ id }, supplier)
        return supplier
    }
}
