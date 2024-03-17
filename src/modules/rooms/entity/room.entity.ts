import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './../../user/entity/user.entity';
import { RoomDetailEntity } from './../../rooms/detail/entity/room.detail.entity';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_name: string;

  @Column()
  type: number;

  @Column()
  user_created: number;

  @Column()
  deleted_flg: number;

  @Column({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.rooms)
  @JoinColumn({ name: 'user_created', referencedColumnName: 'id' })
  user_owner: UserEntity;

  @OneToMany(() => RoomDetailEntity, (room_detail) => room_detail.room)
  room_users: RoomDetailEntity[];
}
