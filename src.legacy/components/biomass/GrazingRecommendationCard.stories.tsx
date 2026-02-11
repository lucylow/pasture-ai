import type { Meta, StoryObj } from "@storybook/react"
import { GrazingRecommendationCard } from "./GrazingRecommendationCard"

const meta: Meta<typeof GrazingRecommendationCard> = {
  title: "Image2Biomass/GrazingRecommendationCard",
  component: GrazingRecommendationCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
