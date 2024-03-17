import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { UserEntity } from './../../user/entity/user.entity';

@Entity('connections')
export class ConnectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  connection_id: string;

  @Column()
  domain_name: string;

  @Column()
  user_id: number;

  @Column()
  status: number;

  @Column({ type: 'timestamptz' })
  disconnected_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.connections)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: any;
}
