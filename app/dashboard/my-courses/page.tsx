'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { enrollmentAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, Clock, Trash2 } from 'lucide-react'

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const response = await enrollmentAPI.getStudentEnrollments()
      setEnrollments(response.data)
    } catch (error) {
      toast.error('Failed to load enrollments')
    } finally {
      setLoading(false)
    }
  }

  const handleUnenroll = async (enrollmentId: string) => {
    if (!confirm('Are you sure you want to unenroll from this course?')) return

    try {
      await enrollmentAPI.delete(enrollmentId)
      toast.success('Unenrolled successfully!')
      fetchEnrollments()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to unenroll')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground">View your enrolled courses</p>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No enrollments yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment, index) => (
            <motion.div
              key={enrollment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{enrollment.courseId?.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {enrollment.courseId?.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{enrollment.courseId?.duration}</span>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleUnenroll(enrollment._id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Unenroll
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
