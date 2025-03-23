import React, { useState, useEffect } from "react";
import axios from "axios";
import Subheader from "./assets/subheader";
import Sidebar from "./assets/sidebar";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  // Fetch initial payments based on user role
  useEffect(() => {
    const fetchInitialPayments = async () => {
      try {
        const apiUrl =
          userRole === "Task Poster"
            ? "http://localhost:3000/getPayments" // API for taskposter
            : "http://localhost:3000/taskerpayment"; // API for tasker

        const params =
          userRole === "Task Poster"
            ? { taskposter: userName }
            : { tasker: userId };

        const response = await axios.get(apiUrl, { params });
        setPayments(response.data); // Set initial payments
      } catch (error) {
        console.error("Error fetching initial payments:", error);
      }
    };

    fetchInitialPayments();
  }, [userRole, userId, userName]);

  // Fetch payment details for each payment
  useEffect(() => {
    if (payments.length === 0) return; // Avoid unnecessary API calls

    const fetchPaymentDetails = async () => {
      const paymentData = {};

      try {
        await Promise.all(
          payments.map(async (payment) => {
            try {
              const apiUrl =
                userRole === "Task Poster"
                  ? "http://localhost:3000/getinfo"
                  : "http://localhost:3000/taskerpayment";

              const params =
                userRole === "Task Poster"
                  ? { task: payment.task, taskposter: userName }
                  : { tasker: userId };

              const response = await axios.get(apiUrl, { params });
              paymentData[payment.task] = response.data.data;
            } catch (error) {
              console.error(`Error fetching info for ${payment.task}:`, error);
            }
          })
        );

        setPaymentInfo(paymentData); // Update payment info state
      } catch (error) {
        console.error("Error in fetchPaymentDetails:", error);
      }
    };

    fetchPaymentDetails();
  }, [payments, userRole, userId, userName]);

  // Handle payment process
  const handlePayNow = (payment) => {
    setSelectedPayment(payment);
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    try {
      setPayments((prevPayments) =>
        prevPayments.map((p) =>
          p.task === selectedPayment.task ? { ...p, status: "Paid" } : p
        )
      );

      setShowOverlay(true);

      await axios.put("http://localhost:3000/updatepaymentstatus", {
        task: selectedPayment.task,
        status: "Paid",
      });

      setTimeout(() => setShowOverlay(false), 2000);
    } catch (error) {
      console.error("Error updating payment status:", error);
    } finally {
      setShowConfirmation(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold text-black mb-10">Your Payments</h1>
          <Subheader />
        </div>

        {payments.length > 0 ? (
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="text-left text-white bg-primary">
                <th className="py-2 px-4">Task Title</th>
                {userRole === "Task Poster" ? (
                  <th className="py-2 px-4">Tasker</th>
                ) : (
                  <th className="py-2 px-4">Task Poster</th>
                )}
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="py-3 px-4">{payment.task}</td>
                  <td className="py-3 px-4">
                    {userRole === "Task Poster"
                      ? paymentInfo[payment.task]?.tasker || "N/A"
                      : payment.taskposter || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {userRole === "Task Poster"
                      ? paymentInfo[payment.task]?.offerPrice || "N/A"
                      : payment.offerprice || "N/A"}
                  </td>
                  <td className="py-3 px-4">{payment.status}</td>
                  <td className="py-3 px-4">
                    {payment.status === "Pending" ? (
                      <button
                        className="px-3 py-1 bg-green text-white rounded-md hover:bg-green-600"
                        onClick={() => handlePayNow(payment)}
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-gray-500">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <img src="/ezgif-2ea53893d930c2.webp" className="w-36 h-36" />
            <h2 className="text-2xl font-semibold text-gray-700">No Payments💸Found.</h2>
            <p className="text-gray-500 mt-2">
              You currently have no pending or completed payments.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => window.location.href = "/my-tasks"}
            >
              Browse Available Tasks
            </button>
          </div>
        )}
      </div>

      {/* Payment Confirmation Dialog */}
      {showConfirmation && selectedPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-gray-800">Confirm Payment</h2>
            <p className="text-gray-600 mt-2">Task: {selectedPayment.task}</p>
            <p className="text-gray-600">
              Amount: Rs.{paymentInfo[selectedPayment.task]?.offerPrice || "N/A"}
            </p>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-green text-white rounded-md hover:bg-green-600 mr-2"
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </button>
              <button
                className="px-4 py-2 bg-red text-white rounded-md hover:bg-red-600"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Overlay */}
      {showOverlay && selectedPayment && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowOverlay(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-green">Payment Successful</h2>
            <p className="text-gray-600 mt-2">Task: {selectedPayment.task}</p>
            <p className="text-gray-600">
              Amount: Rs.{paymentInfo[selectedPayment.task]?.offerPrice || "N/A"}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => setShowOverlay(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;