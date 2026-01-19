# BlogFusion 📝

A modern, full-stack blogging platform built with the MERN stack (MongoDB, Express, React, Node.js). BlogFusion provides a clean, Medium-inspired interface for creating, sharing, and discovering blog posts.

![BlogFusion](https://img.shields.io/badge/MERN-Stack-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### 🎨 User Interface
- **Modern Design**: Clean, Medium-style horizontal card layout with enhanced visual appeal
- **Responsive Navigation**: Sticky header with pill-style active state indicators
- **Image Previews**: Real-time thumbnail preview when uploading cover images
- **Toast Notifications**: User-friendly feedback for all actions (login, post creation, etc.)

### 📚 Content Management
- **Rich Text Editor**: Powered by React Quill for formatted content creation
- **Category System**: Organize posts with multiple categories (Art, Science, Technology, News, Daily Updates)
- **Tag Support**: Add custom tags to posts for better discoverability
- **Draft & Publish**: Save posts as drafts or publish immediately
- **Image Upload**: Mandatory cover images with preview functionality

### 🔐 Authentication & Authorization
- **JWT Authentication**: Secure user authentication with access and refresh tokens
- **Protected Routes**: Middleware-based route protection
- **User Profiles**: Display author information on posts

### 🔍 Search & Filter
- **Category Filtering**: Browse posts by specific categories
- **Author Search**: Search posts by username
- **Tag Search**: Find posts by tags

### 💬 Social Features
- **Comments**: Add and view comments on posts
- **Likes**: Like/unlike posts with real-time counter
- **Author Attribution**: Display author name and profile on each post

### ✅ Validation
- **Mandatory Fields**: Enforced category selection and image upload
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error messages via toast notifications

## 🚀 Tech Stack

### Frontend
- **React** (v19.2.0) - UI library
- **React Router DOM** (v7.9.6) - Client-side routing
- **React Quill New** (v3.7.0) - Rich text editor
- **React Hot Toast** - Toast notifications
- **Axios** (v1.13.2) - HTTP client
- **Moment.js** (v2.30.1) - Date formatting
- **Vite** (v7.2.4) - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cookie Parser** - Cookie management

## 📁 Project Structure

```
BlogFusion/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components (Navbar, etc.)
│   │   ├── pages/         # Page components (Home, CreatePost, etc.)
│   │   ├── context/       # React Context (AuthContext)
│   │   ├── assets/        # Static assets
│   │   └── index.css      # Global styles
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── models/           # Mongoose models (User, Post, Category)
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware (auth, etc.)
│   ├── config/           # Configuration files
│   ├── uploads/          # Uploaded images
│   └── index.js          # Server entry point
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/BlogFusion.git
cd BlogFusion
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm start
# or for development with nodemon
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Seed Categories (Optional)
```bash
cd server
node seedCategories.js
```

## 🎯 Usage

1. **Register/Login**: Create an account or login to access full features
2. **Browse Posts**: View all posts on the home page, filter by category
3. **Create Post**: Click "Write" to create a new post with title, content, categories, tags, and cover image
4. **Edit/Delete**: Manage your own posts (edit or delete)
5. **Interact**: Like posts and add comments
6. **Search**: Use category filters or search by author username

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts/create` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `PUT /api/posts/:id/like` - Like/unlike post (protected)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (protected)

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Add comment (protected)

### Upload
- `POST /api/upload` - Upload image (protected)

## 🎨 Styling Features

- **Enhanced Cards**: Large, card-based design with shadows and hover effects
- **Typography**: Increased font sizes for better readability (28px titles, 16px body)
- **Color Scheme**: Teal accent color with gray scale palette
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-friendly design with breakpoints

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only cookies for refresh tokens
- Protected API routes
- Input validation and sanitization

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogfusion
JWT_SECRET=your_secret_key_here
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- React Quill for the rich text editor
- Medium for design inspiration
- MongoDB for the database solution
- The MERN stack community

---

**Happy Blogging! 📝✨**
