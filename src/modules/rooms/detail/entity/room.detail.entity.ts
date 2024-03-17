import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './../../../user/entity/user.entity';
import { RoomEntity } from './../../entity/room.entity';

@Entity('room_detail')
export class RoomDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_id: number;

  @Column()
  user_id: number;

  @Column()
  status: number;

  @ManyToOne(() => UserEntity, (user) => user.room_users)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: any;

  @ManyToOne(() => RoomEntity, (room) => room.room_users)
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: any;
}
