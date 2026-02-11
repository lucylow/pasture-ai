import type { Meta, StoryObj } from "@storybook/react"
import { CounterfactualSlider } from "./CounterfactualSlider"

const meta: Meta<typeof CounterfactualSlider> = {
  title: "Image2Biomass/CounterfactualSlider",
  component: CounterfactualSlider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
