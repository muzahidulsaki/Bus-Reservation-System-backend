import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  bookingReference: string;

  @Column({ type: 'int' })
  numberOfSeats: number;

  @Column({ type: 'json', nullable: true })
  seatNumbers: number[]; // Array of seat numbers

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalFare: number;

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' })
  status: string;

  @Column({ type: 'date' })
  travelDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  passengerName: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  passengerPhone: string;

  @Column({ type: 'enum', enum: ['cash', 'card', 'mobile_banking'], default: 'cash' })
  paymentMethod: string;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'refunded'], default: 'pending' })
  paymentStatus: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Many-to-One relationship with User
  @ManyToOne('User', 'bookings', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: any;

  @Column()
  userId: number;

  // Many-to-One relationship with Bus (if you want to track which bus)
  @ManyToOne('Bus', { nullable: true })
  @JoinColumn({ name: 'busId' })
  bus: any;

  @Column({ nullable: true })
  busId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
