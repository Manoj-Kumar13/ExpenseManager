import { supabase } from '../supabaseClient';

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