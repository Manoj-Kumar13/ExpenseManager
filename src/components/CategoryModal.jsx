import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory } from '../store/budgetSlice';
import { PlusOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';

const CategoryModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [allocation, setAllocation] = useState(0);
  const dispatch = useDispatch();
  const { budgetId } = useSelector((state) => state.budget);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (!categoryName || allocation <= 0) {
      message.error('Please enter a valid category name and allocation.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          category_name: categoryName,
          allocated_amount: allocation,
          budget_id: budgetId,
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const newCategory = { id: data[0].id, name: categoryName, allocation };
        dispatch(addCategory(newCategory));

        message.success('Category added successfully!');
        setCategoryName('');
        setAllocation(0);
        setIsModalVisible(false);
      }
    } catch (error) {
      message.error('Failed to save category. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={showModal} />

      <Modal
        title="Add Category"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <Input
          placeholder="Allocation"
          type="number"
          value={allocation}
          onChange={(e) => setAllocation(+e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default CategoryModal;
