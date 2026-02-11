/**
 * Multi-pasture optimization pitch-demo.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { MultiPastureOptimizationPanel } from "./MultiPastureOptimizationPanel"

const meta: Meta<typeof MultiPastureOptimizationPanel> = {
  title: "Image2Biomass/MultiPastureOptimization",
  component: MultiPastureOptimizationPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "AI-optimized grazing schedule across multiple pastures.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm bg-[#F6F5F2] p-4 rounded-xl">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof MultiPastureOptimizationPanel>

export const Default: Story = {}
