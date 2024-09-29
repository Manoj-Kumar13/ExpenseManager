import React, { useState } from 'react';
import { Card, Modal, Input, Progress } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setTotalBudget } from '../store/budgetSlice';

const BudgetCard = () => {
  const { totalBudget, categories } = useSelector((state) => state.budget);
  const totalSpent = useSelector((state) => state.budget.totalSpent);
  const remainingBudget = totalBudget - totalSpent;
  const spentPercentage = totalBudget ? (totalSpent / totalBudget) * 100 : 0;
  const totalAllocated = categories.reduce((sum, category) => sum + +category.allocation, 0);
  const unallocated = totalBudget - totalAllocated;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [budgetInput, setBudgetInput] = useState(totalBudget || 0);
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (budgetInput > 0) {
      dispatch(setTotalBudget(Number(budgetInput)));
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <Card
        title="Monthly Budget"
        extra={<EditOutlined onClick={showModal} />}
        style={{ width: 300 }}
      >
        <Progress
          percent={spentPercentage}
          status={remainingBudget > 0 ? "active" : "exception"}
          format={() => `${spentPercentage.toFixed(2)}%`}
        />
        <h2>
          Spent: ${totalSpent} / ${totalBudget || "-"}
        </h2>
        <p>Remaining: ${remainingBudget}</p>
        <p>Allocated: ${totalAllocated}</p>
        <p>Unallocated: ${unallocated}</p>
      </Card>

      <Modal
        title="Enter Budget"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          type="number"
          value={budgetInput}
          onChange={(e) => setBudgetInput(e.target.value)}
          placeholder="Enter Budget"
        />
      </Modal>
    </div>
  );
};

export default BudgetCard;

