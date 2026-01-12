import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST - Public endpoint to submit form (no auth required)
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { values } = body;

    // Get form with fields
    const form = await prisma.form.findUnique({
      where: { id: params.id },
      include: {
        fields: true,
      },
    });

    if (!form || form.status !== 'active') {
      return NextResponse.json(
        { error: 'Form not found or inactive' },
        { status: 404 }
      );
    }

    // Validate required fields
    const missingFields = form.fields
      .filter((field) => field.required && !values[field.label])
      .map((field) => field.label);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Required fields missing: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Get IP and User Agent
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Create submission
    const submission = await prisma.formSubmission.create({
      data: {
        formId: form.id,
        ipAddress,
        userAgent,
        values: {
          create: Object.entries(values).map(([label, value]) => ({
            fieldLabel: label,
            fieldValue: String(value),
          })),
        },
      },
      include: {
        values: true,
      },
    });

    // If integrateCRM is true, create CRM contact
    if (form.integrateCRM) {
      try {
        const emailField = Object.entries(values).find(
          ([label]) => label.toLowerCase().includes('email') || label.toLowerCase().includes('e-mail')
        );
        const nameField = Object.entries(values).find(
          ([label]) => label.toLowerCase().includes('nome') || label.toLowerCase().includes('name')
        );
        const phoneField = Object.entries(values).find(
          ([label]) => label.toLowerCase().includes('telefone') || label.toLowerCase().includes('phone')
        );
        const companyField = Object.entries(values).find(
          ([label]) => label.toLowerCase().includes('empresa') || label.toLowerCase().includes('company')
        );

        if (emailField || nameField) {
          const fullName = nameField ? String(nameField[1]) : 'Lead do Formulário';
          const nameParts = fullName.split(' ');
          const firstName = nameParts[0] || fullName;
          const lastName = nameParts.slice(1).join(' ') || null;

          await prisma.cRMContact.create({
            data: {
              firstName,
              lastName,
              fullName,
              email: emailField ? String(emailField[1]) : null,
              phone: phoneField ? String(phoneField[1]) : null,
              companyName: companyField ? String(companyField[1]) : null,
              source: 'formulario',
              status: 'active',
              leadScore: 50,
              notes: `Lead capturado do formulário: ${form.name}`,
              userId: form.userId,
            },
          });
        }
      } catch (crmError) {
        console.error('Error creating CRM contact:', crmError);
        // Don't fail the submission if CRM creation fails
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: form.successMessage,
      redirectUrl: form.redirectUrl,
      submission,
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
