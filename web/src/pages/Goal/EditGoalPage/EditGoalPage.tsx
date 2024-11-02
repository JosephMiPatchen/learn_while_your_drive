import EditGoalCell from 'src/components/Goal/EditGoalCell'

type GoalPageProps = {
  id: string
}

const EditGoalPage = ({ id }: GoalPageProps) => {
  return <EditGoalCell id={id} />
}

export default EditGoalPage
