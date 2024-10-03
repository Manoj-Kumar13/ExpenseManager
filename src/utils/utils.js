import { supabase } from '../supabaseClient';
import { store } from '../store';
import { setBudget, setCategories } from '../store/budgetSlice';
import { message } from 'antd';

export const addTransaction = async (categoryId, amount, note) => {
  const { data, error } = await supabase
    .from('Transactions')
    .insert([
      { category_id: categoryId, amount, note, created_at: new Date() }
    ]);

  if (error) {
    console.error('Error inserting transaction:', error);
  } else {
    console.log('Transaction added:', data);
  }
};


// Update spent amount in the category after adding a transaction
export const updateCategorySpentAmount = async (categoryId, newSpentAmount) => {
    const { error } = await supabase
      .from('Categories')
      .update({ spent_amount: newSpentAmount })
      .eq('id', categoryId);
  
    if (error) console.error('Error updating spent amount:', error);
  };
  
  // Update unallocated budget after category allocation changes
export const updateUnallocatedBudget = async (budgetId, newUnallocatedAmount) => {
    const { error } = await supabase
      .from('Budgets')
      .update({ unallocated_budget: newUnallocatedAmount })
      .eq('id', budgetId);
  
    if (error) console.error('Error updating unallocated budget:', error);
  };
  
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
      store.dispatch(
        setBudget({ budgetId: budget.id, totalBudget: budget.total_budget })
      );

      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("budget_id", budget.id);

      if (categoryError) {
        throw categoryError;
      }

      if (categoryData) {
        store.dispatch(setCategories(categoryData));
      }
    } catch (error) {
      message.error(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };