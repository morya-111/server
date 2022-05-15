import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Chat } from "./Chat";
import { Room } from "./Room";
import { User } from "./User";

@Entity()
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, (room) => room.participants)
  room: Room;

  @ManyToOne(() => User, (user) => user.participation)
  user: User;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedDate: Date;
}
