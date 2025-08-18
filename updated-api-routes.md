# Updated API Routes Guide

## Auth Routes Moved to User Controller

All authentication-related routes have been moved from `/auth` to `/user` for better organization.

### 🔐 Authentication Routes

#### 1. User Login
```
POST /user/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 2. User Logout (Requires Session)
```
POST /user/logout
```

#### 3. Get User Profile (Requires Session)
```
GET /user/my-profile
```

#### 4. Check Session Status
```
GET /user/check-session
```

#### 5. Admin Only Content (Requires Admin Role)
```
GET /user/admin-only
```

### 📊 Complete User Routes

#### CRUD Operations:
- `POST /user/register` - Register new user
- `GET /user` - Get all users
- `GET /user/:id` - Get specific user
- `PUT /user/:id` - Complete profile update (NEW!)
- `PATCH /user/:id/phone` - Update phone only
- `PATCH /user/:id/status` - Update status only
- `DELETE /user/:id` - Delete user

#### Special Routes:
- `GET /user/null-names` - Get users with null names
- `POST /user/login` - User authentication (MOVED from /auth)
- `POST /user/logout` - User logout (MOVED from /auth)
- `GET /user/my-profile` - Get current user profile (MOVED from /auth)
- `GET /user/check-session` - Check login status (MOVED from /auth)
- `GET /user/admin-only` - Admin-only content (MOVED from /auth)

### 🏢 Admin Routes (Unchanged)
- `POST /admin/login` - Admin authentication
- `POST /admin/logout` - Admin logout
- `GET /admin/profile` - Admin profile
- And all other admin CRUD operations...

### 📧 Benefits of This Change:
- ✅ Better route organization (user-related routes under /user)
- ✅ More intuitive API structure
- ✅ Maintains all functionality
- ✅ Session authentication still works
- ✅ Guards and security unchanged

### 🧪 Testing Example:
```bash
# Login with new route
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Check session with new route  
curl -X GET http://localhost:3000/user/my-profile

# Update profile with new PUT route
curl -X PUT http://localhost:3000/user/1 \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Updated Name", "email": "new@example.com"}'
```

All routes are working and ready for testing! 🚀
