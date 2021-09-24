import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export class Address extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 200 })
	address: string;

	@Column({ length: 30 })
	city: string;

	@Column({ length: 30 })
	state: string;

	@Column({ length: 6 })
	pincode: string;
}
