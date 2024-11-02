import { render } from '@redwoodjs/testing/web'

import RecEnginePage from './RecEnginePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('RecEnginePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RecEnginePage />)
    }).not.toThrow()
  })
})
