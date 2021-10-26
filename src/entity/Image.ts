import {
  Entity,
  Column,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from "typeorm";
import { Book } from "./Book";

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 })
  url: string;

  @Column({ length: 300, nullable: true })
  label: string;

  @ManyToOne((type) => Book, (book) => book.images)
  @JoinColumn()
  book: Book;
}
