import { hashSync } from "bcryptjs";
import { Length } from "class-validator";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	BaseEntity,
	OneToOne,
	JoinColumn,
	BeforeInsert,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Auth extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	@Length(8)
	password: string;

	@Column({ length: 50, nullable: true })
	google_id: string;

	@Column({ length: 50, nullable: true })
	facebook_id: string;

	@OneToOne((type) => User, (user) => user.auth, { onDelete: "CASCADE" })
	@JoinColumn()
	user: User;

	@BeforeInsert()
	hashPassword() {
		if (this.password) this.password = hashSync(this.password, 12);
	}
}
