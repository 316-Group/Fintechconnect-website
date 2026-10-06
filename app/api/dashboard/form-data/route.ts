import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-static';


export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, data: null }, { status: 401 });
    }

    const dashboardFormDataDb = db as any;
    const formData = await dashboardFormDataDb.dashboardFormData.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      authenticated: true,
      data: formData
        ? {
            businessIdentity: formData.businessIdentity ?? null,
            compliance: formData.compliance ?? null,
            beneficialOwnership: formData.beneficialOwnership ?? null,
          }
        : { businessIdentity: null, compliance: null, beneficialOwnership: null },
    });
  } catch (error) {
    console.error('Failed to fetch dashboard form data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { businessIdentity, compliance, beneficialOwnership } = body;

    const updatePayload: Record<string, unknown> = {};
    if (businessIdentity !== undefined) updatePayload.businessIdentity = businessIdentity;
    if (compliance !== undefined) updatePayload.compliance = compliance;
    if (beneficialOwnership !== undefined) updatePayload.beneficialOwnership = beneficialOwnership;

    const dashboardFormDataDb = db as any;
    const result = await dashboardFormDataDb.dashboardFormData.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        businessIdentity: businessIdentity ?? undefined,
        compliance: compliance ?? undefined,
        beneficialOwnership: beneficialOwnership ?? undefined,
      },
      update: updatePayload,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to save dashboard form data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}