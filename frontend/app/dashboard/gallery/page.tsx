'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { galleryAPI, authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Image as ImageIcon, Plus, Trash2, Edit, Upload, Link as LinkIcon } from 'lucide-react'
import Image from 'next/image'
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

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<any>(null)

  // Upload states
  const [uploadTab, setUploadTab] = useState('file')
  const [imageUrl, setImageUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Edit states
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imagesRes, userRes] = await Promise.all([
          galleryAPI.getAll(),
          authAPI.getMe(),
        ])
        setImages(imagesRes.data)
        setUser(userRes.data)
      } catch (error) {
        toast.error('Failed to load gallery')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (uploadTab === 'url') {
      if (!imageUrl.trim()) {
        toast.error('Please enter an image URL')
        return
      }

      setUploading(true)
      try {
        await galleryAPI.upload(imageUrl, title, description)
        toast.success('Image uploaded successfully!')
        const response = await galleryAPI.getAll()
        setImages(response.data)
        resetUploadForm()
        setUploadDialogOpen(false)
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to upload image')
      } finally {
        setUploading(false)
      }
    } else {
      if (!selectedFile) {
        toast.error('Please select an image file')
        return
      }

      setUploading(true)
      const formData = new FormData()
      formData.append('image', selectedFile)
      if (title) formData.append('title', title)
      if (description) formData.append('description', description)

      try {
        await galleryAPI.uploadFile(formData)
        toast.success('Image uploaded successfully!')
        const response = await galleryAPI.getAll()
        setImages(response.data)
        resetUploadForm()
        setUploadDialogOpen(false)
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to upload image')
      } finally {
        setUploading(false)
      }
    }
  }

  const handleEdit = (image: any) => {
    setSelectedImage(image)
    setEditTitle(image.title || '')
    setEditDescription(image.description || '')
    setEditImageUrl(image.imageUrl || '')
    setEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedImage) return

    setUpdating(true)
    try {
      await galleryAPI.update(selectedImage._id, {
        title: editTitle,
        description: editDescription,
        imageUrl: editImageUrl,
      })
      toast.success('Image updated successfully!')
      const response = await galleryAPI.getAll()
      setImages(response.data)
      setEditDialogOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update image')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      await galleryAPI.delete(id)
      toast.success('Image deleted successfully!')
      const response = await galleryAPI.getAll()
      setImages(response.data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete image')
    }
  }

  const resetUploadForm = () => {
    setImageUrl('')
    setTitle('')
    setDescription('')
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadTab('file')
  }

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl
    }
    return `http://localhost:5000${imageUrl}`
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
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">View institute gallery images</p>
        </div>
        {user?.role === 'admin' && (
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetUploadForm}>
                <Plus className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Image</DialogTitle>
                <DialogDescription>
                  Upload an image from your device or provide a URL
                </DialogDescription>
              </DialogHeader>

              <Tabs value={uploadTab} onValueChange={setUploadTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </TabsTrigger>
                  <TabsTrigger value="url">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Image URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Image</Label>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {selectedFile ? selectedFile.name : 'Choose Image'}
                      </Button>
                    </div>
                    {previewUrl && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fileTitle">Title (Optional)</Label>
                    <Input
                      id="fileTitle"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter image title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fileDescription">Description (Optional)</Label>
                    <Textarea
                      id="fileDescription"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter image description"
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urlTitle">Title (Optional)</Label>
                    <Input
                      id="urlTitle"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter image title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urlDescription">Description (Optional)</Label>
                    <Textarea
                      id="urlDescription"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter image description"
                      rows={3}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No images in gallery</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <motion.div
              key={image._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-video w-full">
                  <Image
                    src={getImageUrl(image.imageUrl)}
                    alt={image.title || 'Gallery image'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {user?.role === 'admin' && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleEdit(image)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(image._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardHeader>
                  {image.title && (
                    <CardTitle className="text-base">{image.title}</CardTitle>
                  )}
                  {image.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {image.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Uploaded {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>
              Update image details and information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src={getImageUrl(editImageUrl)}
                alt={editTitle || 'Gallery image'}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editTitle">Title</Label>
              <Input
                id="editTitle"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter image title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter image description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editImageUrl">Image URL (Optional - to replace image)</Label>
              <Input
                id="editImageUrl"
                type="url"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="https://example.com/new-image.jpg"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updating}>
              {updating ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
