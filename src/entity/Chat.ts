import { IsDefined, IsString } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { Book } from "./Book";
import { Room } from "./Room";
import { User } from "./User";

export enum MessageType {
  NORMAL = "NORMAL",
  EMBEDDED = "EMBEDDED",
}

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ message: "Last Name is required." })
  @IsString()
  @Column({ length: 500 })
  message: string;

  @Column({ type: "enum", enum: MessageType, default: MessageType.NORMAL })
  type: MessageType;

  @ManyToOne(() => Book, (book) => book.chats, { nullable: true })
  book?: Book;

  @ManyToOne(() => Room, (room) => room.chats)
  room: Room;

  @ManyToOne(() => User, (user) => user.chats)
  sender: User;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedDate: Date;
}
