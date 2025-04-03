import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "./Icons";
import satisfiedcust from "../assets/coffee_guy.jpg";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Personalized Energy Consumption Reports and Insights:",
    description:
      "This service goes beyond simply showing real-time data. It involves analyzing the collected data to provide clients with personalized reports.",
    icon: <ChartIcon />,
  },
  {
    title: "Proactive Energy Efficiency Consultations",
    description:
      "Building on the real-time monitoring, this service offers consultations with energy experts.",
    icon: <WalletIcon />,
  },
  {
    title: "Appliance-Specific Usage Alerts and Notifications",
    description:
      "This service leverages the (immediate impact) aspect of the monitoring by providing alerts and notifications related to specific appliances.",
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Client-Centric{" "}
            </span>
            Services
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
          Empower your energy efficiency with personalized data insights, expert advice, and real-time appliance alerts.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <img
          src={satisfiedcust}
          className="w-[300px] md:w-[400px] lg:w-[500px] object-contain"
          alt="About services"
        />
      </div>
    </section>
  );
};
