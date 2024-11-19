import type {
  DeleteUserMutation,
  DeleteUserMutationVariables,
  FindUserById,
} from 'types/graphql'
import JsonView from '@uiw/react-json-view';


import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useState } from 'react'

const DELETE_USER_MUTATION: TypedDocumentNode<
  DeleteUserMutation,
  DeleteUserMutationVariables
> = gql`
  mutation DeleteUserMutation($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`

interface Props {
  user: NonNullable<FindUserById['user']>
}

// Helper component for displaying JSON objects with collapsible elements
const JsonViewer = ({ data, level = 0 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  if (typeof data === 'object' && data !== null) {
    return (
      <div style={{ paddingLeft: `${level * 1.5}em` }}>
        <button
          onClick={toggleCollapse}
          style={{
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            color: '#007acc',
            fontWeight: 'bold',
            marginRight: '5px',
          }}
        >
          {isCollapsed ? '▶' : '▼'}
        </button>
        <span style={{ color: '#007acc', fontWeight: 'bold' }}>
          {Array.isArray(data) ? '[ ]' : '{ }'}
        </span>
        {!isCollapsed &&
          Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <span style={{ color: '#007acc', fontWeight: 'bold' }}>
                {key}:
              </span>{' '}
              {typeof value === 'object' ? (
                <JsonViewer data={value} level={level + 1} />
              ) : (
                <span style={{ color: '#333' }}>{JSON.stringify(value)}</span>
              )}
            </div>
          ))}
      </div>
    )
  }

  return <span style={{ color: '#333' }}>{JSON.stringify(data)}</span>
}

const User = ({ user }: Props) => {
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User deleted')
      navigate(routes.users())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteUserMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete user ' + id + '?')) {
      deleteUser({ variables: { id } })
    }
  }

  // Parse learningTree JSON if available, otherwise set to null
  const parsedLearningTree = user.learningTree
    ? JSON.parse(user.learningTree)
    : null

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            User {user.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{user.id}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{user.name}</td>
            </tr>
            <tr>
              <th>Average drive duration minutes</th>
              <td>{user.averageDriveDurationMinutes}</td>
            </tr>
            <tr>
              <th>Goal</th>
              <td>{user.goal}</td>
            </tr>
            <tr>
              <th>Learning tree</th>
              <td>
                {parsedLearningTree ? (
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.7)', // Frosted glass effect
                      backdropFilter: 'blur(8px)', // Apply the blur
                      WebkitBackdropFilter: 'blur(8px)', // Support for Safari
                      padding: '1em',
                      borderRadius: '10px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <JsonView value={parsedLearningTree} />
                  </div>
                ) : (
                  <span>No learning tree data available</span>
                )}
              </td>
            </tr>
            <tr>
              <th>Latest Job Id</th>
              <td>{user.latestJobId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editUser({ id: user.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(user.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default User
