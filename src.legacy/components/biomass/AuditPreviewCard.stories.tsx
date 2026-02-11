import type { Meta, StoryObj } from "@storybook/react"
import { AuditPreviewCard } from "./AuditPreviewCard"

const meta: Meta<typeof AuditPreviewCard> = {
  title: "Image2Biomass/AuditPreviewCard",
  component: AuditPreviewCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
