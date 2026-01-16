'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { announcementAPI, authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, Plus, Edit, Trash2 } from 'lucide-react'
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

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null)
  const [formData, setFormData] = useState({ title: '', content: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsRes, userRes] = await Promise.all([
          announcementAPI.getAll(),
          authAPI.getMe(),
        ])
        setAnnouncements(announcementsRes.data)
        setUser(userRes.data)
      } catch (error) {
        toast.error('Failed to load announcements')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreate = async () => {
    try {
      if (editingAnnouncement) {
        await announcementAPI.update(editingAnnouncement._id, formData)
        toast.success('Announcement updated successfully!')
      } else {
        await announcementAPI.create(formData)
        toast.success('Announcement created successfully!')
      }
      const response = await announcementAPI.getAll()
      setAnnouncements(response.data)
      setDialogOpen(false)
      setEditingAnnouncement(null)
      setFormData({ title: '', content: '' })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save announcement')
    }
  }

  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement)
    setFormData({ title: announcement.title, content: announcement.content })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    try {
      await announcementAPI.delete(id)
      toast.success('Announcement deleted successfully!')
      const response = await announcementAPI.getAll()
      setAnnouncements(response.data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete announcement')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">View and manage announcements</p>
        </div>
        {user?.role === 'admin' && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingAnnouncement(null)
                setFormData({ title: '', content: '' })
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
                <DialogDescription>
                  {editingAnnouncement ? 'Update announcement details' : 'Create a new announcement'}
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
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={5}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>
                  {editingAnnouncement ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No announcements yet</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement, index) => (
            <motion.div
              key={announcement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{announcement.title}</CardTitle>
                        <CardDescription>
                          By {announcement.createdBy?.name} • {new Date(announcement.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(announcement)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(announcement._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
