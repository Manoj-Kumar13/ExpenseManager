// src/hooks/useCategories.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function useCategories(budgetId) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('Categories')
        .select('*')
        .eq('budget_id', budgetId);

      if (error) console.error(error);
      else setCategories(data);
    };

    fetchCategories();
  }, [budgetId]);

  return categories;
}
