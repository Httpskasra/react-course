import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json({ok:true,app:'atelier-nova',time:new Date().toISOString()})}
