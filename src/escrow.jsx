import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Escrow = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState("Verifying payment...");
  const [isSuccess, setIsSuccess] = useState(false);
  const isExecuted = useRef(false); // Track execution

  // Clean the transaction UUID
  const transaction_uuid = searchParams.get("transaction_uuid");
  const cleanTransactionUUID = transaction_uuid ? transaction_uuid.split("?")[0] : null;

  useEffect(() => {
    const verifyPaymentAndSaveAgreement = async () => {
      if (!cleanTransactionUUID || isExecuted.current) return; // Prevent duplicate execution

      isExecuted.current = true; // Mark as executed

      try {
        // Verify payment
        const paymentResponse = await axios.post("http://localhost:3000/verify-payment", {
          transaction_uuid: cleanTransactionUUID,
          
        });

        if (paymentResponse.data.success) {
          setPaymentStatus("Payment verified successfully! 🎉");
          setIsSuccess(true);

          // Retrieve agreement data from localStorage
         
        } else {
          setPaymentStatus("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        console.error("Error:", error);
        setPaymentStatus("Error: Payment verification failed. Please contact support.");
      }
    };

    verifyPaymentAndSaveAgreement();
  }, [cleanTransactionUUID]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-full max-w-md">
        {isSuccess ? (
          <h2 className="text-2xl font-semibold text-green-600 animate-pulse">{paymentStatus}</h2>
        ) : (
          <h2 className="text-2xl font-semibold text-red-600">🕵️‍♀️ Escrow Service!</h2>
        )}

        <p className="text-gray-600 mt-4">{paymentStatus}</p>
<div className="flex justify-between">
        <button
          onClick={() => navigate("/home")}
          className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-xl shadow-md hover:bg-blue-700 transition duration-300"
        >
          Go to Home
        </button>
        <button
          onClick={() => navigate("/paymentpage")}
          className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-xl shadow-md hover:bg-blue-700 transition duration-300"
        >
          Go to Payment
        </button>
        </div>
      </div>
    </div>
  );
};

export default Escrow;