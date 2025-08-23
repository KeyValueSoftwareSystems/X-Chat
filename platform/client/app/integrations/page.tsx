"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Copy } from "lucide-react"

export default function IntegrationsPage() {
  const agentId = "a1b2c3d4-e5f6-7890-1234-567890abcdef"
  const scriptTag = `<script src="http://localhost:3000/widget.js" data-agent-id="${agentId}" async></script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptTag)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Integrations</h1>
          <p className="text-muted-foreground">Embed the chat widget on your website.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Embeddable Script</CardTitle>
            <CardDescription>Copy and paste this script into your website's HTML to add the chat widget.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-md text-sm text-muted-foreground overflow-x-auto">
              <pre><code>{scriptTag}</code></pre>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCopy}><Copy className="w-4 h-4 mr-2" />Copy Script</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
