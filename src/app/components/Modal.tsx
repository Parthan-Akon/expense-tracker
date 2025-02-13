import { addExpense } from "@/services/expensesApi";
import { Category } from "@/types/category";
import React, { useState } from "react";

interface ModalProps {
  isVisible: boolean;
  categoryList: Category[];
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, categoryList }) => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [saveButtonLabel, setSaveButtonLabel] = useState<string>("Save");

  const resetForm = () => {
    setTitle("");
    setAmount(0);
    setType("");
    setCategory("");
  };

  if (!isVisible) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(+e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSave = async () => {
    setSaveButtonLabel("Saving...");
    await addExpense(title, amount, type, category);
    setSaveButtonLabel("Save");
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-black">
          Create new purchase
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 bg-white border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Type</label>
          <select
            className="mt-1 block w-full px-3 py-2 bg-white border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            value={type}
            onChange={handleTypeChange}
          >
            <option value="" disabled>
              Select type
            </option>
            <option value="Home">Home</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            className="mt-1 block w-full px-3 py-2 bg-white border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="" disabled>
              Select category
            </option>
            {categoryList.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Amount</label>
          <input
            type="number"
            className="mt-1 block w-full px-3 py-2 bg-white border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          {saveButtonLabel}
        </button>
        <button
          className="bg-blue-500 ml-3 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
