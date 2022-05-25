import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Chat } from "./Chat";
import { Participant } from "./Participant";

@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Chat, (chat) => chat.room)
  chats: Chat[];

  @OneToMany(() => Participant, (participant) => participant.room)
  participants: Participant[];

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedDate: Date;
}
