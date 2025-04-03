import { Statistics } from "./Statistics";
import logo from "../assets/icons/logo.png";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={logo}
            alt=""
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Company
              </h2>
              <br />
              <p>PowerSense provides real-time insights into your home's energy consumption, empowering you to make smarter choices and reduce your carbon footprint. 
                 Our AI-powered system analyzes your usage patterns and delivers personalized recommendations to optimize your energy efficiency and lower your bills.</p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
