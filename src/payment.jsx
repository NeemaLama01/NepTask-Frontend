import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:3000/payment", formData);
      const esewaData = response.data;

      // Redirect user to Esewa payment page with form data
      const paymentUrl = `https://rc-epay.esewa.com.np/api/epay/main/v2/form`;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentUrl;

      Object.keys(esewaData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = esewaData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to initiate payment.");
    }
  };

  return (
    <div>
      <h2>Pay with Esewa</h2>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default Payment;