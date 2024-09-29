import React, { useState } from 'react';
import { Card, Progress } from 'antd';
import { useSelector } from 'react-redux';
import AddExpenseModal from './AddExpenseModal';
import TransactionModal from './TransactionModal';

const CategoryList = () => {
  const categories = useSelector((state) => state.budget.categories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCardClick = (category) => {
    console.log(category);
    setSelectedCategory(category);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      {categories.map((category) => {
        const spentPercentage = (category.spent / category.allocation) * 100;
        const remaining = category.allocation - category.spent;

        return (
          <Card
            key={category.id}
            title={category.name}
            style={{ marginBottom: '10px', width: 300 }}
            onClick={() => handleCardClick(category)}
          >
            <Progress
              percent={spentPercentage}
              status={remaining > 0 ? 'active' : 'exception'}
              format={() => `${spentPercentage.toFixed(2)}%`}
            />
            <p>
              Spent: ${category.spent} / ${category.allocation} <br />
              Remaining: ${remaining}
            </p>
            <AddExpenseModal categoryId={category.id} />
          </Card>
        );
      })}

      {selectedCategory && (
        <TransactionModal
          open={isModalVisible}
          onClose={closeModal}
          transactions={selectedCategory.transactions}
        />
      )}
    </div>
  );
};

export default CategoryList;
