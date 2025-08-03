import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bus } from './bus.entity';
import { CreateBusDto, UpdateBusDto, BusResponseDto } from './dto/bus.dto';

@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
  ) {}

  async create(createBusDto: CreateBusDto): Promise<BusResponseDto> {
    try {
      // Check if bus number already exists
      const existingBus = await this.busRepository.findOne({
        where: { busNumber: createBusDto.busNumber }
      });

      if (existingBus) {
        throw new HttpException(
          'Bus number already exists',
          HttpStatus.CONFLICT
        );
      }

      // Set available seats to total seats if not provided
      if (!createBusDto.availableSeats) {
        createBusDto.availableSeats = createBusDto.totalSeats;
      }

      // Set default status if not provided
      if (!createBusDto.status) {
        createBusDto.status = 'active';
      }

      const bus = this.busRepository.create(createBusDto);
      const savedBus = await this.busRepository.save(bus);

      return this.mapToResponseDto(savedBus);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create bus',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(): Promise<BusResponseDto[]> {
    try {
      const buses = await this.busRepository.find({
        order: { createdAt: 'DESC' }
      });

      return buses.map(bus => this.mapToResponseDto(bus));
    } catch (error) {
      throw new HttpException(
        'Failed to fetch buses',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: number): Promise<BusResponseDto> {
    try {
      const bus = await this.busRepository.findOne({ where: { id } });

      if (!bus) {
        throw new HttpException('Bus not found', HttpStatus.NOT_FOUND);
      }

      return this.mapToResponseDto(bus);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch bus',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: number, updateBusDto: UpdateBusDto): Promise<BusResponseDto> {
    try {
      const bus = await this.busRepository.findOne({ where: { id } });

      if (!bus) {
        throw new HttpException('Bus not found', HttpStatus.NOT_FOUND);
      }

      // Check if bus number already exists (excluding current bus)
      if (updateBusDto.busNumber) {
        const existingBus = await this.busRepository.findOne({
          where: { busNumber: updateBusDto.busNumber }
        });

        if (existingBus && existingBus.id !== id) {
          throw new HttpException(
            'Bus number already exists',
            HttpStatus.CONFLICT
          );
        }
      }

      // Validate available seats don't exceed total seats
      const totalSeats = updateBusDto.totalSeats || bus.totalSeats;
      if (updateBusDto.availableSeats && updateBusDto.availableSeats > totalSeats) {
        throw new HttpException(
          'Available seats cannot exceed total seats',
          HttpStatus.BAD_REQUEST
        );
      }

      await this.busRepository.update(id, updateBusDto);
      const updatedBus = await this.busRepository.findOne({ where: { id } });

      return this.mapToResponseDto(updatedBus);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update bus',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const bus = await this.busRepository.findOne({ where: { id } });

      if (!bus) {
        throw new HttpException('Bus not found', HttpStatus.NOT_FOUND);
      }

      await this.busRepository.delete(id);

      return { message: 'Bus deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete bus',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Utility methods
  async findByRoute(route: string): Promise<BusResponseDto[]> {
    try {
      const buses = await this.busRepository.find({
        where: { route, status: 'active' },
        order: { farePerSeat: 'ASC' }
      });

      return buses.map(bus => this.mapToResponseDto(bus));
    } catch (error) {
      throw new HttpException(
        'Failed to fetch buses by route',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAvailableBuses(): Promise<BusResponseDto[]> {
    try {
      const buses = await this.busRepository
        .createQueryBuilder('bus')
        .where('bus.availableSeats > 0')
        .andWhere('bus.status = :status', { status: 'active' })
        .orderBy('bus.farePerSeat', 'ASC')
        .getMany();

      return buses.map(bus => this.mapToResponseDto(bus));
    } catch (error) {
      throw new HttpException(
        'Failed to fetch available buses',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBusStats(): Promise<any> {
    try {
      const [total, active, totalSeats, availableSeats] = await Promise.all([
        this.busRepository.count(),
        this.busRepository.count({ where: { status: 'active' } }),
        this.busRepository
          .createQueryBuilder('bus')
          .select('SUM(bus.totalSeats)', 'total')
          .getRawOne(),
        this.busRepository
          .createQueryBuilder('bus')
          .select('SUM(bus.availableSeats)', 'available')
          .where('bus.status = :status', { status: 'active' })
          .getRawOne()
      ]);

      return {
        totalBuses: total,
        activeBuses: active,
        totalSeats: parseInt(totalSeats.total) || 0,
        availableSeats: parseInt(availableSeats.available) || 0,
        occupancyRate: totalSeats.total ? 
          (((totalSeats.total - availableSeats.available) / totalSeats.total) * 100).toFixed(2) : 0
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch bus statistics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private mapToResponseDto(bus: Bus): BusResponseDto {
    return {
      id: bus.id,
      busNumber: bus.busNumber,
      busName: bus.busName,
      busType: bus.busType,
      totalSeats: bus.totalSeats,
      availableSeats: bus.availableSeats,
      route: bus.route,
      farePerSeat: parseFloat(bus.farePerSeat.toString()),
      driverName: bus.driverName,
      driverPhone: bus.driverPhone,
      status: bus.status,
      createdAt: bus.createdAt,
      updatedAt: bus.updatedAt,
    };
  }
}
