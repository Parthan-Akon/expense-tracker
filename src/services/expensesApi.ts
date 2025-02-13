// src/services/expensesApi.ts

export async function getExpenses() {
  const res = await fetch("/api/expenses", {
    method: "GET",
    cache: "no-store", // Avoid caching for development
  });

  if (!res.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return res.json();
}

export async function addExpense(
  title: string,
  amount: number,
  type: string,
  category: string
) {
  const res = await fetch("/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, amount, type, category }),
  });

  if (!res.ok) {
    throw new Error("Failed to add expense");
  }

  return res.json();
}
