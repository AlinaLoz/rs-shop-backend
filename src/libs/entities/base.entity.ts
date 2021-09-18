import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: string;
	
	@UpdateDateColumn({ type: 'timestamptz' } )
	updatedAt: string;
}
