export interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  userId: string;
  userEmail: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
}