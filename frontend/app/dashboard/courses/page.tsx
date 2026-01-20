'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { courseAPI, enrollmentAPI, authAPI, facultyAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, Clock, Plus, Edit, Trash2, DollarSign, Users, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [formData, setFormData] = useState({ title: '', description: '', duration: '', fee: '', facultyId: '', capacity: '' })
  const [faculties, setFaculties] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, userRes, facultiesRes] = await Promise.all([
          courseAPI.getAll(),
          authAPI.getMe(),
          user?.role === 'admin' ? facultyAPI.getAll() : Promise.resolve({ data: [] }),
        ])
        setCourses(coursesRes.data)
        setUser(userRes.data)
        if (userRes.data?.role === 'admin') {
          setFaculties(facultiesRes.data || [])
        }
      } catch (error) {
        toast.error('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.role])

  const handleCreate = async () => {
    try {
      const courseData = {
        ...formData,
        fee: parseFloat(formData.fee),
        capacity: parseInt(formData.capacity) || 50,
        facultyId: formData.facultyId || undefined,
      }
      if (editingCourse) {
        await courseAPI.update(editingCourse._id, courseData)
        toast.success('Course updated successfully!')
      } else {
        await courseAPI.create(courseData)
        toast.success('Course created successfully!')
      }
      const response = await courseAPI.getAll()
      setCourses(response.data)
      setDialogOpen(false)
      setEditingCourse(null)
      setFormData({ title: '', description: '', duration: '', fee: '', facultyId: '', capacity: '' })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save course')
    }
  }

  const handleEdit = (course: any) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      fee: course.fee?.toString() || '',
      facultyId: course.facultyId?._id || course.facultyId || '',
      capacity: course.capacity?.toString() || '50',
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      await courseAPI.delete(id)
      toast.success('Course deleted successfully!')
      const response = await courseAPI.getAll()
      setCourses(response.data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete course')
    }
  }

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollmentAPI.create(courseId)
      toast.success('Enrolled successfully! Fee has been generated. Please pay from Fees page.')
      const response = await courseAPI.getAll()
      setCourses(response.data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to enroll')
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">Browse and manage courses</p>
        </div>
        {user?.role === 'admin' && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingCourse(null)
                setFormData({ title: '', description: '', duration: '', fee: '', facultyId: '', capacity: '' })
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCourse ? 'Edit Course' : 'Create Course'}</DialogTitle>
                <DialogDescription>
                  {editingCourse ? 'Update course details' : 'Add a new course to the system'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 12 weeks"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>
                  {editingCourse ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(course._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{course.description}</CardDescription>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>₹{course.fee}</span>
                  </div>
                  {course.facultyId && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{course.facultyId?.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolledCount || 0} / {course.capacity || 50} enrolled</span>
                  </div>
                </div>
                {user?.role === 'student' && course.isActive && (course.enrolledCount || 0) < (course.capacity || 50) && (
                  <Button
                    className="w-full"
                    onClick={() => handleEnroll(course._id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Enroll Now
                  </Button>
                )}
                {user?.role === 'student' && (!course.isActive || (course.enrolledCount || 0) >= (course.capacity || 50)) && (
                  <Button className="w-full" disabled variant="secondary">
                    {!course.isActive ? 'Not Available' : 'Course Full'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

