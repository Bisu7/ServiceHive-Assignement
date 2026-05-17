import mongoose from 'mongoose'
import { connectDB } from '../config/db'
import { User } from '../modules/users/user.model'
import { LeadModel } from '../modules/leads/lead.model'
import { LeadStatus, LeadSource } from '@leadflow/shared'
import { logger } from '../utils/logger'

const SAMPLE_LEAD_NAMES = [
  'Emma Watson', 'Liam Neeson', 'Sophia Loren', 'Noah Centineo',
  'Olivia Wilde', 'Jackson Pollock', 'Ava DuVernay', 'Lucas Hedges',
  'Isabella Rossellini', 'Ethan Hawke', 'Mia Farrow', 'Oliver Stone',
  'Amelia Earhart', 'Elijah Wood', 'Charlotte Rampling', 'James Dean',
  'Harper Lee', 'Benjamin Bratt', 'Evelyn Waugh', 'William Shatner',
  'Abigail Breslin', 'Alexander Skarsgard', 'Emily Blunt', 'Daniel Kaluuya',
  'Grace Kelly'
]

const SAMPLE_LEAD_NOTES = [
  'Interested in standard enterprise service package. Requested pricing sheets.',
  'Found us via Instagram influencer post. Warm lead, follow up on Tuesday.',
  'Referred by partner agency. High priority corporate client.',
  'Looking for a custom MERN custom dashboard integration.',
  'Initial consultation scheduled for next Friday at 10 AM.',
  'Requested a demo session for the CRM automation tools.',
  'Wants to compare package options before committing to monthly contract.',
  'Lead is asking if we support self-hosted private cloud database instances.',
  'Left a callback number. Best reached in early afternoons.',
  'Stated budget is tight but looking to scale up by Q4.',
]

function getRandomItem<T>(arr: T[]): T {
  if (arr.length === 0) throw new Error('Array is empty')
  return arr[Math.floor(Math.random() * arr.length)] as T
}

function getRandomDateWithinDays(days: number): Date {
  const now = new Date()
  const daysAgoMs = days * 24 * 60 * 60 * 1000
  const randomMs = Math.floor(Math.random() * daysAgoMs)
  return new Date(now.getTime() - randomMs)
}

async function seed() {
  try {
    logger.info('Database seeder initialized')
    await connectDB()

    // 1. Check/create default users
    let adminUser = await User.findOne({ email: 'admin@leadflow.com' })
    if (!adminUser) {
      adminUser = await User.create({
        name: 'System Admin',
        email: 'admin@leadflow.com',
        password: 'Admin@123',
        role: 'admin',
      })
      logger.info('Seeded default Admin user: admin@leadflow.com / Admin@123')
    } else {
      logger.info('Default Admin user already exists')
    }

    let salesUser = await User.findOne({ email: 'sales@leadflow.com' })
    if (!salesUser) {
      salesUser = await User.create({
        name: 'Sales Representative',
        email: 'sales@leadflow.com',
        password: 'Sales@123',
        role: 'sales',
      })
      logger.info('Seeded default Sales user: sales@leadflow.com / Sales@123')
    } else {
      logger.info('Default Sales user already exists')
    }

    // 2. Clear existing leads to ensure clean state or add on top
    const existingCount = await LeadModel.countDocuments()
    logger.info(`Found ${existingCount} existing leads in pipeline. Adding 25 fresh seed entries...`)

    const statuses = Object.values(LeadStatus)
    const sources = Object.values(LeadSource)
    const creators = [adminUser._id, salesUser._id]

    const leadsToInsert = []

    for (let i = 0; i < 25; i++) {
      const name = SAMPLE_LEAD_NAMES[i % SAMPLE_LEAD_NAMES.length] || `Lead ${i}`
      const email = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`
      const status = getRandomItem(statuses)
      const source = getRandomItem(sources)
      const notes = getRandomItem(SAMPLE_LEAD_NOTES)
      const createdBy = getRandomItem(creators)
      const createdAt = getRandomDateWithinDays(90)
      const updatedAt = new Date(createdAt.getTime() + Math.floor(Math.random() * 24 * 60 * 60 * 1000))

      leadsToInsert.push({
        name,
        email,
        status,
        source,
        notes,
        createdBy,
        assignedTo: createdBy, // Auto-assign to seed creator
        createdAt,
        updatedAt,
      })
    }

    // Use raw Mongoose collection insert to preserve back-dated custom timestamps
    await LeadModel.collection.insertMany(leadsToInsert)
    logger.info('Successfully seeded 25 diverse lead records spread over the last 90 days!')

    await mongoose.connection.close()
    logger.info('Database connection closed safely. Seeder completed successfully!')
    process.exit(0)
  } catch (error) {
    logger.error('CRITICAL: Database seeding failed:', error)
    process.exit(1)
  }
}

seed()
