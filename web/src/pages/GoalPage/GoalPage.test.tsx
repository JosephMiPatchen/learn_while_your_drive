import { render } from '@redwoodjs/testing/web'

import GoalPage from './GoalPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('GoalPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<GoalPage />)
    }).not.toThrow()
  })
})
