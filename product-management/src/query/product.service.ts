import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Product } from "./product.entity"

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ) {}

    findAll(): Promise<Product[]> {
        return this.productRepository.find()
    }

    findOne(productId: string): Promise<Product | undefined> {
        return this.productRepository.findOne(productId)
    }

    create(product: Product): Promise<Product> {
        return this.productRepository.save(product)
    }

    async update(productId: string, product: Partial<Product>): Promise<Partial<Product>> {
        product.productId = productId
        await this.productRepository.update({ productId }, product)
        return product
    }

    async delete(productId: string): Promise<void> {
        await this.productRepository.delete(productId)
    }
}
