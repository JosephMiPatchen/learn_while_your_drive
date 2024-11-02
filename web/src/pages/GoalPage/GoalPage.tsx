// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const GoalPage = () => {
  return (
    <>
      <Metadata title="Goal" description="Goal page" />

      <h1>GoalPage</h1>
      <p>
        Find me in <code>./web/src/pages/GoalPage/GoalPage.tsx</code>
      </p>
      {/*
          My default route is named `goal`, link to me with:
          `<Link to={routes.goal()}>Goal</Link>`
      */}
    </>
  )
}

export default GoalPage
