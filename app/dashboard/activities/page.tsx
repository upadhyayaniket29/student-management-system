'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { activityAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity as ActivityIcon, User, Clock, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ action: '', hours: 24 })

  useEffect(() => {
    fetchActivities()
    fetchStats()
  }, [filter])

  const fetchActivities = async () => {
    try {
      const response = await activityAPI.getRecent(filter.hours)
      setActivities(response.data)
    } catch (error) {
      toast.error('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await activityAPI.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load stats')
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
        return '🔐'
      case 'profile_update':
        return '✏️'
      case 'course_enroll':
        return '📚'
      case 'fee_payment':
        return '💳'
      case 'suggestion_submit':
        return '💡'
      default:
        return '📋'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
        return 'bg-blue-500'
      case 'profile_update':
        return 'bg-green-500'
      case 'course_enroll':
        return 'bg-purple-500'
      case 'fee_payment':
        return 'bg-yellow-500'
      case 'suggestion_submit':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Activities</h1>
          <p className="text-muted-foreground">Monitor real-time student activities</p>
        </div>
        <div className="flex gap-2">
          <Select value={filter.hours.toString()} onValueChange={(value) => setFilter({ ...filter, hours: parseInt(value) })}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last Hour</SelectItem>
              <SelectItem value="24">Last 24 Hours</SelectItem>
              <SelectItem value="168">Last Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalActivities}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayActivities}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {activities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ActivityIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No activities found</p>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getActionColor(activity.action)} text-white`}>
                      <span className="text-lg">{getActionIcon(activity.action)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{activity.userId?.name}</span>
                        <Badge variant="outline">{activity.userId?.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(activity.createdAt).toLocaleString()}</span>
                        </div>
                        <Badge variant="secondary">{activity.action}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
