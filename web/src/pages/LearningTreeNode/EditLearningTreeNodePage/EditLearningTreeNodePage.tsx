import EditLearningTreeNodeCell from 'src/components/LearningTreeNode/EditLearningTreeNodeCell'

type LearningTreeNodePageProps = {
  id: string
}

const EditLearningTreeNodePage = ({ id }: LearningTreeNodePageProps) => {
  return <EditLearningTreeNodeCell id={id} />
}

export default EditLearningTreeNodePage
