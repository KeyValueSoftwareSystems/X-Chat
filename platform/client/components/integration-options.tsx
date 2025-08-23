"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Plus } from "lucide-react"

const integrationOptions = [
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Import documents from your Google Drive",
    icon: "🗂️",
    status: "available",
    color: "bg-blue-500",
  },
  {
    id: "sharepoint",
    name: "SharePoint",
    description: "Connect to Microsoft SharePoint documents",
    icon: "📊",
    status: "available",
    color: "bg-blue-600",
  },
  {
    id: "existing-knowledge",
    name: "Existing Knowledge",
    description: "Use knowledge from other agents",
    icon: "🧠",
    status: "available",
    color: "bg-primary",
  },
  {
    id: "website-import",
    name: "Import Website",
    description: "Crawl and import content from websites",
    icon: "🌐",
    status: "available",
    color: "bg-green-500",
  },
  {
    id: "blank-table",
    name: "Blank Table",
    description: "Create a structured data table from scratch",
    icon: "📋",
    status: "available",
    color: "bg-gray-500",
  },
  {
    id: "markdown-text",
    name: "Markdown/Text",
    description: "Add knowledge directly as text or markdown",
    icon: "📝",
    status: "available",
    color: "bg-purple-500",
  },
]

export function IntegrationOptions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Import from Other Sources</CardTitle>
        <CardDescription className="font-body">
          Connect to external services or create knowledge directly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrationOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="text-2xl">{option.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-body font-medium">{option.name}</h3>
                  {option.status === "available" && (
                    <Badge variant="secondary" className="text-xs font-body">
                      Available
                    </Badge>
                  )}
                </div>
                <p className="font-body text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-accent/30 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mt-1">
              <Plus className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-body font-medium">Need a Custom Integration?</h4>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Contact our team to set up custom data sources and integrations for your specific needs.
              </p>
              <Button variant="outline" size="sm" className="mt-3 font-body bg-transparent">
                Request Integration
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
