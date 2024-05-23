/* eslint-disable drizzle/enforce-delete-with-where */

import { faker } from '@faker-js/faker'
import { users, restaurants } from './schema'
import { db } from './connection'

/**
 * Reset database
 */
await db.delete(users)
await db.delete(restaurants)

console.log('Database reset ✅')

/**
 * Create customers
 */

await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
])

console.log('Customers created ✅')

/**
 * Create manager
 */

const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@admin.com',
      role: 'manager',
    },
  ])
  .returning({
    id: users.id,
  })

console.log('Manager created ✅')

/**
 * Create restaurant
 */

await db.insert(restaurants).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager.id,
  },
])

console.log('Restaurant created ✅')

console.log('🐱‍🏍Database seeded successfully🐱‍💻')

process.exit()
