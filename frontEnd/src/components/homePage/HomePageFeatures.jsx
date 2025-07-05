// import React from "react";
// import { Users, Wallet, PieChart, Bell, Clock, AlarmClock, Divide } from "lucide-react";

// const features = [
//   {
//     title: "Create Groups",
//     description: "Easily form groups for trips, events, or roommates.",
//     icon: <Users className="w-6 h-6 text-primary" />,
//   },
//   {
//     title: "Split Expenses",
//     description: "Split bills and expenses in just a few clicks.",
//     icon: <Wallet className="w-6 h-6 text-primary" />,
//   },
//   {
//     title: "Track Everything",
//     description: "Stay on top of who owes what, always.",
//     icon: <PieChart className="w-6 h-6 text-primary" />,
//   },
//   {
//     title: "Instant Notifications",
//     description: "Get real-time updates when someone adds or settles an expense.",
//     icon: <Bell className="w-6 h-6 text-primary" />,
//   },
  
//   {
//     title: "Payment Reminders",
//     description: "Receive friendly nudges when it's time to pay someone back.",
//     icon: <AlarmClock className="w-6 h-6 text-primary" />,
//   },
//   {
//     title: "Multiple Split Types",
//     description: "Choose equal, exact amount, or percentage-based splits.",
//     icon: <Divide className="w-6 h-6 text-primary" />,
//   },
// ];

// const HomePageFeatures = () => {
//   return (
//     <section className="mt-10 bg-gray-100 py-20" id="features">
//       <div className="max-w-5xl mx-auto px-4 text-center">
//         <h2 className="text-3xl font-semibold mb-8">Features</h2>
//         <div className="grid gap-6 grid-cols-2 content-center justify-center sm:grid-cols-2 md:grid-cols-3">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground"
//             >
//               <div className="mb-4 flex justify-center items-center">
//                 {feature.icon}
//               </div>
//               <h3 className="text-xl font-medium">{feature.title}</h3>
//               <p className="text-sm mt-2 text-muted-foreground hidden sm:block">
//                 {feature.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HomePageFeatures;









































import React from "react";
import { useId } from "react";
import {
  Users,
  Wallet,
  PieChart,
  Bell,
  AlarmClock,
  Divide,
} from "lucide-react";

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
    icon: <PieChart className="w-6 h-6 text-primary " />,
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

export const Grid = ({ pattern, size }) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}-${Math.random()}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

const HomePageFeatures = () => {
  return (
    <div className="w-full relative z-0  mb-20">
    <section className=" mt-20 p-10  bg-gradient-to-b from-gray-50 via-white" id="features">

    <div className="flex flex-wrap justify-center">
    <h1 className=" text-4xl mb-15 font-semibold  bg-gradient-to-r from-emerald-600  to-teal-600 bg-clip-text text-transparent text-center">Features</h1>
   </div> 
       
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-10 w-full lg:w-4/5 px-10  mx-auto">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden hover:shadow-lg duration-200 "
          >
            <Grid size={20} />
            <div className="mb-4 flex justify-center items-center relative z-20">
              {feature.icon}
            </div>
            <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
              {feature.title}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20  sm:block">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default HomePageFeatures;










