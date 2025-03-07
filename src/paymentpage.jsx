import React, { useState, useEffect } from "react";
import axios from "axios";
import Subheader from "./assets/subheader";
import Sidebar from "./assets/sidebar";

const PaymentPage = () => {
  // State to store fetched payments
  const [payments, setPayments] = useState([]);

  // Fetch payment data when component mounts
  useEffect(() => {
    axios
      .get("http://localhost:3000/getPayments") // Make GET request to fetch payments
      .then((response) => {
        setPayments(response.data); // Store the fetched payments in state
      })
      .catch((error) => {
        console.error("Error fetching payments:", error); // Handle error if any
      });
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto ">
        <div className="flex justify-between ">
          <h1 className="text-2xl font-semi-bold text-black mb-10 ">
            Your Payments
          </h1>
          <Subheader />
        </div>
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="text-left text-gray-500 bg-gray-200">
              <th className="py-2 px-4">Task Title</th>
              <th className="py-2 px-4">Tasker</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="py-3 px-4">{payment.task}</td>
                  <td className="py-3 px-4">Test Tasker</td>
                  <td className="py-3 px-4">Test Amount</td>
                  <td className="py-3 px-4">{payment.status}</td>
                  <td className="py-3 px-4">
                    {payment.status === "Pending" ? (
                      <button className="px-3 py-1 bg-green text-white rounded-md">
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-gray">Completed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentPage;
