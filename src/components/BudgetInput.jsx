import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { setTotalBudget } from '../store/budgetSlice';

const BudgetInput = () => {
  const [budget, setBudget] = useState(0);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(setTotalBudget(+budget));
  };

  return (
    <div>
      <Input
        placeholder="Enter Monthly Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        type="number"
      />
      <Button type="primary" onClick={handleSubmit}>
        Set Budget
      </Button>
    </div>
  );
};

export default BudgetInput;
