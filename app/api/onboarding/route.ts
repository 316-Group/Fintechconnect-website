import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      action = 'save',
      email,
      businessType,
      goals,
      industries,
      buildOption,
      currentStep,
      completed,
    } = body;

    const user = await getCurrentUser({ email });

    if (!user) {
      return NextResponse.json(
        { authenticated: false, onboarding: null, message: 'Authentication required' },
        { status: action === 'get' ? 200 : 401 }
      );
    }

    if (action === 'get') {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        onboarding: user.onboardingProfile,
      });
    }

    const updatedProfile = await db.onboardingProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        businessType: businessType || null,
        goals: Array.isArray(goals) ? goals : [],
        industries: Array.isArray(industries) ? industries : [],
        buildOption: buildOption || null,
        currentStep: typeof currentStep === 'number' ? currentStep : 1,
        completed: typeof completed === 'boolean' ? completed : false,
      },
      update: {
        ...(businessType !== undefined && { businessType }),
        ...(Array.isArray(goals) && { goals }),
        ...(Array.isArray(industries) && { industries }),
        ...(buildOption !== undefined && { buildOption }),
        ...(typeof currentStep === 'number' && { currentStep }),
        ...(typeof completed === 'boolean' && { completed }),
      },
    });

    return NextResponse.json({
      success: true,
      onboarding: updatedProfile,
    });
  } catch (error) {
    console.error('Failed to process onboarding request:', error);
    return NextResponse.json(
      { message: 'Internal server error processing onboarding data' },
      { status: 500 }
    );
  }
}
