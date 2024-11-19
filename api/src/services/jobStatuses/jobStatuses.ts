import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const jobStatuses: QueryResolvers['jobStatuses'] = () => {
  return db.jobStatus.findMany()
}

export const jobStatus: QueryResolvers['jobStatus'] = ({ id }) => {
  return db.jobStatus.findUnique({
    where: { id },
  })
}

export const createJobStatus: MutationResolvers['createJobStatus'] = ({
  input,
}) => {
  return db.jobStatus.create({
    data: input,
  })
}

export const updateJobStatus: MutationResolvers['updateJobStatus'] = ({
  id,
  input,
}) => {
  return db.jobStatus.update({
    data: input,
    where: { id },
  })
}

export const deleteJobStatus: MutationResolvers['deleteJobStatus'] = ({
  id,
}) => {
  return db.jobStatus.delete({
    where: { id },
  })
}
