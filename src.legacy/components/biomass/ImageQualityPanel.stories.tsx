import type { Meta, StoryObj } from "@storybook/react"
import { ImageQualityPanel } from "./ImageQualityPanel"

const meta: Meta<typeof ImageQualityPanel> = {
  title: "Image2Biomass/ImageQualityPanel",
  component: ImageQualityPanel,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
