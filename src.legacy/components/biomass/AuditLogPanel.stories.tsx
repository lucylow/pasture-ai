/**
 * Audit log + regulatory export preview pitch-demo.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { AuditLogPanel } from "./AuditLogPanel"

const meta: Meta<typeof AuditLogPanel> = {
  title: "Image2Biomass/AuditLog",
  component: AuditLogPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Decision trail and regulatory export preview for compliance.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md bg-[#F6F5F2] p-4 rounded-xl">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof AuditLogPanel>

export const Default: Story = {}
