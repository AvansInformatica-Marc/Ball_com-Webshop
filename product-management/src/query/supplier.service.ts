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
        return this.supplierRepository.find()
    }

    findOne(supplierId: string): Promise<Supplier | undefined> {
        return this.supplierRepository.findOne(supplierId)
    }

    create(supplier: Supplier): Promise<Supplier> {
        return this.supplierRepository.save(supplier)
    }

    async update(supplierId: string, supplier: Partial<Supplier>): Promise<Partial<Supplier>> {
        supplier.supplierId = supplierId
        await this.supplierRepository.update({ supplierId }, supplier)
        return supplier
    }

    async delete(supplierId: string): Promise<void> {
        await this.supplierRepository.delete(supplierId)
    }
}
