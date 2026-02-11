import type { Meta, StoryObj } from "@storybook/react"
import { BiomassGrowthCurve } from "./BiomassGrowthCurve"

const meta: Meta<typeof BiomassGrowthCurve> = {
  title: "Image2Biomass/BiomassGrowthCurve",
  component: BiomassGrowthCurve,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
