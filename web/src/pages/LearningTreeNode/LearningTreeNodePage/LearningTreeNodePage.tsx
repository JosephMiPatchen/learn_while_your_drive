import LearningTreeNodeCell from 'src/components/LearningTreeNode/LearningTreeNodeCell'

type LearningTreeNodePageProps = {
  id: string
}

const LearningTreeNodePage = ({ id }: LearningTreeNodePageProps) => {
  return <LearningTreeNodeCell id={id} />
}

export default LearningTreeNodePage
