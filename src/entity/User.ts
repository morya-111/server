import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	BaseEntity,
} from "typeorm";
import { Address } from "./Address";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 30 })
	first_name: string;

	@Column({ length: 30 })
	last_name: string;

	@Column({ length: 200, unique: true })
	email: string;

	@Column({ length: 20 }) // This can be later set to enum when all roles are finalized
	role: string;

	@Column({ length: 50 })
	google_id: string;

	@Column({ length: 50 })
	twitter_id: string;

	@OneToOne(() => Address, { nullable: true })
	@JoinColumn()
	address: Address;
}
