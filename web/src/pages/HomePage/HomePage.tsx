// import { Link, routes } from '@redwoodjs/router'

import { Metadata } from '@redwoodjs/web'

import GoalCell from 'src/components/Goal/GoalCell'

const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />

      <GoalCell id="goal1" />
    </>
  )
}

export default HomePage
