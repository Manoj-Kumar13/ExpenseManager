import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { addCategory } from '../store/budgetSlice';
import { PlusOutlined } from '@ant-design/icons';

const CategoryModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [allocation, setAllocation] = useState(0);
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    dispatch(addCategory({ id: Date.now(), name: categoryName, allocation }));
    setCategoryName('');
    setAllocation(0);
    setIsModalVisible(false);
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
