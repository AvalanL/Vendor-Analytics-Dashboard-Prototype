import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

interface CustomFAQItem {
  id: string
  question: string
  answer: string
  category: 'Technical' | 'Pricing' | 'Integration' | 'Features'
  tags: string
}

const CSV_FILE_PATH = path.join(process.cwd(), 'data', 'custom-faq.csv')

// Ensure data directory and file exist
function ensureCSVFile() {
  const dataDir = path.dirname(CSV_FILE_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  if (!fs.existsSync(CSV_FILE_PATH)) {
    const headers = 'id,question,answer,category,tags\n'
    fs.writeFileSync(CSV_FILE_PATH, headers, 'utf8')
  }
}

// GET - Read FAQ data from CSV
export async function GET() {
  try {
    ensureCSVFile()

    const csvContent = fs.readFileSync(CSV_FILE_PATH, 'utf8')

    if (csvContent.trim() === 'id,question,answer,category,tags') {
      return NextResponse.json([])
    }

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    }) as CustomFAQItem[]

    // Convert tags string back to array and parse the data
    const faqItems = records.map(record => ({
      ...record,
      tags: record.tags ? record.tags.split(';').filter(tag => tag.trim()) : []
    }))

    return NextResponse.json(faqItems)
  } catch (error) {
    console.error('Error reading FAQ CSV:', error)
    return NextResponse.json({ error: 'Failed to read FAQ data' }, { status: 500 })
  }
}

// POST - Add new FAQ item to CSV
export async function POST(request: NextRequest) {
  try {
    ensureCSVFile()

    const newFAQ = await request.json()

    // Validate required fields
    if (!newFAQ.question || !newFAQ.answer || !newFAQ.category) {
      return NextResponse.json(
        { error: 'Missing required fields: question, answer, category' },
        { status: 400 }
      )
    }

    // Generate unique ID
    const id = `custom-faq-${Date.now()}`

    // Prepare the new FAQ item
    const faqItem: CustomFAQItem = {
      id,
      question: newFAQ.question,
      answer: newFAQ.answer,
      category: newFAQ.category,
      tags: Array.isArray(newFAQ.tags) ? newFAQ.tags.join(';') : ''
    }

    // Read existing CSV content
    const csvContent = fs.readFileSync(CSV_FILE_PATH, 'utf8')
    const existingRecords = csvContent.trim() === 'id,question,answer,category,tags'
      ? []
      : parse(csvContent, { columns: true, skip_empty_lines: true })

    // Add new record
    existingRecords.push(faqItem)

    // Write back to CSV
    const newCsvContent = stringify(existingRecords, {
      header: true,
      columns: ['id', 'question', 'answer', 'category', 'tags']
    })

    fs.writeFileSync(CSV_FILE_PATH, newCsvContent, 'utf8')

    // Return the formatted item (with tags as array)
    const returnItem = {
      ...faqItem,
      tags: faqItem.tags ? faqItem.tags.split(';').filter(tag => tag.trim()) : []
    }

    return NextResponse.json(returnItem, { status: 201 })
  } catch (error) {
    console.error('Error adding FAQ item:', error)
    return NextResponse.json({ error: 'Failed to add FAQ item' }, { status: 500 })
  }
}