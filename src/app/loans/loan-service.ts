import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Loan } from './loan.model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private base = environment.apiUrl + 'api/Loans';

  constructor(private http: HttpClient) {}

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.base);
  }

  getLoansByUser(userId: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.base}/user/${userId}`);
  }

  createLoan(bookId: number, userId: string, dueDate: string): Observable<any> {
    return this.http.post(this.base, { bookId, userId, dueDate });
  }

  returnLoan(loanId: number): Observable<any> {
    return this.http.put(`${this.base}/${loanId}/return`, { returnDate: new Date().toISOString() });
  }

  markOverdue(): Observable<any> {
    return this.http.put(`${this.base}/update-overdue`, {});
  }

  deleteLoan(loanId: number): Observable<any> {
    return this.http.delete(`${this.base}/${loanId}`);
  }
}