import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How does PowerSense help me save money on my electricity bill?",
    answer: "PowerSense provides real-time insights into your energy consumption, allowing you to identify power-hungry appliances and peak usage times. Our AI-powered system analyzes your usage patterns and offers personalized recommendations for optimizing energy efficiency. By following these recommendations and potentially automating appliance control, you can significantly reduce your energy waste and lower your electricity bill.",
    value: "item-1",
  },
  {
    question: "Do I need to be a technical expert to install PowerSense?",
    answer:
      "While the installation of the hardware components within your electrical panel should be performed by a qualified electrician for safety reasons, using the PowerSense app and dashboard is designed to be user-friendly. The app provides clear visualizations and easy-to-understand recommendations.",
    value: "item-2",
  },
  {
    question:
      "What kind of appliances can PowerSense control?",
    answer:
      "PowerSense can control any appliance that can be switched on/off via a relay or similar switching mechanism. This includes lights, fans, water heaters, and certain other electrical devices. The specific appliances that can be controlled will depend on the installation and setup.",
    value: "item-3",
  },
  {
    question: "How accurate is the real-time power monitoring provided by PowerSense?",
    answer: "PowerSense utilizes high-precision current and voltage sensors to provide accurate real-time power consumption data. The accuracy of the system is also dependent on the proper installation and calibration of the sensors.",
    value: "item-4",
  },
  {
    question:
      "Is my energy consumption data secure and private?",
    answer:
      "Yes, we take data security and privacy very seriously. All data transmitted between your home and our servers is encrypted using industry-standard security protocols. We adhere to strict privacy policies and do not share your data with third parties without your explicit consent.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
