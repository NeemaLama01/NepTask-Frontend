import React, { useState } from "react";
import { Plus, Minus, Twitter, ArrowRight } from "lucide-react";
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
    <div className="flex space-x-4">
      <button
        onClick={handleLoginClick}
        className="px-4 py-2 text-gray-700 hover:text-primary transition-colors duration-300"
      >
        Login
      </button>
      <button
        onClick={handleSignupClick}
        className="px-6 py-2 bg-primary text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
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
    <div className="space-y-4 max-w-3xl mx-auto">
      {items.map((item, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-5 flex justify-between items-center text-left font-medium text-gray-800"
          >
            <span className="font-semibold">{item.question}</span>
            {openItem === index ? (
              <Minus className="h-5 w-5 text-primary flex-shrink-0" />
            ) : (
              <Plus className="h-5 w-5 text-primary flex-shrink-0" />
            )}
          </button>
          {openItem === index && (
            <div className="px-6 pb-5 text-gray-600 animate-fade-in">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// RoleRow Component with Marquee Animation
const RoleRow = ({ roles, speed = 20 }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap py-2">
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
            className="inline-block px-5 py-2 mx-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium shadow-sm"
          >
            {role}
          </span>
        ))}
        {roles.map((role) => (
          <span
            key={`${role}-duplicate`}
            className="inline-block px-5 py-2 mx-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium shadow-sm"
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
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const preventDefault = (event) => {
    event.preventDefault();
  };

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
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center py-6 px-6 md:px-16 lg:px-24 bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="text-primary font-bold text-2xl">NepTask</div>
        <AuthButtons />
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-16 lg:px-24 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h1 className=" text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                Find the tasker you have been searching for
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Connect with people in need of everyday assistance and taskers who can help get things done efficiently.
              </p>
              <button
              onClick={handleLoginClick}
               className="px-8 py-3 bg-primary text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-lg flex items-center gap-2 group">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="People working together"
                className="rounded-2xl shadow-2xl w-full max-w-md object-cover h-80 md:h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-heading text-center mb-4 font-bold text-4xl">How it works</h2>
          <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto text-lg">
            Task Posters create tasks, taskers apply, and complete the tasks by bidding.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="glass-card p-8 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="text-primary font-bold text-xl mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="py-20 px-6 md:px-16 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-heading text-center mb-4 text-4xl font-bold">
            Who is this for?
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
            For anyone who needs help with tasks and for individuals looking to
            earn by completing them.
          </p>
          <div className="space-y-8">
            {roles.map((row, idx) => (
              <RoleRow key={idx} roles={row} speed={25 + idx * 5} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 md:px-16 lg:px-24 bg-blue">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-heading text-center mb-16 text-4xl font-bold">
            Frequently asked questions
          </h2>
          <CustomAccordion items={faqs} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 md:px-16 lg:px-24 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of task posters and taskers today.
          </p>
          <button
            onClick={handleSignupClick}
            className="px-8 py-3 bg-white text-primary rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg text-lg font-medium"
          >
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-16 lg:px-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="text-2xl font-bold mb-6">NepTask</div>
              <p className="text-gray-400 mb-6">
                Connecting people who need tasks done with those who can help.
              </p>
              <div className="flex space-x-4">
                <a href="#" onClick={preventDefault} className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" onClick={preventDefault} className="text-gray-400 hover:text-white transition-colors">
                    Frequently asked questions
                  </a>
                </li>
                <li>
                  <a href="#" onClick={preventDefault} className="text-gray-400 hover:text-white transition-colors">
                    Who is this for?
                  </a>
                </li>
                <li>
                  <a href="#" onClick={preventDefault} className="text-gray-400 hover:text-white transition-colors">
                    How it works?
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Services</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" onClick={preventDefault} className="text-gray-400 hover:text-white transition-colors">
                    Task Posting
                  </a>
                </li>
                <li>
                  <a href="#" onClick={preventDefault} className="text-gray-400 hover:text-white transition-colors">
                    Task Bidding
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:info@neptask.com" onClick={preventDefault} className="text-gray-400 hover:text-white transition-colors">
                    neptask@gmail.com
                  </a>
                </li>
                <li>
                  <a href="#" onClick={preventDefault} className="text-gray-400 hover:text-white transition-colors">
                    +977987654321
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 ">
            <div className="text-sm text-gray-400 text-center">© 2024 NepTask. All rights reserved.</div>
          </div>
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