import EditLearningTreeCell from 'src/components/LearningTree/EditLearningTreeCell'

type LearningTreePageProps = {
  id: string
}

const EditLearningTreePage = ({ id }: LearningTreePageProps) => {
  return <EditLearningTreeCell id={id} />
}

export default EditLearningTreePage
