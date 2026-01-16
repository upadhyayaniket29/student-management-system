'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { feeAPI, authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign, CreditCard, Calendar, CheckCircle, AlertCircle, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export default function FeesPage() {
  const [fees, setFees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [selectedFee, setSelectedFee] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [userRole, setUserRole] = useState<'admin' | 'student'>('student')

  useEffect(() => {
    fetchUserAndFees()
  }, [])

  const fetchUserAndFees = async () => {
    try {
      // Get user role first
      const userResponse = await authAPI.getMe()
      const role = userResponse.data.role
      setUserRole(role)

      // Fetch fees based on role
      if (role === 'admin') {
        const response = await feeAPI.getAll()
        setFees(response.data)
      } else {
        const response = await feeAPI.getStudentFees()
        setFees(response.data)
      }
    } catch (error) {
      toast.error('Failed to load fees')
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    try {
      await feeAPI.pay(selectedFee._id, {
        paymentMethod,
        transactionId: transactionId || undefined,
      })
      toast.success('Fee paid successfully!')
      setPayDialogOpen(false)
      setSelectedFee(null)
      setPaymentMethod('')
      setTransactionId('')
      fetchUserAndFees()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process payment')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" />Paid</Badge>
      case 'pending':
        return <Badge variant="secondary"><AlertCircle className="mr-1 h-3 w-3" />Pending</Badge>
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>
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

  // Admin View - Table/List Format
  if (userRole === 'admin') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
          <p className="text-muted-foreground">View and manage all student fee payments</p>
        </div>

        {fees.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No fee records found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {fees.map((fee, index) => (
              <motion.div
                key={fee._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{fee.courseId?.title}</CardTitle>
                          {getStatusBadge(fee.status)}
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{fee.studentId?.name}</span>
                          <span>({fee.studentId?.email})</span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">₹{fee.amount}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {new Date(fee.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {fee.paymentDate && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">
                              {new Date(fee.paymentDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                      {fee.paymentMethod && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span className="text-sm font-medium capitalize">
                              {fee.paymentMethod.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      )}
                      {fee.transactionId && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                          <span className="text-sm font-medium font-mono">{fee.transactionId}</span>
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

  // Student View - Card Grid with Pay Functionality
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fees & Payments</h1>
        <p className="text-muted-foreground">View and pay your course fees</p>
      </div>

      {fees.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No fees found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fees.map((fee, index) => (
            <motion.div
              key={fee._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{fee.courseId?.title}</CardTitle>
                    {getStatusBadge(fee.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <span className="text-lg font-bold">₹{fee.amount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(fee.dueDate).toLocaleDateString()}</span>
                    </div>
                    {fee.paymentDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4" />
                        <span>Paid: {new Date(fee.paymentDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {fee.status === 'pending' && (
                      <Dialog open={payDialogOpen && selectedFee?._id === fee._id} onOpenChange={(open) => {
                        setPayDialogOpen(open)
                        if (!open) {
                          setSelectedFee(null)
                          setPaymentMethod('')
                          setTransactionId('')
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full"
                            onClick={() => setSelectedFee(fee)}
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Pay Fee</DialogTitle>
                            <DialogDescription>
                              Pay fee for {fee.courseId?.title}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Amount</Label>
                              <Input value={`₹${fee.amount}`} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="paymentMethod">Payment Method</Label>
                              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cash">Cash</SelectItem>
                                  <SelectItem value="card">Card</SelectItem>
                                  <SelectItem value="online">Online</SelectItem>
                                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                              <Input
                                id="transactionId"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Enter transaction ID if applicable"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setPayDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handlePay}>Pay ₹{fee.amount}</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
