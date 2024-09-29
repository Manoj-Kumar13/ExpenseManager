// src/hooks/useTransactions.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function useTransactions(categoryId) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('Transactions')
        .select('*')
        .eq('category_id', categoryId);

      if (error) console.error(error);
      else setTransactions(data);
    };

    fetchTransactions();
  }, [categoryId]);

  return transactions;
}
