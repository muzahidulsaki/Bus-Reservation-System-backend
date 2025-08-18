import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Admin } from '../admin.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  building: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  floor: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // One-to-Many relationship with Admin
  @OneToMany(() => Admin, (admin) => admin.department)
  admins: Admin[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
