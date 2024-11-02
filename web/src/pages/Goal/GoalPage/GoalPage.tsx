import GoalCell from 'src/components/Goal/GoalCell'

type GoalPageProps = {
  id: string
}

const GoalPage = ({ id }: GoalPageProps) => {
  return <GoalCell id={id} />
}

export default GoalPage
