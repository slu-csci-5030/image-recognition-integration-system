import {NextResponse} from 'next/server';
import { AppConfig } from '@/types/config';
import rawConfig from '@/config/setup.json';

export async function GET() {

    const config: AppConfig = rawConfig as AppConfig;

    // Set the cache control headers

    return NextResponse.json(config, {
        status: 200,
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
        },
}
    );
}