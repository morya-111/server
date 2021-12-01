import { IsDefined, MaxLength } from "class-validator";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Image } from "./Image";
import { Language } from "./Language";
import { RentListing } from "./RentListing";
import { SellListing } from "./SellListing";
import { User } from "./User";

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ message: "Book name is required" })
  @MaxLength(300)
  @Column({ length: 300 }) // by default NULLABLE: false
  name: string;

  @Column({ length: 1000, nullable: true })
  @MaxLength(1000)
  description: string;

  @IsDefined({ message: "Book genre is required" })
  @MaxLength(50)
  @Column({ length: 50 })
  genre: string;

  @IsDefined({ message: "Book author is required" })
  @MaxLength(100)
  @Column({ length: 100 })
  author: string;

  @IsDefined({ message: "Book publisher is required" })
  @MaxLength(100)
  @Column({ length: 100 })
  publisher: string;

  @IsDefined({ message: "Book image id is required" })
  @OneToOne(() => Image, { onDelete: "CASCADE" })
  @JoinColumn()
  image: Image;

  @IsDefined({ message: "Book language id is required" })
  @ManyToOne((type) => Language, (language) => language.books, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  language: Language;

  @IsDefined({ message: "Login user is required to create book" })
  @ManyToOne((type) => User, (user) => user.books, { onDelete: "CASCADE" })
  user: User;

  @OneToOne((type) => SellListing, (sellListing) => sellListing.book, {
    nullable: true,
  })
  sellListing: SellListing;

  @OneToOne((type) => RentListing, (rentListing) => rentListing.book, {
    nullable: true,
  })
  rentListing: RentListing;
}
