'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  User,
  GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { removeToken } from '@/lib/auth'
import toast from 'react-hot-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface User {
  _id: string
  name: string
  email: string
  role: 'student' | 'admin'
}

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
}

const studentMenuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/courses', label: 'Courses', icon: BookOpen },
  { href: '/dashboard/my-courses', label: 'My Courses', icon: FileText },
  { href: '/dashboard/fees', label: 'Fees & Payments', icon: FileText },
  { href: '/dashboard/faculties', label: 'Faculties', icon: Users },
  { href: '/dashboard/suggestions', label: 'Suggestions', icon: FileText },
  { href: '/dashboard/announcements', label: 'Announcements', icon: FileText },
  { href: '/dashboard/gallery', label: 'Gallery', icon: ImageIcon },
]

const adminMenuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/students', label: 'Students', icon: Users },
  { href: '/dashboard/courses', label: 'Courses', icon: BookOpen },
  { href: '/dashboard/faculties', label: 'Faculties', icon: Users },
  { href: '/dashboard/enrollments', label: 'Enrollments', icon: FileText },
  { href: '/dashboard/fees', label: 'Fees', icon: FileText },
  { href: '/dashboard/suggestions', label: 'Suggestions', icon: FileText },
  { href: '/dashboard/activities', label: 'Activities', icon: FileText },
  { href: '/dashboard/announcements', label: 'Announcements', icon: FileText },
  { href: '/dashboard/gallery', label: 'Gallery', icon: ImageIcon },
]

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const menuItems = user.role === 'admin' ? adminMenuItems : studentMenuItems

  // Initialize sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    // Set initial state
    handleResize()
    setIsMounted(true)

    // Add resize listener
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    removeToken()
    toast.success('Logged out successfully')
    router.push('/auth/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">SMS</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-end gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

