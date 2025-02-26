import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Success = () => {
  const [searchParams] = useSearchParams();
  const transaction_uuid = searchParams.get("transaction_uuid");

  // Extract only the transaction_uuid without the "?data" part
  const cleanTransactionUUID = transaction_uuid ? transaction_uuid.split("?")[0] : null;

  const [paymentStatus, setPaymentStatus] = useState("Verifying payment...");

  useEffect(() => {
    if (!cleanTransactionUUID) {
      console.error("Transaction UUID missing in URL");
      setPaymentStatus("Error: Transaction UUID missing in URL");
      return;
    }

    const verifyPayment = async () => {
      try {
        console.log("Sending transaction_uuid:", cleanTransactionUUID);
        const response = await axios.post("http://localhost:3000/verify-payment", {
          transaction_uuid: cleanTransactionUUID,
          status: "Completed", // Ensure this matches the expected status in the backend
        });
        console.log("Verification response:", response.data);
        setPaymentStatus("Payment verified successfully! 🎉");
      } catch (error) {
        console.error("Payment verification failed", error);
        setPaymentStatus("Error: Payment verification failed. Please contact support.");
      }
    };

    verifyPayment();
  }, [cleanTransactionUUID]);

  return (
    <div>
      <h2>Payment Status</h2>
      <p>{paymentStatus}</p>
    </div>
  );
};

export default Success;