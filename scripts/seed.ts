// import { db } from 'api/src/lib/db'

// Manually apply seeds via the `yarn rw prisma db seed` command.
//
// Seeds automatically run the first time you run the `yarn rw prisma migrate dev`
// command and every time you run the `yarn rw prisma migrate reset` command.
//
// See https://redwoodjs.com/docs/database-seeds for more info

import { db } from 'api/src/lib/db'

export default async () => {
  try {
    // Seed Users
    const users = await db.user.createMany({
      data: [
        {
          id: 'user1',
          email: 'alice@example.com',
          name: 'Alice',
          averageDriveDurationMinutes: 15,
        },
        {
          id: 'user2',
          email: 'bob@example.com',
          name: 'Bob',
          averageDriveDurationMinutes: 25,
        },
      ],
    })

    // Seed Goals
    const goals = await db.goal.createMany({
      data: [
        {
          id: 'goal1',
          description: 'Complete Redwood tutorial',
          userId: 'user1',
        },
        {
          id: 'goal2',
          description: 'Start a blog',
          userId: 'user2',
        },
      ],
    })

    // Seed ContentItems
    await db.contentItem.createMany({
      data: [
        {
          id: 'content1',
          title: 'Introduction to Redwood',
          description: 'Learn the basics of Redwood',
          url: 'https://redwoodjs.com/tutorial',
          goalId: 'goal1',
        },
        {
          id: 'content2',
          title: 'Setting up Prisma',
          description: 'Learn how to set up Prisma in Redwood',
          goalId: 'goal1',
        },
        {
          id: 'content3',
          title: 'How to start a blog',
          description: 'Guide to starting a blog',
          goalId: 'goal2',
        },
      ],
    })

    console.info('\n🌱 Database has been seeded successfully!\n')
  } catch (error) {
    console.error(error)
  }
}
