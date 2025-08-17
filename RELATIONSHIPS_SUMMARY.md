# Bus Reservation System - Relationships Implementation

## ✅ Assignment Requirements Completed

### 1. User Category 1 Validation with Pipes ✅
- **Custom Validation DTOs**: Comprehensive validation for User registration
- **File Upload Validation**: NID image upload with size limits (2MB)
- **Password Validation**: Minimum 8 characters with complexity rules
- **Phone Number Validation**: Bangladesh format validation
- **Custom Decorators**: @IsStrongPassword, @IsValidAge

### 2. Minimum 8 Routes with CRUD Operations ✅
- **Bus Module**: 8 complete CRUD routes
- **User Module**: Registration, login, and management routes
- **Profile Module**: 5 CRUD routes for user profiles
- **Booking Module**: 6 CRUD routes for bookings
- **Total**: 20+ routes implemented

### 3. Database Relationships Implementation ✅

#### **One-to-One Relationship: User ↔ Profile**
- **Entity**: `User` has one `Profile`
- **Routes**:
  - `POST /user/:id/profile` - Create profile
  - `GET /user/:id/profile` - Get user profile
  - `PATCH /user/:id/profile` - Update profile
  - `DELETE /user/:id/profile` - Delete profile
  - `GET /profiles` - Get all profiles

#### **One-to-Many Relationship: User ↔ Booking**
- **Entity**: `User` has many `Bookings`
- **Routes**:
  - `POST /user/:id/booking` - Create booking
  - `GET /user/:id/booking` - Get user bookings
  - `PATCH /booking/:id` - Update booking
  - `DELETE /booking/:id` - Cancel booking
  - `GET /booking/:id` - Get booking details
  - `GET /bookings` - Get all bookings

#### **Additional Relationship: Bus ↔ Booking**
- **Entity**: `Bus` has many `Bookings` (Many-to-One from Booking side)

## Technical Implementation Details

### Entities Created:
1. **User Entity** (`src/user/user.entity.ts`)
   - Primary entity with authentication and personal details
   - Relationships: One Profile, Many Bookings

2. **Profile Entity** (`src/profile/profile.entity.ts`)
   - Extended user information
   - Fields: bio, dateOfBirth, gender, occupation, emergencyContact

3. **Booking Entity** (`src/booking/booking.entity.ts`)
   - Booking management with seat tracking
   - Fields: bookingReference, seats, fare, status, payment tracking

4. **Bus Entity** (`src/bus/bus.entity.ts`)
   - Bus fleet management
   - Relationships: Many Bookings

### DTOs with Validation:
- **CreateProfileDto** - Profile creation validation
- **UpdateProfileDto** - Profile update validation
- **CreateBookingDto** - Booking creation with seat validation
- **UpdateBookingDto** - Booking status and payment updates

### Services Implementation:
- **ProfileService** - Complete CRUD with user relationship handling
- **BookingService** - Booking logic with seat management and reference generation
- **UserService** - Enhanced with relationship methods
- **BusService** - Extended with booking relationship support

### Key Features:
1. **Circular Dependency Resolution**: Used string-based TypeORM relationships
2. **Comprehensive Validation**: Class-validator pipes on all DTOs
3. **Error Handling**: Proper HTTP exceptions and status codes
4. **Database Integration**: PostgreSQL with TypeORM
5. **Relationship Integrity**: Proper foreign key constraints and cascade operations

## Routes Summary

### User Routes (8):
- POST /user/register
- POST /user/login
- GET /user
- GET /user/:id
- PATCH /user/:id/phone
- PATCH /user/:id/status
- DELETE /user/:id
- GET /user/null-names

### Bus Routes (8):
- POST /buses
- GET /buses
- GET /buses/available
- GET /buses/stats
- GET /buses/:id
- PUT /buses/:id
- PATCH /buses/:id
- DELETE /buses/:id

### Profile Routes (5):
- POST /user/:id/profile
- GET /user/:id/profile
- PATCH /user/:id/profile
- DELETE /user/:id/profile
- GET /profiles

### Booking Routes (6):
- POST /user/:id/booking
- GET /user/:id/booking
- PATCH /booking/:id
- DELETE /booking/:id
- GET /booking/:id
- GET /bookings

## Database Schema

```sql
-- Users table with profile and booking relationships
users (id, username, email, phone, password, nid_image, status, created_at, updated_at)

-- Profiles table (One-to-One with Users)
profiles (id, user_id, bio, date_of_birth, gender, occupation, emergency_contact, created_at, updated_at)

-- Bookings table (Many-to-One with Users and Buses)
bookings (id, user_id, bus_id, booking_reference, number_of_seats, seat_numbers, total_fare, status, travel_date, passenger_name, passenger_phone, payment_method, payment_status, notes, created_at, updated_at)

-- Buses table with booking relationships
buses (id, bus_number, bus_name, bus_type, total_seats, available_seats, route, fare_per_seat, driver_name, driver_phone, status, created_at, updated_at)
```

## ✅ Success Criteria Met:
- [x] User Category 1 validation with pipes
- [x] Minimum 8 routes with CRUD operations (27 routes implemented)
- [x] One-to-One relationship (User ↔ Profile) with 5 CRUD routes
- [x] One-to-Many relationship (User ↔ Booking) with 6 CRUD routes
- [x] Database operations for all relationships
- [x] Comprehensive validation and error handling
- [x] TypeORM integration with PostgreSQL
- [x] No circular dependency issues
- [x] Application runs successfully

## Next Steps for Additional Marks:
1. **JWT Authentication & Guards** (5 marks)
2. **BCrypt + HttpException** (3 marks)  
3. **Mailer Implementation** (Bonus 3 marks)
