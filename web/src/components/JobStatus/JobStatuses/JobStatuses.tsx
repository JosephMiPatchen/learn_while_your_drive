import type {
  DeleteJobStatusMutation,
  DeleteJobStatusMutationVariables,
  FindJobStatuses,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/JobStatus/JobStatusesCell'
import { timeTag, truncate } from 'src/lib/formatters'

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

const JobStatusesList = ({ jobStatuses }: FindJobStatuses) => {
  const [deleteJobStatus] = useMutation(DELETE_JOB_STATUS_MUTATION, {
    onCompleted: () => {
      toast.success('JobStatus deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteJobStatusMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete jobStatus ' + id + '?')) {
      deleteJobStatus({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>User id</th>
            <th>Status</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Total topics</th>
            <th>Current topics</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {jobStatuses.map((jobStatus) => (
            <tr key={jobStatus.id}>
              <td>{truncate(jobStatus.id)}</td>
              <td>{truncate(jobStatus.userId)}</td>
              <td>{truncate(jobStatus.status)}</td>
              <td>{timeTag(jobStatus.createdAt)}</td>
              <td>{timeTag(jobStatus.updatedAt)}</td>
              <td>{truncate(jobStatus.totalTopics)}</td>
              <td>{truncate(jobStatus.currentTopics)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.jobStatus({ id: jobStatus.id })}
                    title={'Show jobStatus ' + jobStatus.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editJobStatus({ id: jobStatus.id })}
                    title={'Edit jobStatus ' + jobStatus.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete jobStatus ' + jobStatus.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(jobStatus.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default JobStatusesList
