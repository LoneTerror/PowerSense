import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Github, Linkedin } from "lucide-react";

interface TeamProps {
  imageUrl: string;
  name: string;
  position: string;
  socialNetworks: SociaNetworkslProps[];
}

interface SociaNetworkslProps {
  name: string;
  url: string;
}

const teamList: TeamProps[] = [
  {
    imageUrl: "https://i.postimg.cc/mkCJZPbX/Pratiksha.jpg",
    name: "Pratiksha Sarma",
    position: "BTech - IT | Gauhati University",
    socialNetworks: [
      {
        name: "Github",
        url: "https://github.com/Pratiksha377?tab=repositories",
      },
      {
        name: "Linkedin",
        url: "https://www.linkedin.com/in/pratiksha-sarma/",
      },
      {
        name: "Mail",
        url: "https://gmail.com",
      },
    ],
  },
  {
    imageUrl: "https://i.postimg.cc/6psBtj03/Prasun-b-w-with-highneck-tshirt-Upscaled.png",
    name: "Prasun Chakraborty",
    position: "BTech - IT | Gauhati University",
    socialNetworks: [
      {
        name: "Github",
        url: "https://github.com/LoneTerror/PowerSense.git",
      },
      {
        name: "Linkedin",
        url: "https://www.linkedin.com/in/prasun-chakraborty-287246257/",
      },
      {
        name: "Mail",
        url: "mailto:nothingshere21@gmail.com",
      },
    ],
  },
  
];




const guideList: TeamProps[] = [
  {
    imageUrl: "https://i.postimg.cc/ZKP21vs0/Kishore_sir.jpg",
    name: "Dr. Kishore Kashyap",
    position: "Assistant Professor, Dept of IT | GU",
    socialNetworks: [
      {
        name: "Linkedin",
        url: "https://www.linkedin.com/in/kishore-kashyap/",
      },
      {
        name: "Mail",
        url: "https://gmail.com",
      },
    ],
  },
];

export const Team = () => {
  const socialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <Linkedin size="20" />;

      case "Github":
        return <Github size="20" />;

      case "Mail":
        return <Mail size="20" />;
    }
  };

  return (
    <section
      id="team"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Our Dedicated{" "}
        </span>
        Crew
      </h2>

      <p className="mt-4 mb-10 text-xl text-muted-foreground">
        We are a team of passionate individuals committed to making a difference in the world of energy management. Our diverse backgrounds and expertise drive us to innovate and deliver the best solutions for our users.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10">
        {teamList.map(
          ({ imageUrl, name, position, socialNetworks }: TeamProps) => (
            <Card
              key={name}
              className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center"
            >
              <CardHeader className="mt-8 flex justify-center items-center pb-2">
                <img
                  src={imageUrl}
                  alt={`${name} ${position}`}
                  className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
                />
                <CardTitle className="text-center">{name}</CardTitle>
                <CardDescription className="text-primary">
                  {position}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center pb-2">
                <p></p>
              </CardContent>

              <CardFooter>
                {socialNetworks.map(({ name, url }: SociaNetworkslProps) => (
                  <div key={name}>
                    <a
                      rel="noreferrer noopener"
                      href={url}
                      target="_blank"
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      <span className="sr-only">{name} icon</span>
                      {socialIcon(name)}
                    </a>
                  </div>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>

      <h2 className="text-3xl md:text-4xl py-20 font-bold">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Our Dedicated{" "}
        </span>
        Guide
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10">
        {guideList.map(
          ({ imageUrl, name, position, socialNetworks }: TeamProps) => (
            <Card
              key={name}
              className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center"
            >
              <CardHeader className="mt-8 flex justify-center items-center pb-2">
                <img
                  src={imageUrl}
                  alt={`${name} ${position}`}
                  className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
                />
                <CardTitle className="text-center">{name}</CardTitle>
                <CardDescription className="text-primary">
                  {position}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center pb-2">
                <p></p>
              </CardContent>

              <CardFooter>
                {socialNetworks.map(({ name, url }: SociaNetworkslProps) => (
                  <div key={name}>
                    <a
                      rel="noreferrer noopener"
                      href={url}
                      target="_blank"
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      <span className="sr-only">{name} icon</span>
                      {socialIcon(name)}
                    </a>
                  </div>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
