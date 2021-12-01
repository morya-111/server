import { IsDefined, IsNumber } from "class-validator";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
} from "typeorm";
import { Book } from "./Book";

@Entity()
export class RentListing extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDefined({ message: "Fees is required" })
  @IsNumber()
  fees: number;

  @Column()
  @IsDefined({ message: "Deposit is required" })
  @IsNumber()
  deposit: number;

  @Column({ type: "timestamptz" })
  duration: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne((type) => Book, { nullable: true })
  @JoinColumn()
  book: Book;
}
