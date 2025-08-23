"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function IntegrationsPage() {
  const [slackBotToken, setSlackBotToken] = useState("")
  const [slackBotId, setSlackBotId] = useState("")

  const handleSave = () => {
    // Handle saving the credentials
    console.log("Slack Bot Token:", slackBotToken)
    console.log("Slack Bot ID:", slackBotId)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Integrations</h1>
          <p className="text-muted-foreground">Connect your tools and services.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Slack Integration</CardTitle>
            <CardDescription>Connect your Slack workspace to receive notifications and interact with your agent.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slack-bot-token">Slack Bot Token</Label>
              <Input 
                id="slack-bot-token" 
                type="password"
                placeholder="Enter your Slack bot token"
                value={slackBotToken}
                onChange={(e) => setSlackBotToken(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slack-bot-id">Slack Bot ID</Label>
              <Input 
                id="slack-bot-id" 
                placeholder="Enter your Slack bot ID"
                value={slackBotId}
                onChange={(e) => setSlackBotId(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>Save</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
