import React from "react";
import { Users, Wallet, PieChart, Bell, Clock, AlarmClock, Divide } from "lucide-react";

const features = [
  {
    title: "Create Groups",
    description: "Easily form groups for trips, events, or roommates.",
    icon: <Users className="w-6 h-6 text-primary" />,
  },
  {
    title: "Split Expenses",
    description: "Split bills and expenses in just a few clicks.",
    icon: <Wallet className="w-6 h-6 text-primary" />,
  },
  {
    title: "Track Everything",
    description: "Stay on top of who owes what, always.",
    icon: <PieChart className="w-6 h-6 text-primary" />,
  },
  {
    title: "Instant Notifications",
    description: "Get real-time updates when someone adds or settles an expense.",
    icon: <Bell className="w-6 h-6 text-primary" />,
  },
  
  {
    title: "Payment Reminders",
    description: "Receive friendly nudges when it's time to pay someone back.",
    icon: <AlarmClock className="w-6 h-6 text-primary" />,
  },
  {
    title: "Multiple Split Types",
    description: "Choose equal, exact amount, or percentage-based splits.",
    icon: <Divide className="w-6 h-6 text-primary" />,
  },
];

const HomePageFeatures = () => {
  return (
    <section className="mt-10 bg-gray-100 py-20" id="features">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold mb-8">Features</h2>
        <div className="grid gap-6 grid-cols-2 content-center justify-center sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground"
            >
              <div className="mb-4 flex justify-center items-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium">{feature.title}</h3>
              <p className="text-sm mt-2 text-muted-foreground hidden sm:block">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePageFeatures;
