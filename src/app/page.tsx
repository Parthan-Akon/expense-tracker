"use client";
import { Suspense, useEffect, useState } from "react";
import { getExpenses } from "@/services/expensesApi";
import { Expense } from "@/types/expense";
import Modal from "./components/Modal";
import { getCategories } from "@/services/categoryApi";
import { Category } from "@/types/category";
import useUserInitializer from "./hooks/useUserInitializer";
import { useAppContext } from "./context/AppContext";
import { USERS } from "./constants";

export default function Home() {
  // This can be removed, once login page is done.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

const HomeContent = () => {
  useUserInitializer();
  const totalAmount: number = 72000;
  const [expenseData, setExpenseData] = useState<Expense[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);
  const [remainingAmount, setRemainingAmount] = useState<number>(0);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const { user = "" } = useAppContext();

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      setCategoryList(data);
    }
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        return;
      }

      let userEmail: string = "";
      if (user === "parthan") {
        userEmail = USERS.PARTHAN.email;
      }
      if (user === "anjaly") {
        userEmail = USERS.ANJALY.email;
      }
      const data = await getExpenses(userEmail);
      const remaining = data.reduce((acc: number, data: Expense) => {
        return acc - data.amount;
      }, totalAmount);
      setRemainingAmount(remaining);
      setExpenseData(data);
    };

    fetchData();
  }, [refresh, user]);

  const handleModalOpen = (): void => {
    setIsModalVisible(true);
  };

  const handleModalClose = (): void => {
    setRefresh((prev) => prev + 1);
    setIsModalVisible(false);
  };

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
          <div className="text-center mt-2 text-black">
            Remaining ₹{remainingAmount.toFixed(2)}
          </div>
        </div>
        {/* Button to open modal */}
        <div className="mt-32 flex justify-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleModalOpen}
          >
            Open Modal
          </button>
        </div>
        {/* Table */}
        <div id="expense-table" className="mt-20 overflow-y-auto max-h-custom">
          <table className="min-w-full divide-y divide-gray-200 text-black w-full table-fixed">
            <thead>
              <tr>
                <th className="text-left px-6 py-3 bg-gray-50">Purchase</th>
                <th className="text-left px-6 py-3 bg-gray-50">Type</th>
                <th className="text-left px-6 py-3 bg-gray-50">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenseData.map((item) => (
                <tr key={item.id} className="bg-white even:bg-gray-50">
                  <td className="text-left px-6 py-4 whitespace-normal break-words">
                    {item.title}
                  </td>
                  <td className="text-left px-6 py-4 whitespace-nowrap">
                    {item.type}
                  </td>
                  <td className="text-left px-6 py-4 whitespace-normal break-words">
                    ₹{item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal */}
        <Modal
          isVisible={isModalVisible}
          onClose={handleModalClose}
          categoryList={categoryList}
        />
      </div>
    </div>
  );
};
