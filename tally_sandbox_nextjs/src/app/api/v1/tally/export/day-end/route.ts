import { NextResponse } from 'next/server';
import { getEntriesForDayEnd } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const firm_id = searchParams.get('firm_id');
    const date = searchParams.get('date');
    const api_key = searchParams.get('api_key');

    // Basic validation
    if (!firm_id || !date || !api_key) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Missing required query parameters: firm_id, date, api_key' 
        }, 
        { status: 400 }
      );
    }

    // In a real app we'd validate the API key. 
    // Here we'll just allow it since it's a sandbox, but require it to be passed.

    // Fetch transactions
    const transactions = getEntriesForDayEnd(firm_id, date);

    // Format response identically to what was proposed to the Tally person
    const payload = {
      status: "success",
      data: {
        firm_id: firm_id,
        date: date,
        transactions: transactions
      }
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('Error in Day-End export:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
