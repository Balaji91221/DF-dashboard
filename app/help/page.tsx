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
      question: 'How do I create a new user?',
      answer:
        "Request an administrator to create a new user from the admin dashboard. The new user will receive instructions to setup their account by an email.",
    },
    {
      question: 'What should I do if I lose access to my security key or device?',
      answer:
        'In case of loss of devices, please contact the admin. The admin will set up a link to add new devices.',
    },
    {
      question: 'How can I use MAuthN in my products or services?',
      answer:
        'MAuthN has a wide range of available SDKs and APIs, tailored for your product or service. Contact the administrator to receive your APIs.',
    },
    {
      question: 'Are my login attempts logged?',
      answer:
        'Yes, we log all successful login attempts for security purposes. You can view your login history in your account settings.',
    },
    {
      question: 'Where can I use MAuthN?',
      answer:
        "MAuthN is usable in internet connected device. If your product or service is critical or not internet connected, contact the developers to set up an air-gapped version of MAuthN in your premises.",
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
