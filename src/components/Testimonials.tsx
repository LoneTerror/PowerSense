import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://i.postimg.cc/KcM7DxLJ/boy-1.png", // Placeholder image
    name: "Ethan Carter",
    userName: "@EthanC",
    comment: "PowerSense has completely transformed how I view my electricity consumption. The real-time data is incredibly insightful!",
  },
  {
    image: "https://i.postimg.cc/9fgPJfJN/girl-1.png", // Placeholder image
    name: "Ava Martinez",
    userName: "@AvaM",
    comment:
      "Knowing the estimated cost per kWh is a game-changer for budgeting. This is an essential tool for smart homes.",
  },
  {
    image: "https://i.postimg.cc/pLZJ5C8v/boy-2.png", // Placeholder image
    name: "Noah Williams",
    userName: "@NW_Finds",
    comment:
    "The dashboard is so user-friendly and easy to understand. I love being able to see my historical data and make informed decisions.",
  },
  {
    image: "https://i.postimg.cc/QtRQZyLQ/girl-2.png", // Placeholder image
    name: "Olivia Smith",
    userName: "@LivSmith",
    comment:
      "Excellent support and a truly effective product. It's empowering to have such detailed control over my energy use.",
  },
  {
    image: "https://i.postimg.cc/yN8XmRXZ/boy-3.png", // Placeholder image
    name: "Benjamin Clark",
    userName: "@BenClark_official",
    comment:
      "I was skeptical, but PowerSense genuinely helped me identify energy-wasting appliances. My bills have seen a noticeable drop!",
  },
  {
    image: "https://i.postimg.cc/wMLhqQHS/girl-3.png", // Placeholder image
    name: "Charlotte Jones",
    userName: "@CharlotteJ",
    comment:
      "The average consumption metrics are very helpful for understanding trends. Highly recommend PowerSense to everyone!",
  },
];

export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        Customer
        {" "}
        <span className="bg-gradient-to-r from-[#79c5bf] to-[#b183db] text-transparent bg-clip-text">
          Feedback
        </span>
      </h2>

      {/* <p className="text-xl text-muted-foreground pt-4 pb-8">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non unde error
        facere hic reiciendis illo
      </p> */}
      {""}

      <div className="py-12 grid md:grid-cols-2 lg:grid-cols-4 sm:block columns-2 lg:columns-3 lg:gap-6 mx-auto space-y-4 lg:space-y-6">
        {testimonials.map(
          ({ image, name, userName, comment }: TestimonialProps) => (
            <Card
              key={userName}
              className="max-w-md md:break-inside-avoid overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage
                    alt=""
                    src={image}
                  />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{userName}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>{comment}</CardContent>
            </Card>
          )
        )}
      </div>
    </section>
  );
};