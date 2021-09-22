import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Image } from "./Image";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 }) // by default NULLABLE: false
  name: string;

  @Column({ length: 1000, nullable: true })
  description: string;

  @Column({ length: 50 })
  language: string;

  @Column({ length: 100 })
  author: string;

  @Column({ length: 100 })
  publisher: string;

  @OneToMany((type) => Image, (image) => image.book)
  images: Image[];
}
