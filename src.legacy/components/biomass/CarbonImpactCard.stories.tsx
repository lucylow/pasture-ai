import type { Meta, StoryObj } from "@storybook/react"
import { CarbonImpactCard } from "./CarbonImpactCard"

const meta: Meta<typeof CarbonImpactCard> = {
  title: "Image2Biomass/CarbonImpactCard",
  component: CarbonImpactCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
