import React, { useState, useEffect } from "react";
import axios from "axios";
import Subheader from "./assets/subheader";
import Sidebar from "./assets/sidebar";

const PaymentPage = () => {


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
                 <tr className="border-t hover:bg-gray-100">
                        <td className="py-3 px-4">Test</td>
                        <td className="py-3 px-4">Test</td>
                        <td className="py-3 px-4">Test</td>
                        <td className="py-3 px-4">Test</td>
                        </tr>
              </tbody>

            </table>
        </div>
        </div>
  );
};

export default PaymentPage;
