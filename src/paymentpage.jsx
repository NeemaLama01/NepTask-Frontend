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

  // Fetch all payments on mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/getPayments")
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching payments:", error);
      });
  }, []);

  // Fetch additional info for each payment after payments are loaded
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const paymentData = {};
      await Promise.all(
        payments.map(async (payment) => {
          try {
            const response = await axios.get("http://localhost:3000/getinfo", {
              params: { task: payment.task },
            });
            paymentData[payment.task] = response.data.data;
          } catch (error) {
            console.error(`Error fetching info for ${payment.task}:`, error);
          }
        })
      );
      setPaymentInfo(paymentData);
    };

    if (payments.length > 0) {
      fetchPaymentDetails();
    }
  }, [payments]);

  // Handle payment process
  const handlePayNow = async (payment) => {
    setSelectedPayment(payment);
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    try {
      // Optimistically update the UI
      setPayments((prevPayments) =>
        prevPayments.map((p) =>
          p.task === selectedPayment.task ? { ...p, status: "Paid" } : p
        )
      );

      // Show overlay
      setShowOverlay(true);

      // Send API request to update payment status in the backend
      await axios.put("http://localhost:3000/updatepaymentstatus", {
        task: selectedPayment.task,
        status: "Paid",
      });

      // Hide overlay after 2 seconds
      setTimeout(() => setShowOverlay(false), 2000);
    } catch (error) {
      console.error("Error updating payment status:", error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleCancelPayment = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold text-black mb-10">
            Your Payments
          </h1>
          <Subheader />
        </div>
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="text-left text-white bg-primary">
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
                  <td className="py-3 px-4">{paymentInfo[payment.task]?.tasker}</td>
                  <td className="py-3 px-4">Rs.{paymentInfo[payment.task]?.offerPrice}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Confirmation Dialog */}
      {showConfirmation && selectedPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-gray-800">Confirm Payment</h2>
            <p className="text-gray-600 mt-2">Task: {selectedPayment.task}</p>
            <p className="text-gray-600">Amount: Rs.{paymentInfo[selectedPayment.task]?.offerPrice}</p>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-green text-white rounded-md hover:bg-green-600 mr-2"
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </button>
              <button
                className="px-4 py-2 bg-red text-white rounded-md hover:bg-red-600"
                onClick={handleCancelPayment}
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
          onClick={() => setShowOverlay(false)} // Close overlay on click
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-green">Payment Successful</h2>
            <p className="text-gray-600 mt-2">Task: {selectedPayment.task}</p>
            <p className="text-gray-600">Amount: Rs.{paymentInfo[selectedPayment.task]?.offerPrice}</p>
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