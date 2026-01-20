'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { facultyAPI, authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { GraduationCap, Mail, Phone, Plus, Pencil, Trash2 } from 'lucide-react'
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

export default function FacultiesPage() {
  const [faculties, setFaculties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'admin' | 'student'>('student')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    specialization: '',
    phone: ''
  })

  useEffect(() => {
    fetchUserAndFaculties()
  }, [])

  const fetchUserAndFaculties = async () => {
    try {
      // Get user role first
      const userResponse = await authAPI.getMe()
      const role = userResponse.data.role
      setUserRole(role)

      // Fetch faculties
      const response = await facultyAPI.getAll()
      setFaculties(response.data.filter((f: any) => f.isActive))
    } catch (error) {
      toast.error('Failed to load faculties')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.department) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      if (editingFaculty) {
        await facultyAPI.update(editingFaculty._id, formData)
        toast.success('Faculty updated successfully!')
      } else {
        await facultyAPI.create(formData)
        toast.success('Faculty added successfully!')
      }
      setDialogOpen(false)
      setEditingFaculty(null)
      setFormData({ name: '', email: '', department: '', specialization: '', phone: '' })
      fetchUserAndFaculties()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save faculty')
    }
  }

  const handleEdit = (faculty: any) => {
    setEditingFaculty(faculty)
    setFormData({
      name: faculty.name,
      email: faculty.email,
      department: faculty.department,
      specialization: faculty.specialization || '',
      phone: faculty.phone || ''
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return

    try {
      await facultyAPI.delete(id)
      toast.success('Faculty deleted successfully!')
      fetchUserAndFaculties()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete faculty')
    }
  }

  const openAddDialog = () => {
    setEditingFaculty(null)
    setFormData({ name: '', email: '', department: '', specialization: '', phone: '' })
    setDialogOpen(true)
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
          <h1 className="text-3xl font-bold tracking-tight">Faculties</h1>
          <p className="text-muted-foreground">
            {userRole === 'admin' ? 'Manage faculty members' : 'Meet our experienced faculty members'}
          </p>
        </div>
        {userRole === 'admin' && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Faculty
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingFaculty ? 'Edit Faculty' : 'Add Faculty'}</DialogTitle>
                <DialogDescription>
                  {editingFaculty ? 'Update faculty member information' : 'Add a new faculty member to the system'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter faculty name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Enter department"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Enter specialization"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingFaculty ? 'Update' : 'Add'} Faculty
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {faculties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No faculties available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {faculties.map((faculty, index) => (
            <motion.div
              key={faculty._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{faculty.name}</CardTitle>
                        <CardDescription>{faculty.department}</CardDescription>
                      </div>
                    </div>
                    {userRole === 'admin' && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(faculty)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(faculty._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {faculty.specialization && (
                      <div className="text-sm">
                        <span className="font-medium">Specialization: </span>
                        <span className="text-muted-foreground">{faculty.specialization}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{faculty.email}</span>
                    </div>
                    {faculty.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{faculty.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
