/**
 * Biomass map pitch-demo: heatmap + uncertainty + carbon overlay.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Image2BiomassMap } from "./Image2BiomassMap"

const meta: Meta<typeof Image2BiomassMap> = {
  title: "Image2Biomass/Map",
  component: Image2BiomassMap,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Investor-grade biomass heatmap with uncertainty and carbon overlays.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "400px" }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Image2BiomassMap>

export const Default: Story = {
  args: {
    showCarbonOverlay: true,
  },
}

export const WithoutCarbonOverlay: Story = {
  args: {
    showCarbonOverlay: false,
  },
}
