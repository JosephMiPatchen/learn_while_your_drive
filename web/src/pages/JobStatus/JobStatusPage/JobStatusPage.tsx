import JobStatusCell from 'src/components/JobStatus/JobStatusCell'

type JobStatusPageProps = {
  id: string
}

const JobStatusPage = ({ id }: JobStatusPageProps) => {
  return <JobStatusCell id={id} />
}

export default JobStatusPage
