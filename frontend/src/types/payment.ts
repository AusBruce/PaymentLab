export interface Account {
  id: string;
  ownerName: string;
  balance: number;
}

export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  createdAt: string;
}

export interface CreateAccountRequest {
  ownerName: string;
  initialBalance: number;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}

export type View = 'overview' | 'accounts' | 'activity';
export type PendingAction = 'create' | 'transfer' | null;
