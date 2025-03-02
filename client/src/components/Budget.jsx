import React, { useState, useEffect } from 'react';
import { fetchAccounts, addTransaction, fetchTransactions, deleteTransaction } from '../firestore';
import './Budget.css';

