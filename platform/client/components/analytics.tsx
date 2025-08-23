"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Bot,
  Activity,
} from "lucide-react"

// Mock data for analytics
const conversationData = [
  { name: "Mon", conversations: 120, successful: 108, failed: 12 },
  { name: "Tue", conversations: 145, successful: 132, failed: 13 },
  { name: "Wed", conversations: 167, successful: 156, failed: 11 },
  { name: "Thu", conversations: 189, successful: 175, failed: 14 },
  { name: "Fri", conversations: 203, successful: 192, failed: 11 },
  { name: "Sat", conversations: 156, successful: 145, failed: 11 },
  { name: "Sun", conversations: 134, successful: 125, failed: 9 },
]

const agentPerformanceData = [
  { name: "Customer Support", conversations: 1247, successRate: 94.2, avgResponseTime: 2.3 },
  { name: "Sales Assistant", conversations: 892, successRate: 91.8, avgResponseTime: 1.8 },
  { name: "Technical Support", conversations: 634, successRate: 88.5, avgResponseTime: 3.1 },
  { name: "HR Assistant", conversations: 423, successRate: 96.1, avgResponseTime: 2.1 },
  { name: "Product Expert", conversations: 756, successRate: 92.7, avgResponseTime: 2.7 },
  { name: "Billing Support", conversations: 567, successRate: 85.3, avgResponseTime: 3.4 },
]

const responseTimeData = [
  { time: "00:00", avgTime: 2.1 },
  { time: "04:00", avgTime: 1.8 },
  { time: "08:00", avgTime: 2.4 },
  { time: "12:00", avgTime: 3.2 },
  { time: "16:00", avgTime: 2.8 },
  { time: "20:00", avgTime: 2.3 },
]

const topicsData = [
  { name: "Billing", value: 35, color: "#d97706" },
  { name: "Technical", value: 28, color: "#f59e0b" },
  { name: "Product Info", value: 22, color: "#fbbf24" },
  { name: "Account", value: 15, color: "#fcd34d" },
]

const satisfactionData = [
  { name: "Very Satisfied", value: 45, color: "#10b981" },
  { name: "Satisfied", value: 32, color: "#34d399" },
  { name: "Neutral", value: 15, color: "#fbbf24" },
  { name: "Dissatisfied", value: 8, color: "#f87171" },
]

export function Analytics() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedAgent, setSelectedAgent] = useState("all")

  const totalConversations = conversationData.reduce((sum, day) => sum + day.conversations, 0)
  const totalSuccessful = conversationData.reduce((sum, day) => sum + day.successful, 0)
  const totalFailed = conversationData.reduce((sum, day) => sum + day.failed, 0)
  const avgSuccessRate = ((totalSuccessful / totalConversations) * 100).toFixed(1)
  const avgResponseTime = 2.4

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Analytics & Monitoring</h1>
          <p className="font-body text-muted-foreground">Monitor your agents' performance and user interactions</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h" className="font-body">
                Last 24h
              </SelectItem>
              <SelectItem value="7d" className="font-body">
                Last 7 days
              </SelectItem>
              <SelectItem value="30d" className="font-body">
                Last 30 days
              </SelectItem>
              <SelectItem value="90d" className="font-body">
                Last 90 days
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 font-body bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-medium text-muted-foreground">Total Conversations</p>
                <p className="font-heading text-2xl font-bold">{totalConversations.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-body text-sm text-green-500">+12.5%</span>
                </div>
              </div>
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="font-heading text-2xl font-bold">{avgSuccessRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-body text-sm text-green-500">+2.1%</span>
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="font-heading text-2xl font-bold">{avgResponseTime}s</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <span className="font-body text-sm text-green-500">-0.3s</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-medium text-muted-foreground">Active Agents</p>
                <p className="font-heading text-2xl font-bold">6</p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="font-body text-sm text-muted-foreground">All systems operational</span>
                </div>
              </div>
              <Bot className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="font-body">
            Overview
          </TabsTrigger>
          <TabsTrigger value="agents" className="font-body">
            Agent Performance
          </TabsTrigger>
          <TabsTrigger value="conversations" className="font-body">
            Conversations
          </TabsTrigger>
          <TabsTrigger value="insights" className="font-body">
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Conversation Trends</CardTitle>
                <CardDescription className="font-body">Daily conversation volume and success rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={conversationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" className="font-body" />
                    <YAxis className="font-body" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="conversations"
                      stackId="1"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Response Time Trends</CardTitle>
                <CardDescription className="font-body">Average response time throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" className="font-body" />
                    <YAxis className="font-body" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgTime"
                      stroke="hsl(var(--accent))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--accent))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Top Conversation Topics</CardTitle>
                <CardDescription className="font-body">Most common topics discussed with agents</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={topicsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {topicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Customer Satisfaction</CardTitle>
                <CardDescription className="font-body">User satisfaction ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {satisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Agent Performance Comparison</CardTitle>
              <CardDescription className="font-body">Compare performance metrics across all agents</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={agentPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" className="font-body" angle={-45} textAnchor="end" height={100} />
                  <YAxis className="font-body" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="conversations" fill="hsl(var(--primary))" name="Conversations" />
                  <Bar dataKey="successRate" fill="hsl(var(--accent))" name="Success Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agentPerformanceData.map((agent, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="font-heading text-lg">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-muted-foreground">Conversations</span>
                    <span className="font-body font-semibold">{agent.conversations.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-muted-foreground">Success Rate</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{agent.successRate}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-muted-foreground">Avg Response Time</span>
                    <span className="font-body font-semibold">{agent.avgResponseTime}s</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Conversation Volume</CardTitle>
              <CardDescription className="font-body">
                Daily conversation trends with success/failure breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={conversationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" className="font-body" />
                  <YAxis className="font-body" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="successful" stackId="a" fill="hsl(var(--primary))" name="Successful" />
                  <Bar dataKey="failed" stackId="a" fill="hsl(var(--destructive))" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-heading font-semibold text-lg">{totalSuccessful.toLocaleString()}</p>
                    <p className="font-body text-sm text-muted-foreground">Successful Conversations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                  <div>
                    <p className="font-heading font-semibold text-lg">{totalFailed.toLocaleString()}</p>
                    <p className="font-body text-sm text-muted-foreground">Failed Conversations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-heading font-semibold text-lg">{avgSuccessRate}%</p>
                    <p className="font-body text-sm text-muted-foreground">Overall Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Key Insights</CardTitle>
                <CardDescription className="font-body">AI-generated insights from your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-body font-semibold text-green-800">Performance Improvement</h4>
                      <p className="font-body text-sm text-green-700 mt-1">
                        Customer Support Agent shows 12% improvement in response time over the last week.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-body font-semibold text-amber-800">Attention Needed</h4>
                      <p className="font-body text-sm text-amber-700 mt-1">
                        Billing Support Agent has higher than average failure rate. Consider additional training.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-body font-semibold text-blue-800">Peak Hours</h4>
                      <p className="font-body text-sm text-blue-700 mt-1">
                        Highest conversation volume occurs between 12-4 PM. Consider scaling resources.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Recommendations</CardTitle>
                <CardDescription className="font-body">Suggested actions to improve performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-body font-semibold">Optimize Knowledge Base</h4>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    Add more billing-related content to improve Billing Support Agent performance.
                  </p>
                  <Button size="sm" className="mt-2 font-body">
                    Add Content
                  </Button>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-body font-semibold">Scale During Peak Hours</h4>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    Consider auto-scaling or additional agents during 12-4 PM peak hours.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 font-body bg-transparent">
                    Configure Scaling
                  </Button>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-body font-semibold">Monitor Response Times</h4>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    Set up alerts for response times exceeding 5 seconds.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 font-body bg-transparent">
                    Set Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
