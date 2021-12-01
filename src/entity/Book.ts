import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Image } from "./Image";
import { Language } from "./Language";
import { User } from "./User";

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 }) // by default NULLABLE: false
  name: string;

  @Column({ length: 1000, nullable: true })
  description: string;

  @Column({ length: 50 })
  genre: string;

  @Column({ length: 100 })
  author: string;

  @Column({ length: 100 })
  publisher: string;

  @OneToMany((type) => Image, (image) => image.book)
  images: Image[];

  @ManyToOne((type) => Language, (language) => language.books, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  language: Language;

  @ManyToOne((type) => User, (user) => user.books, {
    onDelete: "CASCADE",
  })
  user: User;
}
