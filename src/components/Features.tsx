import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import image from "../assets/ai.gif";
import image3 from "../assets/ui.png";
import image4 from "../assets/monitoring.gif";

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const features: FeatureProps[] = [
  {
    title: "Realtime Power Monitoring",
    description:
      "Provides instant, up-to-the-second readings of your household's total energy consumption in watts. Allows users to see the immediate impact of turning appliances on or off.",
    image: image4,
  },
  {
    title: "Intuitive user interface",
    description:
      "Presents energy data and recommendations in a clear, intuitive, and visually appealing manner. Accessible from various devices (desktops, tablets, smartphones).",
    image: image3,
  },
  {
    title: "AI-Powered Appliance Usage Analysis",
    description:
      "Uses machine learning to analyze historical data and identify patterns in appliance usage. Learns the typical energy consumption profile of each appliance.",
    image: image,
  },
];

const featureList: string[] = [
  "Dark/Light theme",
  "Features",
  "Our team",
  "Responsive design",
  "Minimalist",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Many{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Great Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <img
                src={image}
                alt="About feature"
                className="w-[200px] lg:w-[300px] mx-auto"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
