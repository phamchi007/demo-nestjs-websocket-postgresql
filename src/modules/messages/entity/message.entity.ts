import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './../../user/entity/user.entity';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_id: number;

  @Column()
  user_id: number;

  @Column()
  message: string;

  @Column()
  status: number;

  @Column()
  type: number;

  @Column()
  deleted_flg: number;

  @Column({ type: 'timestamptz' })
  created_at: number;

  @Column({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.message_users)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: any;
}
