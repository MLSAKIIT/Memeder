### POST /api/auth/register
**Description:** Register a new user

**Authentication:** 🌐 Public

**Request Body:**
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123"
}

**Success Response (201):**
{
  "success": true,
  "message": "User registered successfully",
  "data": { "user": { "id": "...", "username": "johndoe", "email": "john@example.com" } }
}

**Error (400):**
{
  "success": false,
  "message": "Email already registered"
}

---

### POST /api/auth/login
**Description:** Log in a user

**Authentication:** 🌐 Public

**Request Body:**
{
  "email": "john@example.com",
  "password": "securepass123"
}

**Success Response (200):**
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "data": { "user": { "id": "...", "username": "johndoe", "email": "john@example.com" } }
}

**Error (401):**
{
  "success": false,
  "message": "Invalid credentials"
}

---

### POST /api/auth/logout
**Description:** Log out a user

**Authentication:** 🔒 Protected

**Headers:**
Authorization: Bearer <jwt_token>

**Success Response (200):**
{
  "success": true,
  "message": "Logout successful"
}

**Error (401):**
{
  "success": false,
  "message": "Unauthorized"
}

---

### GET /api/auth/profile
**Description:** Get logged-in user profile

**Authentication:** 🔒 Protected

**Headers:**
Authorization: Bearer <jwt_token>

**Success Response (200):**
{
  "success": true,
  "data": { "id": "...", "username": "johndoe", "email": "john@example.com", "createdAt": "2025-10-21T10:00:00Z" }
}

**Error (401):**
{
  "success": false,
  "message": "Unauthorized"
}

---

### GET /api/memes
**Description:** Get random memes

**Authentication:** 🌐 Public

**Query Parameters (optional):**
limit (number) - Number of memes to fetch

**Success Response (200):**
{
  "success": true,
  "data": [
    { "id": "1", "title": "Funny Cat", "url": "https://img.com/cat.jpg", "likes": 120 },
    { "id": "2", "title": "Relatable Student", "url": "https://img.com/student.jpg", "likes": 89 }
  ]
}

---

### POST /api/memes
**Description:** Create a meme

**Authentication:** 🔒 Protected

**Headers:**
Authorization: Bearer <jwt_token>

**Request Body:**
{
  "title": "Programmer Humor",
  "url": "https://img.com/code.jpg"
}

**Success Response (201):**
{
  "success": true,
  "message": "Meme created successfully",
  "data": { "id": "...", "title": "Programmer Humor", "url": "https://img.com/code.jpg" }
}

**Error (400):**
{
  "success": false,
  "message": "Missing required fields"
}

---

### GET /api/memes/:id
**Description:** Get a specific meme by ID

**Authentication:** 🌐 Public

**Success Response (200):**
{
  "success": true,
  "data": { "id": "...", "title": "Programmer Humor", "url": "https://img.com/code.jpg", "likes": 23 }
}

**Error (404):**
{
  "success": false,
  "message": "Meme not found"
}

---

### PUT /api/memes/:id
**Description:** Update a meme

**Authentication:** 🔒 Protected

**Headers:**
Authorization: Bearer <jwt_token>

**Request Body:**
{
  "title": "Updated Meme Title",
  "url": "https://img.com/new-image.jpg"
}

**Success Response (200):**
{
  "success": true,
  "message": "Meme updated successfully",
  "data": { "id": "...", "title": "Updated Meme Title", "url": "https://img.com/new-image.jpg" }
}

**Error (403):**
{
  "success": false,
  "message": "Not authorized to edit this meme"
}

---

### DELETE /api/memes/:id
**Description:** Delete a meme by ID

**Authentication:** 🔒 Protected

**Headers:**
Authorization: Bearer <jwt_token>

**Success Response (200):**
{
  "success": true,
  "message": "Meme deleted successfully"
}

**Error (403):**
{
  "success": false,
  "message": "Not authorized to delete this meme"
}

---

### POST /api/memes/:id/swipe
**Description:** Record a swipe action (like/dislike) on a meme

**Authentication:** 🔒 Protected

**Headers:**
Authorization: Bearer <jwt_token>

**Request Body:**
{
  "direction": "right"
}

**Success Response (200):**
{
  "success": true,
  "message": "Swipe recorded",
  "data": { "memeId": "...", "direction": "right" }
}

**Error (400):**
{
  "success": false,
  "message": "Invalid swipe direction"
}
