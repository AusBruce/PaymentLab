import { request } from './client';
import type { Account, CreateAccountRequest, Transaction, TransferRequest } from '../types/payment';

export const paymentsApi = {
  getAccounts: (): Promise<Account[]> => request<Account[]>('/accounts'),
  createAccount: (body: CreateAccountRequest): Promise<Account> => request<Account>('/accounts', body),
  transfer: (body: TransferRequest): Promise<Transaction> => request<Transaction>('/transfers', body),
};
