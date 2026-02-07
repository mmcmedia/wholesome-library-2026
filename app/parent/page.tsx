'use client'

import React, { useState } from 'react'
import { BookOpen, Clock, TrendingUp, Settings, User, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function ParentDashboardPage() {
  const [includeFantasy, setIncludeFantasy] = useState(true)
  const [includeMildConflict, setIncludeMildConflict] = useState(true)
  const [includeFaithThemes, setIncludeFaithThemes] = useState(false)

  // Mock data - will be replaced with real data from tRPC
  const mockChildren = [
    { id: '1', name: 'Emma', readingLevel: 'independent', storiesRead: 12, minutesRead: 240 },
    { id: '2', name: 'Noah', readingLevel: 'early', storiesRead: 8, minutesRead: 150 },
  ]

  const [selectedChild, setSelectedChild] = useState(mockChildren[0])

  const recentStories = [
    { title: 'The Brave Little Lighthouse', completedAt: '2 days ago', level: 'early' },
    { title: 'The Secret Garden Club', completedAt: '4 days ago', level: 'independent' },
    { title: 'Luna\'s Lunar Laboratory', completedAt: '1 week ago', level: 'confident' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal/5 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-2">
            Parent Dashboard
          </h1>
          <p className="text-charcoal/70">
            Manage your family's reading experience
          </p>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="activity">Reading Activity</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Reading Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            {/* Child Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Select Child</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-wrap">
                  {mockChildren.map((child) => (
                    <Button
                      key={child.id}
                      variant={selectedChild.id === child.id ? 'default' : 'outline'}
                      onClick={() => setSelectedChild(child)}
                      className={selectedChild.id === child.id ? 'bg-teal hover:bg-teal/90' : ''}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {child.name}
                    </Button>
                  ))}
                  <Button variant="outline" className="border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Child
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stories Read</CardTitle>
                  <BookOpen className="h-4 w-4 text-teal" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal">{selectedChild.storiesRead}</div>
                  <p className="text-xs text-charcoal/60 mt-1">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
                  <Clock className="h-4 w-4 text-teal" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal">{selectedChild.minutesRead}</div>
                  <p className="text-xs text-charcoal/60 mt-1">Minutes this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reading Level</CardTitle>
                  <TrendingUp className="h-4 w-4 text-teal" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-teal capitalize">{selectedChild.readingLevel}</div>
                  <p className="text-xs text-charcoal/60 mt-1">On track</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Stories */}
            <Card>
              <CardHeader>
                <CardTitle>Recently Read</CardTitle>
                <CardDescription>Stories {selectedChild.name} has completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStories.map((story, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-charcoal/5 transition-colors">
                      <div>
                        <div className="font-medium text-charcoal">{story.title}</div>
                        <div className="text-sm text-charcoal/60">{story.completedAt}</div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {story.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Filters for {selectedChild.name}</CardTitle>
                <CardDescription>
                  Control what themes and content types appear in the library
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="fantasy">Fantasy & Magic Elements</Label>
                    <p className="text-sm text-charcoal/60">
                      Stories with wizards, spells, enchantments, and magical creatures
                    </p>
                  </div>
                  <Switch
                    id="fantasy"
                    checked={includeFantasy}
                    onCheckedChange={setIncludeFantasy}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="conflict">Mild Conflict & Tension</Label>
                    <p className="text-sm text-charcoal/60">
                      Age-appropriate challenges, disagreements, and mild suspense
                    </p>
                  </div>
                  <Switch
                    id="conflict"
                    checked={includeMildConflict}
                    onCheckedChange={setIncludeMildConflict}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="faith">Faith Themes</Label>
                    <p className="text-sm text-charcoal/60">
                      Stories with prayer, references to God, or faith-based virtues
                    </p>
                  </div>
                  <Switch
                    id="faith"
                    checked={includeFaithThemes}
                    onCheckedChange={setIncludeFaithThemes}
                  />
                </div>

                <Button className="w-full bg-teal hover:bg-teal/90 text-white">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-charcoal/70 mt-1">parent@example.com</p>
                </div>
                <div>
                  <Label>Plan</Label>
                  <p className="text-sm text-charcoal/70 mt-1">Family Monthly ($7.99/month)</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upgrade to Annual & Save 37%
                  </Button>
                </div>
                <div>
                  <Label>Subscription</Label>
                  <p className="text-sm text-charcoal/70 mt-1">Trial ends in 5 days</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Manage Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
