"use client";
import { useEffect, useState } from "react";

import { getExpenses } from "@/services/expensesApi";
import { Expense } from "@/types/expense";

export default function Home() {
  const totalAmount: number = 80000;
  const [expenseData, setExpenseData] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getExpenses();
      
      setExpenseData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="max-w-md p-4 bg-white h-auto w-full">
        <div id="header-part" className="fixed left-0 top-0 right-0">
          <h2 className="text-xl font-bold text-gray-800 text-center mt-2">
            Expense tracker
          </h2>
          <div className="font-bold text-4xl text-center text-darkcyan mt-2 mb-3">
            ₹{totalAmount.toLocaleString()}
          </div>
        </div>
        <div id="expense-table" className="mt-20 overflow-y-auto max-h-custom">
          <table className="min-w-full divide-y divide-gray-200 text-black w-full table-fixed">
            <thead>
              <tr>
                <th className="text-left px-0.5 py-3 bg-gray-50 w-1.5">No.</th>
                <th className="text-left px-6 py-3 bg-gray-50">Purchase</th>
                <th className="text-left px-6 py-3 bg-gray-50">Type</th>
                <th className="text-left px-6 py-3 bg-gray-50">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenseData.map((item) => (
                <tr key={item.id} className="bg-white even:bg-gray-50">
                  <td className="text-left px-0.5 py-4 w-1.5">1</td>
                  <td className="text-left px-6 py-4 whitespace-normal break-words">
                    {item.title}
                  </td>
                  <td className="text-left px-6 py-4 whitespace-nowrap">
                    {item.type}
                  </td>
                  <td className="text-left px-6 py-4 whitespace-normal break-words">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
