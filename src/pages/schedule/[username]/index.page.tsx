import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Container, UserHeader } from './styles'
import { prisma } from '../../../lib/prisma'
import { ScheduleForm } from './ScheduleForm'

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatarUrl} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </UserHeader>
      <ScheduleForm />
    </Container>
  )
}

// informa ao next quais os parametros que deverão ser gerados de forma estática des do momento da build,
// o path[] faz com que nenhuma página estática seja gerada no começo da build, para que a geração seja conforme o acesso dos usuários
// o blocking faz com que paginas que ainda não foram geradas de forma estática possam ser carregadas e enão lançadas para o usuário
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })
  if (!user) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    // tempo de recriação da página após o primeiro acesso
    revalidate: 60 * 60 * 24, // 1 day
  }
}
