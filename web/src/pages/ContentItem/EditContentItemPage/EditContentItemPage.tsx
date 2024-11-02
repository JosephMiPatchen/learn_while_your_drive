import EditContentItemCell from 'src/components/ContentItem/EditContentItemCell'

type ContentItemPageProps = {
  id: string
}

const EditContentItemPage = ({ id }: ContentItemPageProps) => {
  return <EditContentItemCell id={id} />
}

export default EditContentItemPage
