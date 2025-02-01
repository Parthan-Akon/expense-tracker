import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="max-w-md p-4 bg-white h-full w-full">
        <h2 className="text-xl font-bold text-gray-800">Expense tracker</h2>
        <p className="text-gray-600">
          This is first release of Expense tracker application.
        </p>
      </div>
    </div>
  );
}
