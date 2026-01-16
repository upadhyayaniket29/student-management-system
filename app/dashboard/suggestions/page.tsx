'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { suggestionAPI, authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare, Plus, Trash2, Reply } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [responseDialogOpen, setResponseDialogOpen] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null)
  const [userRole, setUserRole] = useState<'admin' | 'student'>('student')
  const [formData, setFormData] = useState({ title: '', content: '', category: 'other' })
  const [responseData, setResponseData] = useState({ status: '', adminResponse: '' })

  useEffect(() => {
    fetchUserAndSuggestions()
  }, [])

  const fetchUserAndSuggestions = async () => {
    try {
      // Get user role first
      const userResponse = await authAPI.getMe()
      const role = userResponse.data.role
      setUserRole(role)

      // Fetch suggestions based on role
      if (role === 'admin') {
        const response = await suggestionAPI.getAll()
        setSuggestions(response.data)
      } else {
        const response = await suggestionAPI.getStudentSuggestions()
        setSuggestions(response.data)
      }
    } catch (error) {
      toast.error('Failed to load suggestions')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Please fill all fields')
      return
    }

    try {
      await suggestionAPI.create(formData)
      toast.success('Suggestion submitted successfully!')
      setDialogOpen(false)
      setFormData({ title: '', content: '', category: 'other' })
      fetchUserAndSuggestions()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit suggestion')
    }
  }

  const handleAdminResponse = async () => {
    if (!selectedSuggestion) return

    try {
      await suggestionAPI.updateStatus(selectedSuggestion._id, responseData)
      toast.success('Response submitted successfully!')
      setResponseDialogOpen(false)
      setSelectedSuggestion(null)
      setResponseData({ status: '', adminResponse: '' })
      fetchUserAndSuggestions()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit response')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this suggestion?')) return

    try {
      await suggestionAPI.delete(id)
      toast.success('Suggestion deleted successfully!')
      fetchUserAndSuggestions()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete suggestion')
    }
  }

  const openResponseDialog = (suggestion: any) => {
    setSelectedSuggestion(suggestion)
    setResponseData({
      status: suggestion.status || 'pending',
      adminResponse: suggestion.adminResponse || ''
    })
    setResponseDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'reviewed':
        return <Badge>Reviewed</Badge>
      case 'implemented':
        return <Badge className="bg-green-500">Implemented</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
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
          <h1 className="text-3xl font-bold tracking-tight">
            {userRole === 'admin' ? 'Student Suggestions' : 'Suggestions'}
          </h1>
          <p className="text-muted-foreground">
            {userRole === 'admin'
              ? 'Review and respond to student feedback'
              : 'Share your feedback and suggestions'}
          </p>
        </div>
        {userRole === 'student' && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData({ title: '', content: '', category: 'other' })}>
                <Plus className="mr-2 h-4 w-4" />
                Submit Suggestion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Suggestion</DialogTitle>
                <DialogDescription>
                  Share your feedback to help us improve
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
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="facilities">Facilities</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Button onClick={handleSubmit}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Admin Response Dialog */}
      {userRole === 'admin' && (
        <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Respond to Suggestion</DialogTitle>
              <DialogDescription>
                Update status and provide feedback to the student
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={responseData.status} onValueChange={(value) => setResponseData({ ...responseData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="implemented">Implemented</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminResponse">Response</Label>
                <Textarea
                  id="adminResponse"
                  value={responseData.adminResponse}
                  onChange={(e) => setResponseData({ ...responseData, adminResponse: e.target.value })}
                  rows={5}
                  placeholder="Provide feedback to the student..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdminResponse}>Submit Response</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {suggestions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {userRole === 'admin' ? 'No suggestions submitted yet' : 'No suggestions yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{suggestion.title}</CardTitle>
                        {getStatusBadge(suggestion.status)}
                      </div>
                      <CardDescription>
                        {suggestion.category} • {new Date(suggestion.createdAt).toLocaleDateString()}
                        {userRole === 'admin' && suggestion.studentId && (
                          <span className="ml-2">
                            • Submitted by: <span className="font-medium">{suggestion.studentId.name}</span> ({suggestion.studentId.email})
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {userRole === 'admin' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openResponseDialog(suggestion)}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                      )}
                      {userRole === 'student' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(suggestion._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{suggestion.content}</p>
                  {suggestion.adminResponse && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Admin Response:</p>
                      <p className="text-sm text-muted-foreground">{suggestion.adminResponse}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
