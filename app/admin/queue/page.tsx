'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AdminQueuePage() {
  const router = useRouter()
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterScore, setFilterScore] = useState('all')

  // Mock data - will be replaced with real tRPC query
  const mockQueue = [
    {
      id: '1',
      title: 'The Magical Paintbrush',
      readingLevel: 'independent',
      genre: 'Fantasy',
      qualityScore: 92,
      safetyPassed: true,
      valuesScore: 88,
      createdAt: '2 hours ago',
    },
    {
      id: '2',
      title: 'Robotics Club Champion',
      readingLevel: 'confident',
      genre: 'Science Fiction',
      qualityScore: 78,
      safetyPassed: true,
      valuesScore: 85,
      createdAt: '4 hours ago',
    },
    {
      id: '3',
      title: 'The Haunted Playground',
      readingLevel: 'early',
      genre: 'Mystery',
      qualityScore: 85,
      safetyPassed: false,
      valuesScore: 72,
      createdAt: '6 hours ago',
    },
  ]

  const stats = {
    queueDepth: mockQueue.length,
    avgPassRate: 87,
    reviewedToday: 8,
    avgReviewTime: 5,
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-700 border-green-200'
    if (score >= 70) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal/5 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-2">
            Review Queue
          </h1>
          <p className="text-charcoal/70">
            Stories pending human review
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queue Depth</CardTitle>
              <Clock className="h-4 w-4 text-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal">{stats.queueDepth}</div>
              <p className="text-xs text-charcoal/60 mt-1">Stories waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.avgPassRate}%</div>
              <p className="text-xs text-charcoal/60 mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviewed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal">{stats.reviewedToday}</div>
              <p className="text-xs text-charcoal/60 mt-1">Stories approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Review Time</CardTitle>
              <Clock className="h-4 w-4 text-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal">{stats.avgReviewTime}</div>
              <p className="text-xs text-charcoal/60 mt-1">Minutes per story</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Reading Level
                </label>
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="early">Early Reader</SelectItem>
                    <SelectItem value="independent">Independent</SelectItem>
                    <SelectItem value="confident">Confident</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Quality Score
                </label>
                <Select value={filterScore} onValueChange={setFilterScore}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scores</SelectItem>
                    <SelectItem value="high">90+ (Skim Review)</SelectItem>
                    <SelectItem value="medium">80-89 (Spot Check)</SelectItem>
                    <SelectItem value="low">70-79 (Full Review)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queue List */}
        <div className="space-y-4">
          {mockQueue.map((story) => (
            <Card
              key={story.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/admin/review/${story.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-charcoal">{story.title}</h3>
                      {!story.safetyPassed && (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="capitalize">
                        {story.readingLevel}
                      </Badge>
                      <Badge variant="outline">{story.genre}</Badge>
                      <Badge className={getScoreBadge(story.qualityScore)}>
                        Quality: {story.qualityScore}
                      </Badge>
                      <Badge className={getScoreBadge(story.valuesScore)}>
                        Values: {story.valuesScore}
                      </Badge>
                      {story.safetyPassed ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Safety Passed
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border-red-200">
                          <XCircle className="h-3 w-3 mr-1" />
                          Safety Failed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-charcoal/60">
                      Generated {story.createdAt}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/admin/review/${story.id}`)
                      }}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
