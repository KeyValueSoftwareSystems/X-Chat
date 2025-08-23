"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, Brain, MessageSquare, Headphones } from "lucide-react"

interface CreateAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const agentTemplates = [
  {
    id: "customer-support",
    name: "Customer Support",
    description: "Handle general customer inquiries and support tickets",
    icon: Headphones,
    prompt:
      "You are a helpful customer support agent. Assist customers with their questions and provide clear, friendly responses.",
  },
  {
    id: "sales-assistant",
    name: "Sales Assistant",
    description: "Help with product information and sales inquiries",
    icon: MessageSquare,
    prompt:
      "You are a knowledgeable sales assistant. Help customers understand products and guide them through the sales process.",
  },
  {
    id: "technical-support",
    name: "Technical Support",
    description: "Provide technical assistance and troubleshooting",
    icon: Bot,
    prompt:
      "You are a technical support specialist. Help users troubleshoot technical issues with clear, step-by-step guidance.",
  },
  {
    id: "custom",
    name: "Custom Agent",
    description: "Create a custom agent with your own configuration",
    icon: Brain,
    prompt: "",
  },
]

export function CreateAgentDialog({ open, onOpenChange }: CreateAgentDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [agentName, setAgentName] = useState("")
  const [agentDescription, setAgentDescription] = useState("")
  const [agentPrompt, setAgentPrompt] = useState("")
  const [step, setStep] = useState(1)

  const handleTemplateSelect = (templateId: string) => {
    const template = agentTemplates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setAgentName(template.name)
      setAgentDescription(template.description)
      setAgentPrompt(template.prompt)
      setStep(2)
    }
  }

  const handleCreate = () => {
    // Here you would typically send the data to your backend
    console.log("Creating agent:", {
      template: selectedTemplate,
      name: agentName,
      description: agentDescription,
      prompt: agentPrompt,
    })

    // Reset form and close dialog
    setStep(1)
    setSelectedTemplate("")
    setAgentName("")
    setAgentDescription("")
    setAgentPrompt("")
    onOpenChange(false)
  }

  const handleBack = () => {
    setStep(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {step === 1 ? "Choose Agent Template" : "Configure Agent"}
          </DialogTitle>
          <DialogDescription className="font-body">
            {step === 1
              ? "Select a template to get started quickly, or create a custom agent from scratch."
              : "Customize your agent's name, description, and behavior."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="grid gap-4 py-4">
            {agentTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <template.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold">{template.name}</h3>
                  <p className="font-body text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-body">
                Agent Name
              </Label>
              <Input
                id="name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Enter agent name"
                className="font-body"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="font-body">
                Description
              </Label>
              <Input
                id="description"
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                placeholder="Brief description of the agent's purpose"
                className="font-body"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prompt" className="font-body">
                System Prompt
              </Label>
              <Textarea
                id="prompt"
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                placeholder="Define how the agent should behave and respond"
                className="min-h-[100px] font-body"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model" className="font-body">
                AI Model
              </Label>
              <Select defaultValue="gpt-4">
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="Select AI model" />
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
          </div>
        )}

        <DialogFooter>
          {step === 2 && (
            <Button variant="outline" onClick={handleBack} className="font-body bg-transparent">
              Back
            </Button>
          )}
          {step === 2 && (
            <Button onClick={handleCreate} className="font-body">
              Create Agent
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
