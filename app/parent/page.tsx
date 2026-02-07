'use client'

import React, { useState } from 'react'
import { BookOpen, Clock, TrendingUp, Settings, User, Plus, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/ui/empty-state'
import { FadeIn } from '@/components/ui/fade-in'
import { CountUp } from '@/components/ui/count-up'

export default function ParentDashboardPage() {
  const [includeFantasy, setIncludeFantasy] = useState(true)
  const [includeMildConflict, setIncludeMildConflict] = useState(true)
  const [includeFaithThemes, setIncludeFaithThemes] = useState(false)

  // Mock data - will be replaced with real data from tRPC
  const mockChildren = [
    { id: '1', name: 'Emma', readingLevel: 'independent', storiesRead: 12, minutesRead: 240 },
    { id: '2', name: 'Noah', readingLevel: 'early', storiesRead: 8, minutesRead: 150 },
  ]

  const [selectedChild, setSelectedChild] = useState(mockChildren.length > 0 ? mockChildren[0] : null)

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
                      variant={selectedChild?.id === child.id ? 'default' : 'outline'}
                      onClick={() => setSelectedChild(child)}
                      className={selectedChild?.id === child.id ? 'bg-teal hover:bg-teal/90' : ''}
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
            {selectedChild && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FadeIn delay={100}>
                  <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Stories Read</CardTitle>
                      <BookOpen className="h-4 w-4 text-teal" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-teal">
                        <CountUp end={selectedChild!.storiesRead} duration={1000} />
                      </div>
                      <p className="text-xs text-charcoal/60 mt-1">This month</p>
                    </CardContent>
                  </Card>
                </FadeIn>

                <FadeIn delay={200}>
                  <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
                      <Clock className="h-4 w-4 text-teal" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-teal">
                        <CountUp end={selectedChild!.minutesRead} duration={1000} />
                      </div>
                      <p className="text-xs text-charcoal/60 mt-1">Minutes this month</p>
                    </CardContent>
                  </Card>
                </FadeIn>

                <FadeIn delay={300}>
                  <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Reading Level</CardTitle>
                      <TrendingUp className="h-4 w-4 text-teal" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-teal capitalize">{selectedChild!.readingLevel}</div>
                      <p className="text-xs text-charcoal/60 mt-1">On track</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            )}

            {/* Recent Stories */}
            {selectedChild && (
              <FadeIn delay={400}>
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Recently Read</CardTitle>
                    <CardDescription>Stories {selectedChild!.name} has completed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentStories.map((story, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-charcoal/5 transition-all duration-200 hover:scale-[1.02]"
                        >
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
              </FadeIn>
            )}
          </TabsContent>

          {/* Content Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Filters for {selectedChild!.name}</CardTitle>
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

            {/* Manage Subscription Section */}
            <Card className="border-amber-200/50 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="text-base">Manage Subscription</CardTitle>
                <CardDescription>
                  Pause, upgrade, or cancel your subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="/parent/pause"
                  className="block w-full px-4 py-2 text-left text-charcoal hover:bg-white rounded-lg border border-amber-200 transition-colors"
                >
                  <div className="font-medium text-sm">Take a Break</div>
                  <div className="text-xs text-charcoal/60">Pause for 1 month (no charges)</div>
                </a>

                <a
                  href="https://billing.stripe.com/p/login/test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 text-left text-charcoal hover:bg-white rounded-lg border border-charcoal/10 transition-colors"
                >
                  <div className="font-medium text-sm">Billing Portal</div>
                  <div className="text-xs text-charcoal/60">Change payment method, view invoices</div>
                </a>

                <a
                  href="/parent/cancel"
                  className="block w-full px-4 py-2 text-left text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                >
                  <div className="font-medium text-sm">Cancel Subscription</div>
                  <div className="text-xs text-red-600">Access continues until period end</div>
                </a>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
