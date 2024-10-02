import React, { useState } from "react";
import {
  Button,
  Card,
  Progress,
  InputNumber,
  Input,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import AddExpenseModal from "./AddExpenseModal";
import TransactionModal from "./TransactionModal";
import { formatNumber } from "../utils/utils";
import { updateCategory } from "../store/budgetSlice";

const CategoryList = () => {
  const categories = useSelector((state) => state.budget.categories);
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [allocationInput, setAllocationInput] = useState(0);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setAllocationInput(category.allocation);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSave = () => {
    if (categoryName.trim() === "" || allocationInput < 0) {
      message.error("Please provide a valid name and allocation amount.");
      return;
    }

    dispatch(
      updateCategory({
        categoryId: selectedCategory.id,
        key: "name",
        value: categoryName,
      })
    );
    dispatch(
      updateCategory({
        categoryId: selectedCategory.id,
        key: "allocation",
        value: +allocationInput,
      })
    );

    message.success("Category updated successfully!");
    setIsModalVisible(false);
  };

  const handleViewTransactions = (category) => {
    setSelectedCategory(category);
    setIsTransactionModalVisible(true);
  };

  const closeTransactionModal = () => {
    setIsTransactionModalVisible(false);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {categories.map((category) => {
        const spentPercentage = (category.spent / category.allocation) * 100;
        const remaining = category.allocation - category.spent;

        return (
          <Card
            key={category.id}
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {category.name}
                </span>
                <EditOutlined
                  onClick={() => handleEditClick(category)}
                  style={{ cursor: "pointer", fontSize: "18px" }}
                />
              </div>
            }
            style={{
              width: 350,
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: "20px",
              backgroundColor: "#fff",
            }}
            bodyStyle={{ padding: "20px 15px" }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col span={24}>
                <Progress
                  percent={spentPercentage}
                  status={remaining > 0 ? "active" : "exception"}
                  strokeColor={remaining > 0 ? "#52c41a" : "#ff4d4f"}
                  format={() => `${formatNumber(spentPercentage)}% Spent`}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
              <Col span={12}>
                <p style={{ fontWeight: "500", marginBottom: "5px" }}>Spent:</p>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <p style={{ fontWeight: "500", marginBottom: "5px" }}>
                  ${formatNumber(category.spent)} / $
                  {formatNumber(category.allocation)}
                </p>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
              <Col span={12}>
                <p style={{ fontWeight: "500", marginBottom: "5px" }}>
                  Remaining:
                </p>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <p style={{ fontWeight: "500", marginBottom: "5px" }}>
                  ${formatNumber(remaining)}
                </p>
              </Col>
            </Row>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <AddExpenseModal categoryId={category.id} />
              <Button
                type="primary"
                onClick={() => handleViewTransactions(category)}
              >
                See Transactions
              </Button>
            </div>
          </Card>
        );
      })}

      {/* Modal for Editing Category */}
      {selectedCategory && (
        <Modal
          title="Edit Category"
          open={isModalVisible}
          onOk={handleSave}
          onCancel={closeModal}
          okText="Save"
          cancelText="Cancel"
        >
          <Input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            style={{ marginBottom: "10px" }}
          />
          <InputNumber
            value={allocationInput}
            onChange={(value) => setAllocationInput(value)}
            min={0}
            formatter={(value) => `$ ${value}`}
            style={{ width: "100%" }}
            placeholder="Allocation Amount"
          />
        </Modal>
      )}

      {/* Modal for Viewing Transactions */}
      {selectedCategory && (
        <TransactionModal
          open={isTransactionModalVisible}
          onClose={closeTransactionModal}
          transactions={selectedCategory.transactions}
        />
      )}
    </div>
  );
};

export default CategoryList;
