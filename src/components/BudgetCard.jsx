import React, { useState } from 'react';
import { Card, Modal, Input, Progress, Row, Col, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setBudget } from '../store/budgetSlice';
import { supabase } from '../supabaseClient';
import { formatNumber } from '../utils/utils';

const BudgetCard = () => {
  const { totalBudget, categories, budgetId } = useSelector((state) => state.budget);
  const totalSpent = useSelector((state) => state.budget.totalSpent);
  const totalAllocated = categories.reduce((sum, category) => sum + +category.allocation, 0);
  const unallocated = totalBudget - totalAllocated;
  const remainingBudget = totalBudget - totalSpent;
  const spentPercentage = totalAllocated ? (totalSpent / totalAllocated) * 100 : 0;
  const allocatedPercentage = totalBudget ? (totalAllocated / totalBudget) * 100 : 0;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [budgetInput, setBudgetInput] = useState(totalBudget || 0);
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (budgetInput > 0) {
      try {
        let response;

        if (budgetId) {
          // If budgetId exists, update the budget
          response = await supabase
            .from('budgets')
            .update({ total_budget: Number(budgetInput) })
            .eq('id', budgetId);
        } else {
          // If budgetId doesn't exist, insert a new budget
          const userId = JSON.parse(localStorage.getItem('supabaseSession')).user.id
          response = await supabase
            .from('budgets')
            .insert({ total_budget: Number(budgetInput),  user_id: userId })
            .select();
        }

        const { data, error } = response;

        if (error) {
          throw error;
        }

        if (!budgetId && data && data.length > 0) {
          dispatch(setBudget({ totalBudget: Number(budgetInput), budgetId: data[0].id }));
        } else {
          dispatch(setBudget({ totalBudget: Number(budgetInput), budgetId }));
        }

        message.success(budgetId ? 'Budget updated successfully!' : 'Budget created successfully!');
        setIsModalVisible(false);
      } catch (error) {
        message.error('Failed to save budget. Please try again.');
      }
    } else {
      message.error('Please enter a valid budget amount.');
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
        style={{
          width: 350,
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        {/* Spent Progress */}
        <Row style={{ marginBottom: "15px" }}>
          <Col span={24}>
            <Progress
              percent={spentPercentage}
              status={remainingBudget > 0 ? "active" : "exception"}
              strokeColor={remainingBudget > 0 ? "#52c41a" : "#ff4d4f"}
              format={() => `Spent: ${formatNumber(spentPercentage)}%`}
              style={{ marginBottom: "10px" }}
            />
          </Col>
        </Row>

        {/* Allocated Progress */}
        <Row style={{ marginBottom: "15px" }}>
          <Col span={24}>
            <Progress
              percent={allocatedPercentage}
              strokeColor="#1890ff"
              format={() => `Allocated: ${formatNumber(allocatedPercentage)}%`}
            />
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <h3 style={{ fontWeight: 500 }}>Total Budget:</h3>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <h3 style={{ fontWeight: 500 }}>${formatNumber(totalBudget || 0)}</h3>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <p style={{ fontWeight: 500, marginBottom: "5px" }}>Spent:</p>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <p style={{ fontWeight: 500, marginBottom: "5px" }}>${formatNumber(totalSpent)}</p>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <p style={{ fontWeight: 500, marginBottom: "5px" }}>Remaining:</p>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <p style={{ fontWeight: 500, marginBottom: "5px" }}>${formatNumber(remainingBudget)}</p>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <p style={{ fontWeight: 500, marginBottom: "5px" }}>Allocated:</p>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <p style={{ fontWeight: 500, marginBottom: "5px" }}>${formatNumber(totalAllocated)}</p>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <p style={{ fontWeight: 500 }}>Unallocated:</p>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <p style={{ fontWeight: 500 }}>${formatNumber(unallocated)}</p>
          </Col>
        </Row>
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

