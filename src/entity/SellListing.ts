import { IsDefined, IsNumber } from "class-validator";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
} from "typeorm";
import { Book } from "./Book";

@Entity()
export class SellListing extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ message: "Price is required" })
  @IsNumber()
  @Column()
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne((type) => Book, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn()
  book: Book;
}
