import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';


@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fromLocation: string;

  @Column()
  toLocation: string;

  @Column({ type: 'date' })
  journeyDate: Date;

  @Column({ type: 'time', nullable: true })
  departureTime: string;

  @Column()
  busType: string;

  @Column()
  seatNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fare: number;

  @Column()
  passengerName: string;

  @Column()
  passengerPhone: string;

  @Column({ nullable: true })
  passengerEmail: string;

  @Column({ type: 'enum', enum: ['confirmed', 'pending', 'cancelled'], default: 'pending' })
  status: string;

  @Column({ unique: true })
  ticketNumber: string;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}