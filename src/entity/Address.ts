import { IsDefined } from "class-validator";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	BaseEntity,
	OneToOne,
	JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Address extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@IsDefined({ message: "Address is required." })
	@Column({ length: 200 })
	address: string;

	@IsDefined({ message: "City is required." })
	@Column({ length: 30 })
	city: string;

	@IsDefined({ message: "State is required." })
	@Column({ length: 30 })
	state: string;

	@IsDefined({ message: "Pincode is required." })
	@Column({ length: 6 })
	pincode: string;

	@OneToOne((type) => User, (user) => user.address, { onDelete: "CASCADE" })
	@JoinColumn()
	user: User;
}
