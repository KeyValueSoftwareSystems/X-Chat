"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Save, Bot, Brain, Settings, MessageSquare, Zap, Shield, TestTube, Plus, X } from "lucide-react"
import { AgentTestPanel } from "@/components/agent-test-panel"

interface AgentConfigurationProps {
  agentId: string
}

// Mock agent data
const mockAgent = {
  id: "1",
  name: "Customer Support Agent",
  description: "Handles general customer inquiries and support tickets",
  status: "active",
  model: "gpt-4",
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt:
    "You are a helpful customer support agent. Assist customers with their questions and provide clear, friendly responses. Always be professional and empathetic.",
  knowledgeBases: ["Customer Support FAQ", "Product Documentation"],
  integrations: ["Slack", "Zendesk"],
  responseTime: "fast",
  fallbackEnabled: true,
  loggingEnabled: true,
  rateLimitEnabled: true,
  maxRequestsPerMinute: 60,
}

export function AgentConfiguration({ agentId }: AgentConfigurationProps) {
  const [agent, setAgent] = useState(mockAgent)
  const [activeTab, setActiveTab] = useState("general")
  const [temperature, setTemperature] = useState([agent.temperature])
  const [maxTokens, setMaxTokens] = useState([agent.maxTokens])
  const [maxRequests, setMaxRequests] = useState([agent.maxRequestsPerMinute])

  const handleSave = () => {
    console.log("Saving agent configuration:", agent)
    // Here you would typically send the data to your backend
  }

  const handleTest = () => {
    console.log("Testing agent:", agentId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/agents")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agents
        </Button>
        <div className="flex-1">
          <h1 className="font-heading text-3xl font-bold text-foreground">Configure Agent</h1>
          <p className="font-body text-muted-foreground">Customize your agent's behavior and settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleTest} className="font-body bg-transparent">
            <TestTube className="w-4 h-4 mr-2" />
            Test Agent
          </Button>
          <Button onClick={handleSave} className="font-body">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Agent Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-xl font-semibold">{agent.name}</h2>
              <p className="font-body text-muted-foreground">{agent.description}</p>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              {agent.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration Tabs */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="font-body">
                <Settings className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="behavior" className="font-body">
                <Brain className="w-4 h-4 mr-2" />
                Behavior
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="font-body">
                <MessageSquare className="w-4 h-4 mr-2" />
                Knowledge
              </TabsTrigger>
              <TabsTrigger value="integrations" className="font-body">
                <Zap className="w-4 h-4 mr-2" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="security" className="font-body">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Basic Information</CardTitle>
                  <CardDescription className="font-body">Configure your agent's basic settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="font-body">
                      Agent Name
                    </Label>
                    <Input
                      id="name"
                      value={agent.name}
                      onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                      className="font-body"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description" className="font-body">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={agent.description}
                      onChange={(e) => setAgent({ ...agent, description: e.target.value })}
                      className="font-body"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="model" className="font-body">
                      AI Model
                    </Label>
                    <Select value={agent.model} onValueChange={(value) => setAgent({ ...agent, model: value })}>
                      <SelectTrigger className="font-body">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4" className="font-body">
                          GPT-4
                        </SelectItem>
                        <SelectItem value="gpt-3.5-turbo" className="font-body">
                          GPT-3.5 Turbo
                        </SelectItem>
                        <SelectItem value="claude-3" className="font-body">
                          Claude 3
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">System Prompt</CardTitle>
                  <CardDescription className="font-body">
                    Define how your agent should behave and respond
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={agent.systemPrompt}
                    onChange={(e) => setAgent({ ...agent, systemPrompt: e.target.value })}
                    className="min-h-[120px] font-body"
                    placeholder="Enter your system prompt..."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Response Settings</CardTitle>
                  <CardDescription className="font-body">Fine-tune your agent's response behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-body">Temperature</Label>
                      <span className="font-body text-sm text-muted-foreground">{temperature[0]}</span>
                    </div>
                    <Slider
                      value={temperature}
                      onValueChange={setTemperature}
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <p className="font-body text-xs text-muted-foreground">
                      Lower values make responses more focused, higher values more creative
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-body">Max Tokens</Label>
                      <span className="font-body text-sm text-muted-foreground">{maxTokens[0]}</span>
                    </div>
                    <Slider
                      value={maxTokens}
                      onValueChange={setMaxTokens}
                      max={4096}
                      min={256}
                      step={256}
                      className="w-full"
                    />
                    <p className="font-body text-xs text-muted-foreground">Maximum length of agent responses</p>
                  </div>

                  <div className="grid gap-2">
                    <Label className="font-body">Response Speed</Label>
                    <Select
                      value={agent.responseTime}
                      onValueChange={(value) => setAgent({ ...agent, responseTime: value })}
                    >
                      <SelectTrigger className="font-body">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast" className="font-body">
                          Fast (Lower quality)
                        </SelectItem>
                        <SelectItem value="balanced" className="font-body">
                          Balanced
                        </SelectItem>
                        <SelectItem value="quality" className="font-body">
                          Quality (Slower)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="knowledge" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Knowledge Base Assignment</CardTitle>
                  <CardDescription className="font-body">
                    Select which knowledge bases this agent can access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agent.knowledgeBases.map((kb, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Brain className="w-5 h-5 text-primary" />
                        <span className="font-body font-medium">{kb}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full font-body bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Knowledge Base
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Connected Integrations</CardTitle>
                  <CardDescription className="font-body">Manage external service connections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agent.integrations.map((integration, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-body font-medium">{integration}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full font-body bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Integration
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Security & Monitoring</CardTitle>
                  <CardDescription className="font-body">Configure security and monitoring settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="font-body">Enable Fallback</Label>
                      <p className="font-body text-sm text-muted-foreground">
                        Fallback to human agent when confidence is low
                      </p>
                    </div>
                    <Switch
                      checked={agent.fallbackEnabled}
                      onCheckedChange={(checked) => setAgent({ ...agent, fallbackEnabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="font-body">Enable Logging</Label>
                      <p className="font-body text-sm text-muted-foreground">Log all conversations for analysis</p>
                    </div>
                    <Switch
                      checked={agent.loggingEnabled}
                      onCheckedChange={(checked) => setAgent({ ...agent, loggingEnabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="font-body">Rate Limiting</Label>
                      <p className="font-body text-sm text-muted-foreground">Limit requests per minute</p>
                    </div>
                    <Switch
                      checked={agent.rateLimitEnabled}
                      onCheckedChange={(checked) => setAgent({ ...agent, rateLimitEnabled: checked })}
                    />
                  </div>

                  {agent.rateLimitEnabled && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-body">Max Requests per Minute</Label>
                        <span className="font-body text-sm text-muted-foreground">{maxRequests[0]}</span>
                      </div>
                      <Slider
                        value={maxRequests}
                        onValueChange={setMaxRequests}
                        max={300}
                        min={10}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Test Panel */}
        <div className="lg:col-span-1">
          <AgentTestPanel agentId={agentId} />
        </div>
      </div>
    </div>
  )
}
