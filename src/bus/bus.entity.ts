import { Optional } from '@nestjs/common';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('buses')
export class Bus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  busNumber: string;

  @Column({ type: 'varchar', length: 100 })
  busName: string;

  @Column({ type: 'varchar', length: 50 })
  busType: string; // AC, Non-AC, Sleeper, etc.

  @Column({ type: 'int' })
  totalSeats: number;

  @Column({ type: 'int', default: 0 })
  availableSeats: number;

  @Column({ type: 'varchar', length: 100 })
  route: string; // Dhaka to Chittagong

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  farePerSeat: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  driverName: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  driverPhone: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string; // active, inactive, maintenance

  // One-to-Many relationship with Booking
  @OneToMany('Booking', 'bus')
  bookings: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
