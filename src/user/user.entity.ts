// src/users/user.entity.ts
import { Type } from 'class-transformer';
import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  OneToOne,
  OneToMany,
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

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
status: 'active' | 'inactive';

  @Column({ nullable: true })
  fullName: string;

  @Type(() => Number)
  @Column({ type: 'bigint', unsigned: true })
  phone: number;

  @Column()
  email: string;

  @Column({ nullable: true, default: 18 })
  age: number;

  @Column()
  password: string;

  @Column({ nullable: true })
  gender: string;

  @Type(() => Number)
  @Column({ type: 'bigint', nullable: true })
  nid: number;

  @Column({ nullable: true })
  nidImagePath: string;

  @Column({ type: 'enum', enum: ['user', 'admin', 'bus_owner'], default: 'user' })
  role: string;

  // One-to-One relationship with Profile
  @OneToOne('Profile', 'user')
  profile: any;

  // One-to-Many relationship with Booking
  @OneToMany('Booking', 'user')
  bookings: any[];
}
