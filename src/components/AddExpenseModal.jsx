import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { addExpense } from '../store/budgetSlice';

const AddExpenseModal = ({ categoryId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const dispatch = useDispatch();

  const showModal = (e) => {
    e.stopPropagation();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (amount > 0) {
      dispatch(addExpense({ categoryId, amount: Number(amount), note }));
      setAmount(0);
      setNote('');
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="link" onClick={(e) => {showModal(e)}}>Add Expense</Button>

      <Modal
        title="Add Expense"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount"
        />
        <Input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter Note (optional)"
          style={{ marginTop: '10px' }}
        />
      </Modal>
    </>
  );
};

export default AddExpenseModal;
