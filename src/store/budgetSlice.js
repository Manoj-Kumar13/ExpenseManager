import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  budgetId: null,
  totalBudget: 0,
  totalSpent: 0,
  categories: [],
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setBudget: (state, action) => {
      const { budgetId, totalBudget } = action.payload;
      state.budgetId = budgetId;
      state.totalBudget = totalBudget;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
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
    clearBudget: (state) => {
      state.budgetId = null;
      state.totalBudget = 0;
      state.totalSpent = 0;
      state.categories = [];
    },
  },
});

export const { setBudget, setCategories, addCategory, addExpense, updateCategory, clearBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
