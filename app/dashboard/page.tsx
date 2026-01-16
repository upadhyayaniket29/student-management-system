'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, BookOpen, FileText, Image as ImageIcon, TrendingUp, Bell, ArrowRight } from 'lucide-react'
import { studentAPI, courseAPI, enrollmentAPI, announcementAPI, galleryAPI } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'

interface Stats {
  totalStudents?: number
  totalCourses?: number
  totalEnrollments?: number
  myEnrollments?: number
  totalAnnouncements?: number
  totalGallery?: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats>({})
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await authAPI.getMe()
        const userData = userResponse.data
        setUser(userData)

        if (userData.role === 'admin') {
          const [studentsRes, coursesRes, enrollmentsRes, announcementsRes, galleryRes] = await Promise.all([
            studentAPI.getAll(),
            courseAPI.getAll(),
            enrollmentAPI.getAll(),
            announcementAPI.getAll(),
            galleryAPI.getAll(),
          ])
          setStats({
            totalStudents: studentsRes.data.length,
            totalCourses: coursesRes.data.length,
            totalEnrollments: enrollmentsRes.data.length,
            totalAnnouncements: announcementsRes.data.length,
            totalGallery: galleryRes.data.length,
          })
          setAnnouncements(announcementsRes.data.slice(0, 5))
        } else {
          const [coursesRes, enrollmentsRes, announcementsRes, galleryRes] = await Promise.all([
            courseAPI.getAll(),
            enrollmentAPI.getStudentEnrollments(),
            announcementAPI.getAll(),
            galleryAPI.getAll(),
          ])
          setStats({
            totalCourses: coursesRes.data.length,
            myEnrollments: enrollmentsRes.data.length,
            totalAnnouncements: announcementsRes.data.length,
            totalGallery: galleryRes.data.length,
          })
          setAnnouncements(announcementsRes.data.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const adminStats = [
    {
      title: 'Total Students',
      value: stats.totalStudents || 0,
      icon: Users,
      description: 'Registered students',
      color: 'text-blue-500',
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses || 0,
      icon: BookOpen,
      description: 'Available courses',
      color: 'text-green-500',
    },
    {
      title: 'Total Enrollments',
      value: stats.totalEnrollments || 0,
      icon: FileText,
      description: 'Course enrollments',
      color: 'text-purple-500',
    },
    {
      title: 'Announcements',
      value: stats.totalAnnouncements || 0,
      icon: TrendingUp,
      description: 'Active announcements',
      color: 'text-orange-500',
    },
  ]

  const studentStats = [
    {
      title: 'Available Courses',
      value: stats.totalCourses || 0,
      icon: BookOpen,
      description: 'Courses to enroll',
      color: 'text-blue-500',
    },
    {
      title: 'My Enrollments',
      value: stats.myEnrollments || 0,
      icon: FileText,
      description: 'Enrolled courses',
      color: 'text-green-500',
    },
    {
      title: 'Announcements',
      value: stats.totalAnnouncements || 0,
      icon: TrendingUp,
      description: 'Latest updates',
      color: 'text-purple-500',
    },
    {
      title: 'Gallery Images',
      value: stats.totalGallery || 0,
      icon: ImageIcon,
      description: 'Institute gallery',
      color: 'text-orange-500',
    },
  ]

  const displayStats = user?.role === 'admin' ? adminStats : studentStats

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your {user?.role === 'admin' ? 'system' : 'account'}.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Recent Announcements Card */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle>Recent Announcements</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard/announcements')}
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Stay updated with the latest news and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No announcements yet
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <motion.div
                      key={announcement._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push('/dashboard/announcements')}
                    >
                      <div className="flex h-2 w-2 mt-2 rounded-full bg-primary" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {announcement.title}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(announcement.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
