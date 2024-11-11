'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Help() {
  // Frequently Asked Questions data
  const faqs = [
    {
      question: 'How do I reset my password?',
      answer:
        "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password.",
    },
    {
      question: 'What should I do if I suspect unauthorized access to my account?',
      answer:
        'If you suspect unauthorized access, immediately change your password and contact our support team. We will review your account activity and help secure your account.',
    },
    {
      question: 'How can I enable two-factor authentication?',
      answer:
        'You can enable two-factor authentication in your account settings. We support various methods including SMS, authenticator apps, and security keys.',
    },
    {
      question: 'Are my login attempts logged?',
      answer:
        'Yes, we log all login attempts for security purposes. You can view your login history in your account settings.',
    },
    {
      question: 'How long are my login sessions valid?',
      answer:
        "Login sessions are typically valid for 24 hours. After this period, you'll need to log in again for security reasons.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <h1 className="text-4xl font-bold text-white">Help Center</h1>

      {/* FAQ Accordion */}
      <Card className="bg-gray-900/50 p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                {/* FAQ Question */}
                <AccordionTrigger className="text-white text-lg font-semibold py-2">
                  {faq.question}
                </AccordionTrigger>
                {/* FAQ Answer */}
                <AccordionContent className="text-gray-300 pl-4 py-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
