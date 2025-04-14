import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'setup.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const config = JSON.parse(fileContents);

    return NextResponse.json(config, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error reading setup.json:', error);
    return NextResponse.json(
      { error: 'Failed to load config' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
