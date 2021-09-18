import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Stock } from './stock.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  title: string;
  
  @Column({ nullable: true })
  description: string;
  
  @Column()
  price: number;
  
  @OneToOne(() => Stock, stock => stock.product)
  stock: Stock;
  
  constructor(data: Partial<Product>) {
    super();
    Object.assign(this, data);
  }
}
