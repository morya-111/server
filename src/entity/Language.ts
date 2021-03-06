import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Book } from "./Book";

@Entity()
export class Language extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ default: 0 })
  priority: number;

  @OneToMany((type) => Book, (book) => book.language)
  books: Book[];
}
