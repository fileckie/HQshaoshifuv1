import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    version: '1.1.0', 
    timestamp: new Date().toISOString(),
    fix: 'restaurant-auto-create'
  })
}
