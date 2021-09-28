import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 })
  url: string;

  @Column({ length: 300 })
  label: string;

  @ManyToOne((type) => Book, (book) => book.images)
  book: Book;
}
