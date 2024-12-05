import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function HelpPage() {
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
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Help Center</h1>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

