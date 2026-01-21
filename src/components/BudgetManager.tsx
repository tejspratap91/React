import { useState, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import '../styles/BudgetManager.css'

interface Transaction {
  id: number
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: Date
}

interface CategoryStats {
  [key: string]: number
}

function BudgetManager() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', [])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [category, setCategory] = useState('Food')
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Other']
  const incomeCategories = ['Salary', 'Bonus', 'Investment', 'Other']

  const categories = type === 'income' ? incomeCategories : expenseCategories

  const addTransaction = () => {
    if (description.trim() && amount && parseFloat(amount) > 0) {
      const newTransaction: Transaction = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date(),
      }
      setTransactions([newTransaction, ...transactions])
      setDescription('')
      setAmount('')
      setCategory(type === 'income' ? 'Salary' : 'Food')
    }
  }

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true
    return t.type === filter
  })

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const categoryStats: CategoryStats = {}
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        categoryStats[t.category] = (categoryStats[t.category] || 0) + t.amount
      }
    })

    return {
      income,
      expense,
      balance: income - expense,
      categoryStats,
    }
  }, [transactions])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="budget-container">
      <h2>Budget Manager</h2>


      {/* Stats Cards */}
      <div className="budget-stats">
        <div className="stat-card income">
          <span className="stat-icon">📈</span>
          <div className="stat-content">
            <span className="stat-label">Total Income</span>
            <span className="stat-value">{formatCurrency(stats.income)}</span>
          </div>
        </div>
        <div className="stat-card expense">
          <span className="stat-icon">📉</span>
          <div className="stat-content">
            <span className="stat-label">Total Expense</span>
            <span className="stat-value">{formatCurrency(stats.expense)}</span>
          </div>
        </div>
        <div className={`stat-card balance ${stats.balance >= 0 ? 'positive' : 'negative'}`}>
          <span className="stat-icon">💰</span>
          <div className="stat-content">
            <span className="stat-label">Balance</span>
            <span className="stat-value">{formatCurrency(stats.balance)}</span>
          </div>
        </div>
      </div>

      <div className="budget-layout">
        {/* Add Transaction Form */}
        <div className="transaction-form">
          <h3>Add Transaction</h3>

          <div className="form-group">
            <label>Type</label>
            <div className="type-toggle">
              <button
                onClick={() => {
                  setType('expense')
                  setCategory('Food')
                }}
                className={`toggle-btn ${type === 'expense' ? 'active' : ''}`}
              >
                💸 Expense
              </button>
              <button
                onClick={() => {
                  setType('income')
                  setCategory('Salary')
                }}
                className={`toggle-btn ${type === 'income' ? 'active' : ''}`}
              >
                💵 Income
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this for?"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="form-input"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={addTransaction}
            className="form-submit-btn"
            disabled={!description.trim() || !amount}
          >
            Add Transaction
          </button>
        </div>

        {/* Transactions List */}
        <div className="transactions-section">
          <h3>Transactions</h3>

          <div className="transaction-filters">
            {(['all', 'income', 'expense'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="transactions-list">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`transaction-item ${transaction.type}`}
                >
                  <div className="transaction-info">
                    <div>
                      <h4>{transaction.description}</h4>
                      <small>{transaction.category}</small>
                    </div>
                    <span className="transaction-date">{formatDate(transaction.date)}</span>
                  </div>
                  <div className="transaction-amount-section">
                    <span
                      className={`transaction-amount ${transaction.type === 'income' ? 'income' : 'expense'}`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="delete-btn"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message">No transactions yet</p>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        {Object.keys(stats.categoryStats).length > 0 && (
          <div className="category-breakdown">
            <h3>Expense Breakdown</h3>
            <div className="category-list">
              {Object.entries(stats.categoryStats)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const percentage = (amount / stats.expense) * 100
                  return (
                    <div key={category} className="category-item">
                      <div className="category-info">
                        <span className="category-name">{category}</span>
                        <span className="category-amount">{formatCurrency(amount)}</span>
                      </div>
                      <div className="category-bar">
                        <div
                          className="category-bar-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="category-percent">{percentage.toFixed(1)}%</span>
                    </div>
                  )
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BudgetManager
