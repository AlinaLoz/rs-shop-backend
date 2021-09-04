import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn({ type: 'uuid' })
  id: number;
  
  @Column()
  title: string;
  
  @Column()
  description: string;
}
