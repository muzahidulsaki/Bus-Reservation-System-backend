# User Registration Testing

## Start the Server
```bash
npm run start:dev
```

## Test API Endpoints

### 1. Valid User Registration (with file upload)
```bash
# Create a test image file
echo "test image content" > test-nid.jpg

curl -X POST http://localhost:3000/user/register \
  -F "name=Ahmed Rahman" \
  -F "email=ahmed.rahman@student.xyz" \
  -F "nid=1234567890123" \
  -F "nid_image=@test-nid.jpg"
```

### 2. Invalid Name (contains numbers)
```bash
curl -X POST http://localhost:3000/user/register \
  -F "name=Ahmed123" \
  -F "email=ahmed.rahman@student.xyz" \
  -F "nid=1234567890123" \
  -F "nid_image=@test-nid.jpg"
```

### 3. Invalid Email (wrong domain)
```bash
curl -X POST http://localhost:3000/user/register \
  -F "name=Ahmed Rahman" \
  -F "email=ahmed.rahman@gmail.com" \
  -F "nid=1234567890123" \
  -F "nid_image=@test-nid.jpg"
```

### 4. Invalid NID (wrong format)
```bash
curl -X POST http://localhost:3000/user/register \
  -F "name=Ahmed Rahman" \
  -F "email=ahmed.rahman@student.xyz" \
  -F "nid=123" \
  -F "nid_image=@test-nid.jpg"
```

### 5. Missing NID Image
```bash
curl -X POST http://localhost:3000/user/register \
  -F "name=Ahmed Rahman" \
  -F "email=ahmed.rahman@student.xyz" \
  -F "nid=1234567890123"
```

### 6. Large File (will fail)
```bash
# Create large file (>2MB)
dd if=/dev/zero of=large-nid.jpg bs=1M count=3 2>/dev/null || fsutil file createnew large-nid.jpg 3145728

curl -X POST http://localhost:3000/user/register \
  -F "name=Ahmed Rahman" \
  -F "email=ahmed.rahman@student.xyz" \
  -F "nid=1234567890123" \
  -F "nid_image=@large-nid.jpg"
```

## Expected Responses

### Success Response:
```json
{
  "id": 1,
  "name": "Ahmed Rahman",
  "email": "ahmed.rahman@student.xyz",
  "nid": "1234567890123",
  "nidImagePath": "./uploads/nid_images/1234567890-test-nid.jpg",
  "createdAt": "2025-07-28T...",
  "updatedAt": "2025-07-28T..."
}
```

### Validation Error Response:
```json
{
  "message": [
    "Name must contain only alphabets"
  ],
  "error": "Bad Request", 
  "statusCode": 400
}
```
