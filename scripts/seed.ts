import { db } from 'api/src/lib/db'

export default async () => {
  try {
    console.info('🌱 Starting database seeding...')

    // Check for existing users to avoid duplication
    const existingUsers = await db.user.findMany({
      where: {
        id: {
          in: ['user1', 'user2'], // IDs to check for existing users
        },
      },
    })

    // Determine which users need to be added
    const existingUserIds = new Set(existingUsers.map((user) => user.id))
    const usersToCreate = [
      {
        id: 'user1',
        email: 'alice@example.com',
        name: 'Alice',
        goal: 'Complete Redwood tutorial',
        averageDriveDurationMinutes: 15,
      },
      {
        id: 'user2',
        email: 'bob@example.com',
        name: 'Bob',
        goal: 'Start a blog',
        averageDriveDurationMinutes: 25,
      },
    ].filter((user) => !existingUserIds.has(user.id))

    // Insert new users only if they don't already exist
    if (usersToCreate.length > 0) {
      await db.user.createMany({
        data: usersToCreate,
      })
      console.info(`✅ Added ${usersToCreate.length} new users to the database.`)
    } else {
      console.info('✅ No new users to add.')
    }

    console.info('🌱 Database seeding completed successfully!\n')
  } catch (error) {
    console.error('❌ Seeding error:', error)
  }
}
