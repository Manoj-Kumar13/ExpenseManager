import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalBudget: 0,
  totalSpent: 0,
  categories: [],
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setTotalBudget: (state, action) => {
      state.totalBudget = action.payload;
    },
    addCategory: (state, action) => {
      state.categories.push({ ...action.payload, transactions: [], spent: 0 });
    },
    addExpense: (state, action) => {
      const { categoryId, amount, note } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        const transaction = { 
          amount, 
          note: note || '',
          date: new Date().toLocaleDateString() 
        };
        category.transactions.push(transaction);
        category.spent += amount;
        state.totalSpent += amount;
      }
    },
    updateCategory: (state, action) => {
      const { categoryId, key, value } = action.payload;
      const category = state.categories.find((cat) => cat.id === categoryId);
      if (category) {
        category[key] = value;
      }
    },
  },
});

export const { setTotalBudget, addCategory, addExpense, updateCategory } = budgetSlice.actions;
export default budgetSlice.reducer;
