import EditJobStatusCell from 'src/components/JobStatus/EditJobStatusCell'

type JobStatusPageProps = {
  id: string
}

const EditJobStatusPage = ({ id }: JobStatusPageProps) => {
  return <EditJobStatusCell id={id} />
}

export default EditJobStatusPage
