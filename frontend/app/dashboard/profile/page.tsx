'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { studentAPI, authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { User, Camera, Upload } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await studentAPI.getProfile()
      const userData = response.data
      setUser(userData)
      setFormData({ name: userData.name, email: userData.email })
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await studentAPI.updateProfile(formData)
      const response = await authAPI.getMe()
      setUser(response.data)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUploadPicture = async () => {
    if (!selectedFile) return

    setUploading(true)
    const formData = new FormData()
    formData.append('profilePicture', selectedFile)

    try {
      await studentAPI.uploadProfilePicture(formData)

      toast.success('Profile picture uploaded successfully!')
      setSelectedFile(null)
      setPreviewUrl(null)
      fetchProfile()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload picture')
    } finally {
      setUploading(false)
    }
  }

  const getProfilePictureUrl = () => {
    if (previewUrl) return previewUrl
    if (user?.profilePicture) return `http://localhost:5000${user.profilePicture}`
    return null
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Picture Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload or change your profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  {getProfilePictureUrl() ? (
                    <img
                      src={getProfilePictureUrl()!}
                      alt="Profile"
                      className="h-32 w-32 rounded-full object-cover border-4 border-primary/10"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 border-4 border-primary/20">
                      <User className="h-16 w-16 text-primary" />
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile && (
                  <div className="w-full space-y-2">
                    <p className="text-sm text-muted-foreground text-center">
                      {selectedFile.name}
                    </p>
                    <Button
                      onClick={handleUploadPicture}
                      disabled={uploading}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Uploading...' : 'Upload Picture'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personal Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={user?.role} disabled className="bg-muted" />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
