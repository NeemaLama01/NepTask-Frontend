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
  const [isLoading, setIsLoading] = useState(true);

  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  // Fetch initial payments based on user role
  useEffect(() => {
    const fetchInitialPayments = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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
              console.log(payment);
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

  // Status badge component
  const StatusBadge = ({ status }) => {
    const baseClasses = "py-1 px-3 rounded-full text-md font-medium";

    if (status === "Paid" || status === "Received") {
      return (
        <span className={`${baseClasses} bg-green text-white`}>{status}</span>
      );
    } else if (status === "Pending") {
      return (
        <span className={`${baseClasses} bg-yellow text-white`}>{status}</span>
      );
    } else {
      return (
        <span className={`${baseClasses} bg-gray-100 text-white`}>
          {status}
        </span>
      );
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Payments</h1>
          </div>
          <Subheader />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-secondary">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-primary font-medium">
                Loading payment data...
              </p>
            </div>
          ) : payments.length > 0 ? (
            <div className="overflow-hidden">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Payment History
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left">
                      <th className="py-3 px-6 bg-secondary text-primary rounded-tl-lg">
                        Task Title
                      </th>
                      {userRole === "Task Poster" ? (
                        <th className="py-3 px-6 bg-secondary text-primary">
                          Tasker
                        </th>
                      ) : (
                        <th className="py-3 px-6 bg-secondary text-primary">
                          Task Poster
                        </th>
                      )}
                      <th className="py-3 px-6 bg-secondary text-primary">
                        Amount
                      </th>
                      <th className="py-3 px-6 bg-secondary text-primary">
                        Status
                      </th>
                      {userRole === "Task Poster" && (
                        <th className="py-3 px-6 bg-secondary text-primary rounded-tr-lg">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr
                        key={index}
                        className={`border-b border-secondary hover:bg-secondary transition-colors duration-150 ${
                          index === payments.length - 1 ? "border-none" : ""
                        }`}
                      >
                        <td className="py-4 px-6 font-medium">
                          {payment.task}
                        </td>
                        <td className="py-4 px-6">
                          {userRole === "Task Poster"
                            ? paymentInfo[payment.task]?.tasker || "N/A"
                            : payment.taskposter || "N/A"}
                        </td>
                        <td className="py-4 px-6 font-semibold text-primary">
                          Rs.
                          {userRole === "Task Poster"
                            ? paymentInfo[payment.task]?.offerPrice || "N/A"
                            : payment.offerprice || "N/A"}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge
                            status={
                              userRole === "Task Poster"
                                ? payment.status
                                : payment.status === "Paid"
                                ? "Received"
                                : payment.status
                            }
                          />
                        </td>
                        {userRole === "Task Poster" && (
                          <td className="py-4 px-6">
                            {payment.status === "Pending" ? (
                              <button
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 duration-150"
                                onClick={() => handlePayNow(payment)}
                              >
                                Release Now
                              </button>
                            ) : (
                              <span className="text-green-600 flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-1"
                                  viewBox="0 0 20 20"
                                  fill="green"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Completed
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center py-12">
              <div className="flex justify-center mb-4">
                {/* Better GIF implementation */}
                <img
                  src="/ezgif-2ea53893d930c2.webp" // Ensure this is in your public folder
                  alt="Payment processing"
                  className="w-32 h-32 object-contain" // Adjusted size for modal
                />
              </div>

              <h2 className="text-2xl font-bold text-primary mb-2">
                No Payments Found
              </h2>
              <p className="text-gray-600 mb-6">
                You currently have no pending or completed payments.
              </p>
              <button
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg flex items-center space-x-2"
                onClick={() => (window.location.href = "/my-tasks")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Browse Available Tasks</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Confirmation Dialog */}
      {showConfirmation && selectedPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="text-center mb-6">
              <div className="bg-secondary inline-block p-3 rounded-full mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Confirm Payment
              </h2>
              <p className="text-gray-500 mt-2">
                Please review payment details before confirming
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Task:</span>
                <span className="font-medium text-gray-800">
                  {selectedPayment.task}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-indigo-700">
                  Rs.{paymentInfo[selectedPayment.task]?.offerPrice || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                className="flex-1 px-5 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-medium"
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </button>
              <button
                className="flex-1 px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          onClick={() => setShowOverlay(false)}
        >
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment for "{selectedPayment.task}" has been processed
              successfully.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Task:</span>
                <span className="font-medium text-gray-800">
                  {selectedPayment.task}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-green-600">
                  Rs.{paymentInfo[selectedPayment.task]?.offerPrice || "N/A"}
                </span>
              </div>
            </div>

            <button
              className="w-full px-5 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-medium"
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
