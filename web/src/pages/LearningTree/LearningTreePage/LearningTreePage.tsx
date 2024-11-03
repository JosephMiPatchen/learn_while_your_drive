import LearningTreeCell from 'src/components/LearningTree/LearningTreeCell'

type LearningTreePageProps = {
  id: string
}

const LearningTreePage = ({ id }: LearningTreePageProps) => {
  return <LearningTreeCell id={id} />
}

export default LearningTreePage
