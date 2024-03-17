import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoomEntity } from './../../rooms/entity/room.entity';
import { RoomDetailEntity } from './../../rooms/detail/entity/room.detail.entity';
import { ConnectionEntity } from './../../connections/entity/connection.entity';
import { MessageEntity } from './../../messages/entity/message.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  nickname: string;

  @Column()
  type: number;

  @Column({ type: 'timestamptz' })
  last_login_at: Date;

  @OneToMany(() => RoomEntity, (rooms) => rooms.user_created)
  rooms: RoomEntity[];

  @OneToMany(() => RoomDetailEntity, (room_users) => room_users.user_id)
  room_users: RoomDetailEntity[];

  @OneToMany(() => ConnectionEntity, (connections) => connections.user)
  connections: ConnectionEntity[];

  @OneToMany(() => MessageEntity, (messages) => messages.user)
  message_users: MessageEntity[];
}
