import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do I reorder inventory?", a: "Navigate to the Dashboard, find items flagged as Critical or Low Stock, and click the reorder button to add them to your cart." },
  { q: "How is supplier lead time calculated?", a: "Lead time is measured from the purchase order date to the delivery date, covering order processing, production, packaging, and shipping phases." },
  { q: "What do the stockout risk levels mean?", a: "Critical means stock will run out within days. Low Stock indicates you should reorder soon. Healthy means inventory levels are sufficient." },
  { q: "How do I contact a supplier?", a: "Go to the Messages page to send direct messages, or use the Emails page to compose and track email communications." },
  { q: "Can I manage multiple restaurant chains?", a: "Yes, each company account can manage inventory across multiple locations and chains from a single dashboard." },
];

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Help & Support</h2>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Need more help? Reach out to our support team at{" "}
              <a href="mailto:support@restoq.com" className="text-primary underline">
                support@restoq.com
              </a>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Help;
