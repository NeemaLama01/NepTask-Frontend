import React, { useState } from "react";
import { Plus, Minus, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

// AuthButtons Component
const AuthButtons = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <div className="space-x-4">
      <button
        onClick={handleLoginClick}
        className="px-4 py-2 hover:bg-gray-100 rounded-md"
      >
        Login
      </button>
      <button
        onClick={handleSignupClick}
        className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-purple-700"
      >
        Sign Up
      </button>
    </div>
  );
};

// CustomAccordion Component
const CustomAccordion = ({ items }) => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm">
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-4 py-4 flex justify-between items-center text-left font-medium"
          >
            {item.question}
            {openItem === index ? (
              <Minus className="h-4 w-4 text-gray-500" />
            ) : (
              <Plus className="h-4 w-4 text-gray-500" />
            )}
          </button>
          {openItem === index && (
            <div className="px-4 pb-4 text-gray-600">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
};

// RoleRow Component with Marquee Animation
const RoleRow = ({ roles, speed = 20 }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className="inline-block animate-marquee"
        style={{
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {roles.map((role) => (
          <span
            key={role}
            className="inline-block px-4 py-2 mx-2 bg-gray-100 rounded-full text-sm"
          >
            {role}
          </span>
        ))}
        {roles.map((role) => (
          <span
            key={`${role}-duplicate`}
            className="inline-block px-4 py-2 mx-2 bg-gray-100 rounded-full text-sm"
          >
            {role}
          </span>
        ))}
      </div>
    </div>
  );
};

// LandingPage Component
const LandingPage = () => {
  const roles = [
    [
      "House cleaning",
      "Laundry & ironing",
      "Dishwashing",
      "Gardening & lawn care",
      "Furniture assembly",
      "Home organization & decluttering",
      "Moving help (packing & unpacking)",
    ],
    [
      "Grocery shopping & delivery",
      "Food pickup & delivery",
      "Parcel or document delivery",
      "Pharmacy runs (medication pickup)",
    ],
    [
      "Plumbing fixes",
      "Electrical repairs",
      "AC & appliance servicing",
      "Car or bike repair",
      "Welding & fabrication work",
    ],
    [
      "Dog walking",
      "Pet sitting",
      "Pet grooming",
      "Feeding & taking care of pets",
      "Dog walking",
      "Pet sitting",
      "Pet grooming",
      "Feeding & taking care of pets",
    ],
  ];

  const faqs = [
      {
        question: "What is NepTask?",
        answer:
          "NepTask is a service marketplace platform that connects individuals who need help with everyday tasks (task posters) to skilled, semi-skilled, and unskilled individuals (task doers) who can complete these tasks.",
      },
      {
        question: "How does NepTask work?",
        answer:
          "Task posters can post tasks with detailed descriptions, and taskers can browse or bid on tasks. Once a task is assigned, the task doer completes it, and payment is securely processed through the platform.",
      },
      {
        question: "What types of tasks can I post or complete on NepTask?",
        answer:
          "You can post or complete a wide range of tasks, including household chores, errands, personal assistance, skilled services, community services, and more.",
      },
      {
        question: "How are prices determined for tasks?",
        answer:
          "Task posters can set a budget, and taskers can bid on the task. The final price is agreed upon between the task poster and the selected tasker.",
      },
      {
        question: "How does payment work on NepTask?",
        answer:
          "Payments are securely processed using an escrow method. Task posters pay upfront, and the amount is released to the task doer once the task is completed and approved.",
      },
      {
        question: "What if there is a dispute between a task poster and a task doer?",
        answer:
          "NepTask provides a dispute resolution system where our support team mediates to resolve any issues between task posters and taskers.",
      },
      {
        question: "How does NepTask ensure safety and trust?",
        answer:
          "We have a review/rating system to ensure transparency and trust between task posters and taskers.",
      },
    ];

  const steps = [
    {
      number: "01",
      title: "Create a task",
      description:
        "Describe your Task, set price range to offer, and detail what you are looking for in a tasker.",
    },
    {
      number: "02",
      title: "Connect with Taskers",
      description:
        "Review biddings, chat with potential taskers, and find the perfect match for your task.",
    },
    {
      number: "03",
      title: "Get the task done",
      description:
        "Choose a taskers among the biddings, then hand over the task to be accomplished.",
    },
  ];

  return (
    <div className="h-screen w-screen bg-white px-4 md:px-20">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4">
        <div className="text-blue-700 font-bold text-xl">NepTask</div>
        <AuthButtons />
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-4 h-full relative">
        {/* Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.png"
            alt="Teamwork"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Overlay */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-40 text-black">
            Find the tasker
            <br /> you have been searching
            <br /> for
          </h1>
          <p className="text-gray-600 mb-8">
          Connect with people in need of everyday assistance and taskers.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-2">How it works</h2>
        <p className="text-center text-gray-600 mb-12">
          Task Posters create tasks, taskers apply, and complete the tasks by bidding.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="text-blue-700 font-semibold mb-2">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who is this for */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-2">
          Who is this for?
        </h2>
        <p className="text-center text-gray-600 mb-12">
          For anyone who needs help with tasks and for individuals looking to
          earn by completing them.
        </p>
        <div className="space-y-8">
          {roles.map((row, idx) => (
            <RoleRow key={idx} roles={row} speed={25 + idx * 5} />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className=" mr-40 ml-40 py-16 px-40 ">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently asked questions
        </h2>
        <CustomAccordion items={faqs} />
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-600">© 2024 NepTask</div>
          <a href="#" className="flex items-center gap-2 text-sm text-gray-600">
            <Twitter size={16} /> Follow for updates
          </a>
        </div>
      </footer>

      {/* Marquee Animation Styles */}
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
