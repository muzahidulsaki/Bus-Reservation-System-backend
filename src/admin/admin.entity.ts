import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Department } from './entities/department.entity';
 
@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
 
  @Column({ type: 'varchar', length: 100 })
  fullName: string;
 
  @Column({ type: 'int', unsigned: true })
  age: number;
 
  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';
 
  @Column({ type: 'varchar', unique: true })
  email: string;
 
  @Column()
  password: string;
 
  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: 'male' | 'female';
 
  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  position: string;

  // Many-to-One relationship with Department
  @ManyToOne(() => Department, (department) => department.admins, { nullable: true })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: true })
  departmentId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}