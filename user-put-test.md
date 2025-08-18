# User PUT Route Testing Guide

## PUT /user/:id - Complete User Profile Update

### Description
This route allows complete update of a user profile. It validates the data and ensures no duplicate emails.

### Endpoint
```
PUT http://localhost:3000/user/:id
```

### Request Body (UpdateUserDto)
```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com",
  "password": "newPassword123",
  "gender": "Male",
  "phone": "01712345678",
  "nid": "1234567890123",
  "status": "active"
}
```

### Validation Rules
- **fullName**: Required, minimum 2 characters
- **email**: Required, valid email format, must be unique
- **password**: Required, minimum 6 characters
- **gender**: Required, either "Male" or "Female"
- **phone**: Required, exactly 11 digits, must be numeric
- **nid**: Required, exactly 13 digits, must be numeric
- **status**: Optional, either "active" or "inactive"

### Success Response (200 OK)
```json
{
  "message": "User profile updated successfully",
  "data": {
    "id": 1,
    "fullName": "Updated Name",
    "email": "updated@example.com",
    "gender": "Male",
    "phone": 1712345678,
    "nid": 1234567890123,
    "status": "active",
    "createdAt": "2025-01-08T...",
    "updatedAt": "2025-01-08T..."
  }
}
```

### Error Responses

#### User Not Found (404)
```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

#### Email Already Exists (400)
```json
{
  "statusCode": 400,
  "message": "Email already exists"
}
```

#### Validation Errors (400)
```json
{
  "statusCode": 400,
  "message": [
    "fullName must be longer than or equal to 2 characters",
    "email must be an email",
    "password must be longer than or equal to 6 characters",
    "phone must be exactly 11 digits",
    "nid must be exactly 13 digits"
  ],
  "error": "Bad Request"
}
```

### Testing with curl
```bash
curl -X PUT http://localhost:3000/user/1 \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated User Name",
    "email": "updated@test.com",
    "password": "newpassword123",
    "gender": "Male",
    "phone": "01712345678",
    "nid": "1234567890123",
    "status": "active"
  }'
```

### Features
- ✅ Complete profile update with validation
- ✅ Email uniqueness check (except current user's email)
- ✅ Password hashing with bcrypt
- ✅ Phone and NID conversion to numbers
- ✅ Proper error handling
- ✅ Password excluded from response
- ✅ Comprehensive validation with class-validator

### Note
- Password will be automatically hashed before saving
- The response will not include the password field for security
- Phone and NID are converted to numbers automatically
- Email uniqueness is checked only if the email is being changed
