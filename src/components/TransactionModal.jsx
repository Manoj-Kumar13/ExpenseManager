import React from 'react';
import { Modal, List } from 'antd';

const TransactionModal = ({ open, onClose, transactions }) => {
  return (
    <Modal title="Transactions" open={open} onCancel={onClose} footer={null}>
      <List
        dataSource={transactions}
        renderItem={(transaction) => (
          <List.Item>
            <List.Item.Meta
              title={`Amount: $${transaction.amount}`}
              description={`Date: ${transaction.date} ${transaction.note ? `| Note: ${transaction.note}` : ''}`}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default TransactionModal;
