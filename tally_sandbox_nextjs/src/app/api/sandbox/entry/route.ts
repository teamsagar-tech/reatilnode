import { NextResponse } from 'next/server';
import { saveEntry, getEntries } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.firm_id || !body.date || !body.transaction) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newEntry = saveEntry({
      firm_id: body.firm_id,
      date: body.date,
      transaction: body.transaction,
    });

    return NextResponse.json({ success: true, data: newEntry }, { status: 201 });
  } catch (error) {
    console.error('Error saving entry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const entries = getEntries();
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
