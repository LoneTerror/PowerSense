// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { buttonVariants } from "@/components/ui/button";
import logo from "../assets/icons/raw_logo.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Linkedin } from "lucide-react";
import { LightBulbIcon } from "./Icons";
// import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial */}

      {/* Team */}
      <Card className="absolute right-[70px] top-4 w-100 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <img
            src={logo}
            alt="user avatar"
            className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center">PowerSense</CardTitle>
          <CardDescription className="font-normal text-primary">
            Because every watt counts.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-2">
          <p>

          </p>
        </CardContent>

      </Card>

      {/* Service */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>Light & dark mode</CardTitle>
            <CardDescription className="text-md mt-2">
              Featuring toggle for light and dark mode.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
