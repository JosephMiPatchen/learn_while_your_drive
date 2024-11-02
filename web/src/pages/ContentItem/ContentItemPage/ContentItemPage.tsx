import ContentItemCell from 'src/components/ContentItem/ContentItemCell'

type ContentItemPageProps = {
  id: string
}

const ContentItemPage = ({ id }: ContentItemPageProps) => {
  return <ContentItemCell id={id} />
}

export default ContentItemPage
