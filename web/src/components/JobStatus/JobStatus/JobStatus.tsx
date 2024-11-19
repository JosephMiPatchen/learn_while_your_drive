import type {
  DeleteJobStatusMutation,
  DeleteJobStatusMutationVariables,
  FindJobStatusById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_JOB_STATUS_MUTATION: TypedDocumentNode<
  DeleteJobStatusMutation,
  DeleteJobStatusMutationVariables
> = gql`
  mutation DeleteJobStatusMutation($id: String!) {
    deleteJobStatus(id: $id) {
      id
    }
  }
`

interface Props {
  jobStatus: NonNullable<FindJobStatusById['jobStatus']>
}

const JobStatus = ({ jobStatus }: Props) => {
  const [deleteJobStatus] = useMutation(DELETE_JOB_STATUS_MUTATION, {
    onCompleted: () => {
      toast.success('JobStatus deleted')
      navigate(routes.jobStatuses())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteJobStatusMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete jobStatus ' + id + '?')) {
      deleteJobStatus({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            JobStatus {jobStatus.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{jobStatus.id}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{jobStatus.userId}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{jobStatus.status}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(jobStatus.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(jobStatus.updatedAt)}</td>
            </tr>
            <tr>
              <th>Total topics</th>
              <td>{jobStatus.totalTopics}</td>
            </tr>
            <tr>
              <th>Current topics</th>
              <td>{jobStatus.currentTopics}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editJobStatus({ id: jobStatus.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(jobStatus.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default JobStatus
