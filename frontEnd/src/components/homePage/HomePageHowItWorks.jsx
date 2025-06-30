import React from "react";

const steps = [
  {
    title: "Create a Group",
    description: "Sign up and form a group for your trip, event, or household.",
    image: "/images/hpss1.png",
  },
  {
    title: "Add Expenses",
    description: "Enter expenses, choose how to split them, and keep it fair.",
    image: "/images/hpss2.png",
  },
  {
    title: "Track & Settle",
    description: "Monitor who owes what and settle up easily anytime.",
    image: "/images/hpss3.png",
  },
];
// 
const HowItWorks = () => {
  return (
    <section className="pb-20 text-foreground" id="how-it-works">
      <div className="max-w-4xl mx-auto px-4 justify-center  content-center">
        {/* <div className="flex flex-wrap w-full"> */}
          <h2 className="text-4xl font-semibold  text-center mb-20 bg-gradient-to-r from-emerald-600  to-teal-600 bg-clip-text text-transparent">How It Works</h2>
        {/* </div> */}
        <div className=" pl-1 bg-gradient-to-br from-emerald-600  to-teal-600 ">
          <div className="bg-white">
            {steps.map((step, index) => (
              <div key={index} className="mb-16 ml-6 relative">
                <div className={`md:flex items-center ${index % 2 === 1 ? "flex-row-reverse" : ""}`}>
                  <img
                    src={step.image}
                    alt={`Step ${index + 1}: ${step.title}`}
                    className="w-full md:w-auto h-96 object-scale-down rounded-xl shadow-lg"
                  />
                  <div className={`md:w-1/2 px-6 mt-6 md:mt-0 ${index % 2 === 1 ? "text-right" : "text-left"}`}>
                    <h3 className="text-2xl font-semibold">
                      <span className="font-extrabold bg-gradient-to-r from-emerald-600  to-teal-600 bg-clip-text text-transparent ">{`Step ${index + 1}: `}</span>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
