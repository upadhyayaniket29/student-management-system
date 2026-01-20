'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { studentAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, UserCheck, UserX, Eye, Mail, Calendar, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll()
      setStudents(response.data)
    } catch (error) {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (studentId: string, currentStatus: boolean) => {
    try {
      await studentAPI.updateStatus(studentId, !currentStatus)
      toast.success(`Student ${!currentStatus ? 'enabled' : 'disabled'} successfully!`)
      fetchStudents()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student)
    setDialogOpen(true)
  }

  const getProfilePictureUrl = (profilePicture: string | null) => {
    if (profilePicture) {
      return `http://localhost:5000${profilePicture}`
    }
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">Manage all registered students</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students.map((student, index) => (
          <motion.div
            key={student._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getProfilePictureUrl(student.profilePicture) ? (
                      <img
                        src={getProfilePictureUrl(student.profilePicture)!}
                        alt={student.name}
                        className="h-10 w-10 rounded-full object-cover border-2 border-primary/10"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={student.isActive ? 'default' : 'secondary'}>
                      {student.isActive ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewDetails(student)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button
                      variant={student.isActive ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleStatus(student._id, student.isActive)}
                    >
                      {student.isActive ? (
                        <>
                          <UserX className="mr-2 h-4 w-4" />
                          Disable
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Enable
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Student Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>View complete student information</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                {getProfilePictureUrl(selectedStudent.profilePicture) ? (
                  <img
                    src={getProfilePictureUrl(selectedStudent.profilePicture)!}
                    alt={selectedStudent.name}
                    className="h-24 w-24 rounded-full object-cover border-4 border-primary/10"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 border-4 border-primary/20">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                  <Badge variant={selectedStudent.isActive ? 'default' : 'secondary'} className="mt-2">
                    {selectedStudent.isActive ? 'Active' : 'Disabled'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Role</p>
                    <p className="text-sm text-muted-foreground capitalize">{selectedStudent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedStudent.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant={selectedStudent.isActive ? 'destructive' : 'default'}
                  className="flex-1"
                  onClick={() => {
                    handleToggleStatus(selectedStudent._id, selectedStudent.isActive)
                    setDialogOpen(false)
                  }}
                >
                  {selectedStudent.isActive ? (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      Disable Student
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Enable Student
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
