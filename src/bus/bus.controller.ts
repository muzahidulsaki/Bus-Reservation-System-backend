import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BusService } from './bus.service';
import { CreateBusDto, UpdateBusDto, BusResponseDto } from './dto/bus.dto';

@Controller('buses')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class BusController {
  constructor(private readonly busService: BusService) {}

  // Route 1: POST /buses - Create bus
  @Post()
  async create(@Body() createBusDto: CreateBusDto): Promise<BusResponseDto> {
    try {
      return await this.busService.create(createBusDto);
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

  // Route 2: GET /buses - Get all buses
  @Get()
  async findAll(@Query('route') route?: string): Promise<BusResponseDto[]> {
    try {
      if (route) {
        return await this.busService.findByRoute(route);
      }
      return await this.busService.findAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch buses',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Route 3: GET /buses/available - Get available buses
  @Get('available')
  async findAvailable(): Promise<BusResponseDto[]> {
    try {
      return await this.busService.findAvailableBuses();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch available buses',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Route 4: GET /buses/stats - Get bus statistics
  @Get('stats')
  async getStats(): Promise<any> {
    try {
      return await this.busService.getBusStats();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch bus statistics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Route 5: GET /buses/:id - Get bus by ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<BusResponseDto> {
    try {
      return await this.busService.findOne(id);
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

  // Route 6: PUT /buses/:id - Full update bus
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusDto: CreateBusDto // Using CreateBusDto for full update
  ): Promise<BusResponseDto> {
    try {
      return await this.busService.update(id, updateBusDto);
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

  // Route 7: PATCH /buses/:id - Partial update bus
  @Patch(':id')
  async partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusDto: UpdateBusDto
  ): Promise<BusResponseDto> {
    try {
      return await this.busService.update(id, updateBusDto);
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

  // Route 8: DELETE /buses/:id - Delete bus
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      return await this.busService.remove(id);
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
}
