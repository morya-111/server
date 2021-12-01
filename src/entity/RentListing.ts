import { IsDefined, IsNumber, Length, Max, MaxLength } from "class-validator";
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

  @Column()
  @IsDefined({ message: "Duration is required" })
  @IsNumber()
  duration: number;

  @Column({ length: 10 })
  @IsDefined({ message: "Duration Unit is required" })
  @MaxLength(10)
  durationUnit: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne((type) => Book, { nullable: true })
  @JoinColumn()
  book: Book;
}
