import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Address } from "./Address";
import { Auth } from "./Auth";
import { IsDefined, IsEmail, IsOptional, IsString } from "class-validator";
import { Book } from "./Book";

const DEFAULT_AVATAR =
  process.env.DEFAULT_AVATAR || "https://i.ibb.co/svPq37Q/62c39aa27b5f.png";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ message: "First Name is required." })
  @IsString()
  @Column({ length: 30 })
  first_name: string;

  @IsDefined({ message: "Last Name is required." })
  @IsString()
  @Column({ length: 30 })
  last_name: string;

  @IsDefined({ message: "Email is required." })
  @IsEmail()
  @Column({ length: 200, unique: true })
  email: string;

  @Column({ default: DEFAULT_AVATAR })
  @IsOptional()
  @IsString()
  avatarUrl: string;

  @IsDefined()
  @IsString()
  @Column({ length: 20 }) // This can be later set to enum when all roles are finalized
  role: string;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;

  @OneToOne(() => Address, (address) => address.user)
  address: Address;

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];
}
