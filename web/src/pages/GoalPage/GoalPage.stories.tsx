import type { Meta, StoryObj } from '@storybook/react'

import GoalPage from './GoalPage'

const meta: Meta<typeof GoalPage> = {
  component: GoalPage,
}

export default meta

type Story = StoryObj<typeof GoalPage>

export const Primary: Story = {}
