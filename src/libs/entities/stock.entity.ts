import { Column, Entity, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Stock extends BaseEntity {
	@PrimaryColumn()
	productId: string;
	
	@OneToOne(() => Product, product => product.stock)
	@JoinColumn()
	product: Product;
	
	@Column()
	count: number;
	
	constructor(data: Partial<Stock>) {
		super();
		Object.assign(this, data);
	}
}
