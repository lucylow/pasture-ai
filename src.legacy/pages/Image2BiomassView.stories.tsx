/**
 * Investor pitch-demo: Full Image2Biomass view.
 * Run: npm run storybook → Image2Biomass / PitchDemo
 */
import type { Meta, StoryObj } from "@storybook/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Image2BiomassView } from "./Image2BiomassView"

const queryClient = new QueryClient()

const withProviders = (Story: React.ComponentType) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

const meta: Meta<typeof Image2BiomassView> = {
  title: "Image2Biomass/PitchDemo",
  component: Image2BiomassView,
  decorators: [withProviders],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Full investor-grade demo: biomass heatmap, uncertainty, carbon overlay, counterfactual sliders, multi-pasture plan, audit log, regulatory export.",
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Image2BiomassView>

export const FullPitchDemo: Story = {
  parameters: {
    chromatic: { viewportWidth: 1440, viewportHeight: 900 },
  },
}
