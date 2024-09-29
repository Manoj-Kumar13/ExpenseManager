import React from 'react';
import { Button } from 'antd';
import { jsPDF } from 'jspdf';
import { useSelector } from 'react-redux';

const ReportDownloadButton = () => {
  const { totalBudget, categories } = useSelector((state) => state.budget);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text('Expense Report', 20, 10);
    doc.text(`Total Budget: $${totalBudget}`, 20, 20);

    categories.forEach((category, index) => {
      const yOffset = 30 + index * 10;
      doc.text(
        `${category.name}: Allocated: $${category.allocation}, Spent: $${category.spent}`,
        20,
        yOffset
      );

      category.transactions.forEach((transaction, txnIndex) => {
        const txnYOffset = yOffset + 20 + txnIndex * 8;
        doc.text(
          `  - $${transaction.amount} on ${transaction.date}${transaction.note ? ` (Note: ${transaction.note})` : ''}`,
          30,
          txnYOffset
        );
      });
    });

    doc.save('expense-report.pdf');
  };

  return <Button onClick={generatePDF}>Download Report</Button>;
};

export default ReportDownloadButton;
