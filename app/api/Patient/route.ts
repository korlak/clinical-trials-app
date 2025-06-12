import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Signup from '@/models/Patient'

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const signup = await Signup.create(body)
  return NextResponse.json(signup)
}