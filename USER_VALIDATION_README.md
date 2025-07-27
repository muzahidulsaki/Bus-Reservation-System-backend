# User Category 1 - Validation Implementation

## Overview
This implementation provides comprehensive validation for User Category 1 with the following requirements:

1. **Name Validation**: Only contains alphabets
2. **Email Validation**: Required field with @ symbol and .xyz domain
3. **NID Validation**: Valid Bangladesh NID format (10, 13, or 17 digits)
4. **File Upload Validation**: NID image with maximum 2MB size

## Features Implemented

### 1. DTO Validation (`user.dto.ts`)

#### CreateUserDto
- **Name**: 
  - Required field
  - Only alphabets and spaces allowed
  - Length between 2-50 characters
  - Automatically trims whitespace

- **Email**:
  - Required field
  - Must contain @ symbol
  - Must end with .xyz domain
  - Automatically converts to lowercase and trims

- **NID Number**:
  - Required field
  - Valid Bangladesh NID formats: 10, 13, or 17 digits
  - Automatically trims whitespace

- **NID Image**:
  - Optional field
  - Maximum 2MB file size validation
  - Supports file objects and base64 strings

#### UpdateUserDto
- All fields are optional for partial updates
- Same validation rules apply when fields are provided

#### UserResponseDto
- Clean response structure for API responses

### 2. Custom Validators

#### `@IsXyzEmail()`
Custom validator that ensures email:
- Contains @ symbol
- Ends with .xyz domain
- Uses regex pattern: `/^[^\s@]+@[^\s@]+\.xyz$/`

#### `@IsValidNID()`
Custom validator for Bangladesh NID:
- Accepts 10, 13, or 17 digit formats
- Uses regex pattern: `/^(\d{10}|\d{13}|\d{17})$/`

#### `@IsValidFileSize(maxSizeInMB)`
Custom validator for file size:
- Checks file object size property
- Calculates base64 string size
- Configurable maximum size in MB

### 3. Controller Implementation (`user.controller.ts`)

#### File Upload Support
- Uses `@UseInterceptors(FileInterceptor('nidImage'))`
- Validates file size and type
- Supports multipart/form-data requests

#### Error Handling
- Comprehensive HTTP exception handling
- Proper status codes (400, 404, 409, 500)
- Clear error messages

#### API Endpoints
- `POST /users` - Create new user with file upload
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user with file upload
- `DELETE /users/:id` - Delete user

### 4. Service Implementation (`user.service.ts`)

#### Business Logic
- Email uniqueness validation
- NID uniqueness validation
- In-memory storage (can be replaced with database)
- User statistics and utility methods

## Usage Examples

### Valid Request Examples

#### Creating a User (JSON)
```json
{
  "name": "John Doe",
  "email": "john.doe@example.xyz",
  "nidNumber": "1234567890"
}
```

#### Creating a User with File Upload (Form Data)
```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john.doe@example.xyz');
formData.append('nidNumber', '1234567890123');
formData.append('nidImage', fileInput.files[0]);

fetch('/users', {
  method: 'POST',
  body: formData
});
```

### Validation Error Examples

#### Invalid Name (contains numbers)
```json
{
  "name": "John123",
  "email": "john.doe@example.xyz",
  "nidNumber": "1234567890"
}
```
**Error**: "Name should only contain alphabets and spaces"

#### Invalid Email (wrong domain)
```json
{
  "name": "John Doe",
  "email": "john.doe@gmail.com",
  "nidNumber": "1234567890"
}
```
**Error**: "Email must contain @ and end with .xyz domain"

#### Invalid NID Format
```json
{
  "name": "John Doe",
  "email": "john.doe@example.xyz",
  "nidNumber": "123"
}
```
**Error**: "NID must be a valid format (10, 13, or 17 digits)"

## Testing

### Running Validation Tests
```bash
npm test -- user-dto.validation.spec.ts
```

### Manual Testing with curl

#### Create User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Khan",
    "email": "ahmed.khan@student.xyz",
    "nidNumber": "1234567890123"
  }'
```

#### Create User with File Upload
```bash
curl -X POST http://localhost:3000/users \
  -F "name=Ahmed Khan" \
  -F "email=ahmed.khan@student.xyz" \
  -F "nidNumber=1234567890123" \
  -F "nidImage=@/path/to/nid-image.jpg"
```

## Security Features

1. **Input Sanitization**: All inputs are trimmed and transformed
2. **File Size Limits**: Prevents large file uploads
3. **File Type Validation**: Only image files accepted
4. **Data Uniqueness**: Email and NID uniqueness enforced
5. **XSS Prevention**: Input validation prevents malicious data

## Integration with Database

To integrate with TypeORM or Mongoose:

1. Replace in-memory storage in `UserService`
2. Add entity/schema definitions
3. Update service methods to use repository patterns
4. Add database connection configuration

## Environment Setup

1. Install dependencies:
```bash
npm install @nestjs/platform-express multer @types/multer
```

2. Ensure ValidationPipe is configured in `main.ts`
3. Start the development server:
```bash
npm run start:dev
```

## File Structure

```
src/user/
├── dto/
│   └── user.dto.ts          # Validation DTOs with custom validators
├── user.controller.ts       # API endpoints with file upload
├── user.service.ts          # Business logic and data management
└── user.module.ts           # Module configuration
```

This implementation provides a robust, secure, and comprehensive validation system for User Category 1 requirements.
