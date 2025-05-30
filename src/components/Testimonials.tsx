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
    image: "https://cdn.discordapp.com/avatars/859489780055801896/032edd99be358e55498dc25b49dbaf29.png?size=4096", // Placeholder image
    name: "Anilabh",
    userName: "@devilsbell",
    comment: "PowerSense has completely transformed how I view my electricity consumption. The real-time data is incredibly insightful!",
  },
  {
    image: "https://cdn.discordapp.com/avatars/836982978549907487/661965a1a17bdd8a1cda83f4e38e2912.png?size=4096", // Placeholder image
    name: "Rishikesh",
    userName: "@hiori",
    comment:
    "The dashboard is so user-friendly and easy to understand. I love being able to see my historical data and make informed decisions.",
  },
  {
    image: "https://cdn.discordapp.com/avatars/757268391206715474/d0f150130a3f88a118e7a11dfcde55da.png?size=4096", // Placeholder image
    name: "Midanka",
    userName: "@R786",
    comment:
      "I was skeptical, but PowerSense genuinely helped me identify energy-wasting appliances. My bills have seen a noticeable drop!",
  },
  {
    image: "https://cdn.discordapp.com/avatars/530782107069579265/240bd0b6260c0431e59a7cb7359dd0a0.png?size=4096", // Placeholder image
    name: "Rupender",
    userName: "@error69",
    comment:
      "Excellent support and a truly effective product. It's empowering to have such detailed control over my energy use.",
  },
  {
    image: "https://cdn.discordapp.com/avatars/344093744670179361/d09545a6b444be1e4dc2f4d427d47dee.png?size=4096", // Placeholder image
    name: "Jimmy",
    userName: "@jimmy1327",
    comment:
      "Knowing the estimated cost per kWh is a game-changer for budgeting. This is an essential tool for smart homes.",
  },
  {
    image: "https://cdn.discordapp.com/avatars/1358491532432248995/5826243824477fbcd6d91e18192ec2c3.png?size=4096", // Placeholder image
    name: "Smiley",
    userName: "@smiley10100",
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