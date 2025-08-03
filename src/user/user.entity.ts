// src/users/user.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: number;

  @BeforeInsert()
  generateId() {
    this.id = Math.floor(1000 + Math.random() * 9000);
  }

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  fullName: string;

  @Column({ type: 'bigint', unsigned: true })
  phone: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'bigint', nullable: true })
  nid: number;

  @Column({ nullable: true })
  nidImagePath: string;
}
