import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Brain, Users, TrendingUp, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold text-foreground">Welcome to AgentHub</h1>
        <p className="font-body text-muted-foreground text-lg">Manage your AI agents and knowledge bases with ease</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-body text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-bold">12</div>
            <p className="font-body text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-body text-sm font-medium">Knowledge Items</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-bold">1,247</div>
            <p className="font-body text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-body text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-bold">8</div>
            <p className="font-body text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-body text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-bold">94.2%</div>
            <p className="font-body text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">Quick Actions</CardTitle>
            <CardDescription className="font-body">Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start gap-3 h-12 font-body bg-transparent" variant="outline">
              <Bot className="w-5 h-5" />
              Create New Agent
            </Button>
            <Button className="w-full justify-start gap-3 h-12 font-body bg-transparent" variant="outline">
              <FileText className="w-5 h-5" />
              Upload Knowledge Base
            </Button>
            <Button className="w-full justify-start gap-3 h-12 font-body bg-transparent" variant="outline">
              <Users className="w-5 h-5" />
              Invite Team Member
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">Recent Activity</CardTitle>
            <CardDescription className="font-body">Latest updates from your agents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="font-body text-sm font-medium">Customer Support Agent updated</p>
                <p className="font-body text-xs text-muted-foreground">2 minutes ago</p>
              </div>
              <Badge variant="secondary" className="font-body">
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <div className="flex-1">
                <p className="font-body text-sm font-medium">New knowledge base uploaded</p>
                <p className="font-body text-xs text-muted-foreground">1 hour ago</p>
              </div>
              <Badge variant="outline" className="font-body">
                Processing
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-body text-sm font-medium">Sales Agent training completed</p>
                <p className="font-body text-xs text-muted-foreground">3 hours ago</p>
              </div>
              <Badge variant="secondary" className="font-body">
                Complete
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">Agent Status Overview</CardTitle>
          <CardDescription className="font-body">Monitor the health and performance of your AI agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-body font-medium">8 Active</p>
                <p className="font-body text-sm text-muted-foreground">Running smoothly</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
              <Clock className="w-8 h-8 text-accent" />
              <div>
                <p className="font-body font-medium">3 Training</p>
                <p className="font-body text-sm text-muted-foreground">Learning new data</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div>
                <p className="font-body font-medium">1 Needs Attention</p>
                <p className="font-body text-sm text-muted-foreground">Requires review</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
