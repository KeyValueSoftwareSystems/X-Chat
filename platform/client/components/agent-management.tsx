"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateAgentDialog } from "@/components/create-agent-dialog"
import Link from "next/link"
import {
  Bot,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Play,
  Pause,
  Settings,
  TrendingUp,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react"

// Mock data for agents
const mockAgents = [
  {
    id: "1",
    name: "Customer Support Agent",
    description: "Handles general customer inquiries and support tickets",
    status: "active",
    conversations: 1247,
    successRate: 94.2,
    lastActive: "2 minutes ago",
    knowledgeItems: 156,
    avatar: "CS",
  },
  {
    id: "2",
    name: "Sales Assistant",
    description: "Helps with product information and sales inquiries",
    status: "active",
    conversations: 892,
    successRate: 91.8,
    lastActive: "5 minutes ago",
    knowledgeItems: 89,
    avatar: "SA",
  },
  {
    id: "3",
    name: "Technical Support",
    description: "Provides technical assistance and troubleshooting",
    status: "training",
    conversations: 634,
    successRate: 88.5,
    lastActive: "1 hour ago",
    knowledgeItems: 234,
    avatar: "TS",
  },
  {
    id: "4",
    name: "HR Assistant",
    description: "Handles HR-related questions and employee support",
    status: "paused",
    conversations: 423,
    successRate: 96.1,
    lastActive: "3 hours ago",
    knowledgeItems: 67,
    avatar: "HR",
  },
  {
    id: "5",
    name: "Product Expert",
    description: "Deep product knowledge for complex inquiries",
    status: "active",
    conversations: 756,
    successRate: 92.7,
    lastActive: "10 minutes ago",
    knowledgeItems: 198,
    avatar: "PE",
  },
  {
    id: "6",
    name: "Billing Support",
    description: "Handles billing, payments, and subscription issues",
    status: "needs-attention",
    conversations: 567,
    successRate: 85.3,
    lastActive: "2 hours ago",
    knowledgeItems: 45,
    avatar: "BS",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "training":
      return "bg-accent"
    case "paused":
      return "bg-gray-500"
    case "needs-attention":
      return "bg-destructive"
    default:
      return "bg-gray-500"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    case "training":
      return <Badge variant="secondary">Training</Badge>
    case "paused":
      return <Badge variant="outline">Paused</Badge>
    case "needs-attention":
      return <Badge variant="destructive">Needs Attention</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export function AgentManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [agents] = useState(mockAgents)

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">AI Agents</h1>
          <p className="font-body text-muted-foreground">Manage and monitor your AI agents</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2 font-body">
          <Plus className="w-4 h-4" />
          Create Agent
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 font-body"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="font-body bg-transparent">
            All Status
          </Button>
          <Button variant="outline" size="sm" className="font-body bg-transparent">
            Filter
          </Button>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="font-heading font-semibold text-sm text-primary-foreground">{agent.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="font-heading text-lg">{agent.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                      <span className="font-body text-xs text-muted-foreground">{agent.lastActive}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-body">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Agent
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-body" asChild>
                      <Link href={`/agents/${agent.id}/configure`}>
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-body">
                      {agent.status === "active" ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause Agent
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Agent
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-body text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Agent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="font-body">{agent.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-muted-foreground">Status</span>
                {getStatusBadge(agent.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-muted-foreground" />
                    <span className="font-body text-xs text-muted-foreground">Conversations</span>
                  </div>
                  <p className="font-heading font-semibold">{agent.conversations.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="font-body text-xs text-muted-foreground">Success Rate</span>
                  </div>
                  <p className="font-heading font-semibold">{agent.successRate}%</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-body text-muted-foreground">Knowledge Items</span>
                  <span className="font-body font-medium">{agent.knowledgeItems}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-heading font-semibold text-lg">3</p>
                <p className="font-body text-sm text-muted-foreground">Active Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-accent" />
              <div>
                <p className="font-heading font-semibold text-lg">1</p>
                <p className="font-body text-sm text-muted-foreground">Training</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Pause className="w-8 h-8 text-gray-500" />
              <div>
                <p className="font-heading font-semibold text-lg">1</p>
                <p className="font-body text-sm text-muted-foreground">Paused</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-primary" />
              <div>
                <p className="font-heading font-semibold text-lg">6</p>
                <p className="font-body text-sm text-muted-foreground">Total Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateAgentDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
