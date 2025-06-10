// src/components/TransactionForm.js
import { useState } from 'react';

const TransactionForm = ({ invoiceId }) => {
  const [amount, setAmount] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId, amount })
    });
    if (response.ok) {
      alert('Transaction processed successfully');
    } else {
      alert('Failed to process transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <button type="submit">Submit Transaction</button>
    </form>
  );
};

export default TransactionForm;
