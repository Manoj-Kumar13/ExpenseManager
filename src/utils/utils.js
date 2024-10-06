import { supabase } from "../supabaseClient";
import { store } from "../store";
import { setBudget, setCategories } from "../store/budgetSlice";
import { message } from "antd";

export const formatNumber = (num) => {
  return num % 1 === 0 ? +num.toFixed(0) : +num.toFixed(2);
};

export const fetchBudgetData = async (userId, loading, setLoading) => {
  if (loading) return;

  setLoading(true);

  try {
    const { data: budgetData, error: budgetError } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId);

    if (budgetError) {
      throw budgetError;
    }

    if (!budgetData || budgetData.length === 0) {
      message.warning("No budget data found for the user.");
      return;
    }

    if (budgetData.length > 1) {
      message.error("Multiple budget entries found. Please contact support.");
      return;
    }

    const budget = budgetData[0];

    // Fetch category data
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .eq("budget_id", budget.id);

    if (categoryError) {
      throw categoryError;
    }

    let totalSpent = 0;

    if (categoryData && categoryData.length > 0) {
      // Fetch transactions for each category
      const categoryPromises = categoryData.map(async (category) => {
        const { data: transactions, error: transactionError } = await supabase
          .from("transactions")
          .select("*")
          .eq("category_id", category.id);

        if (transactionError) {
          throw transactionError;
        }

        // Format transactions and calculate spent amount
        const formattedTransactions = (transactions || []).map(
          (transaction) => ({
            id: transaction.id,
            amount: transaction.amount,
            note: transaction.note || "",
            date: new Date(transaction.created_at).toLocaleDateString(), // Convert created_at to date
          })
        );

        const spentInCategory = formattedTransactions.reduce(
          (sum, t) => sum + t.amount,
          0
        );
        totalSpent += spentInCategory; // Add to the total spent for the entire budget

        return {
          id: category.id,
          name: category.category_name,
          allocation: category.allocated_amount,
          spent: spentInCategory, // Total spent for this category
          remaining: category.allocated_amount - spentInCategory, // Remaining amount in this category
          transactions: formattedTransactions, // Include the transactions
        };
      });

      // Wait for all transaction data to be fetched
      const formattedCategories = await Promise.all(categoryPromises);

      // Dispatch the categories with transactions and updated spent/remaining amounts
      store.dispatch(setCategories(formattedCategories));

      // Update the total spent and remaining for the budget
      store.dispatch(
        setBudget({
          budgetId: budget.id,
          totalBudget: budget.total_budget,
          totalSpent: totalSpent,
        })
      );
    }
  } catch (error) {
    message.error(`Error fetching data: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
