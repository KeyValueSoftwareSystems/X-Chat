import { DashboardLayout } from "@/components/dashboard-layout"
import { AgentConfiguration } from "@/components/agent-configuration"

interface AgentConfigurePageProps {
  params: {
    id: string
  }
}

export default function AgentConfigurePage({ params }: AgentConfigurePageProps) {
  return (
    <DashboardLayout>
      <AgentConfiguration agentId={params.id} />
    </DashboardLayout>
  )
}
