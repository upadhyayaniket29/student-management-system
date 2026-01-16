# Student Management System

A comprehensive full-stack Student Management System built with Next.js, Node.js, Express, and MongoDB. This system provides role-based access control for students and administrators with a modern, premium UI.

## 🚀 Features

### Student Features
- ✅ Student registration and authentication
- ✅ Student dashboard with statistics
- ✅ Profile management
- ✅ Browse and enroll in courses
- ✅ View enrolled courses
- ✅ View announcements
- ✅ View institute gallery

### Admin Features
- ✅ Admin registration (with secret key)
- ✅ Admin authentication
- ✅ View and manage all students
- ✅ Enable/disable student accounts
- ✅ Create, update, and delete courses
- ✅ View all enrollments
- ✅ Create and manage announcements
- ✅ Upload and manage gallery images

### UI/UX Features
- ✅ Premium, modern design
- ✅ Dark and light mode
- ✅ Smooth animations with Framer Motion
- ✅ Skeleton loaders
- ✅ Toast notifications
- ✅ Fully responsive design
- ✅ Large cards with rounded corners and soft shadows

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **Lucide Icons**
- **Framer Motion**
- **Axios**
- **React Hot Toast**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **JWT** authentication
- **bcrypt** for password hashing
- **Express Validator** for input validation

## 📁 Project Structure

```
Student/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/          # Dashboard pages
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── layouts/           # Layout components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions
│   ├── api.ts             # API client
│   ├── auth.ts            # Auth utilities
│   └── utils.ts           # General utilities
├── server/                # Backend server
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── app.js             # Express app
│   └── server.js          # Server entry point
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Student
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/student_management
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ADMIN_SECRET_KEY=admin_secret_key_2024
   NODE_ENV=development
   ```

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **Seed the database** (optional)
   ```bash
   cd server
   npm run seed
   cd ..
   ```

   This will create:
   - 1 admin user (admin@example.com / admin123)
   - 3 sample students
   - 4 sample courses
   - 3 sample announcements
   - 3 sample gallery images

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

   The server will run on `http://localhost:5000`

2. **Start the frontend** (in a new terminal)
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

3. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - Use the seed data credentials to login:
     - **Admin**: admin@example.com / admin123
     - **Student**: john@example.com / student123

## 📝 API Endpoints

### Authentication
- `POST /api/auth/student/signup` - Student registration
- `POST /api/auth/admin/signup` - Admin registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students` - Get all students (Admin only)
- `GET /api/students/:id` - Get student by ID (Admin only)
- `PATCH /api/students/:id/status` - Update student status (Admin only)
- `GET /api/students/profile/me` - Get student profile
- `PUT /api/students/profile/me` - Update student profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Admin only)
- `PUT /api/courses/:id` - Update course (Admin only)
- `DELETE /api/courses/:id` - Delete course (Admin only)

### Enrollments
- `GET /api/enrollments` - Get all enrollments (Admin only)
- `GET /api/enrollments/student/me` - Get student enrollments
- `POST /api/enrollments` - Create enrollment
- `DELETE /api/enrollments/:id` - Delete enrollment

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements` - Create announcement (Admin only)
- `PUT /api/announcements/:id` - Update announcement (Admin only)
- `DELETE /api/announcements/:id` - Delete announcement (Admin only)

### Gallery
- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Upload image (Admin only)
- `DELETE /api/gallery/:id` - Delete image (Admin only)

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected API routes
- Input validation
- CORS configuration
- Environment variables for sensitive data

## 🎨 UI Components

The project uses shadcn/ui components:
- Button
- Card
- Input
- Label
- Dialog
- Select
- Textarea
- Avatar
- Badge
- Skeleton
- Dropdown Menu
- Toast

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🌙 Dark Mode

The application supports dark and light themes with automatic system preference detection. Users can toggle between themes using the theme switcher in the top bar.

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Update `MONGODB_URI` in environment variables
3. Deploy to platforms like:
   - Heroku
   - Railway
   - Render
   - AWS
   - DigitalOcean

### Frontend Deployment
1. Update `NEXT_PUBLIC_API_URL` to point to your backend
2. Deploy to platforms like:
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS Amplify

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Development

### Adding New Features

1. **Backend**: Add routes in `server/routes/`, controllers in `server/controllers/`, and models in `server/models/`
2. **Frontend**: Add pages in `app/dashboard/` and update API client in `lib/api.ts`

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ for educational institutions**
