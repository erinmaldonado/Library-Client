import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { LoanService } from './loan-service';
import { AuthService } from '../auth/auth-service';
import { Loan } from './loan.model';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './loans.html',
  styleUrls: ['./loans.scss'],
})
export class Loans implements OnInit {
  isAdmin = false;
  userId = '';
  allLoans: Loan[] = [];
  dataSource = new MatTableDataSource<Loan>();

  // Admin filters
  filterUser = '';
  filterStatus = '';
  uniqueUsers: string[] = [];

  // Admin columns
  adminColumns = ['bookTitle', 'userEmail', 'loanDate', 'dueDate', 'status', 'actions'];
  // User columns
  userColumns = ['bookTitle', 'loanDate', 'dueDate', 'status'];

  get displayedColumns() {
    return this.isAdmin ? this.adminColumns : this.userColumns;
  }

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.userId = this.authService.getUserId() ?? '';
    this.load();
  }

  load(): void {
    if (this.isAdmin) {
      this.loanService.getAllLoans().subscribe(loans => {
        this.allLoans = loans;
        this.uniqueUsers = [...new Set(loans.map(l => l.userEmail))];
        this.applyFilters();
      });
    } else {
      this.loanService.getLoansByUser(this.userId).subscribe(loans => {
        this.dataSource.data = loans;
      });
    }
  }

  applyFilters(): void {
    let filtered = [...this.allLoans];
    if (this.filterUser) filtered = filtered.filter(l => l.userEmail === this.filterUser);
    if (this.filterStatus) filtered = filtered.filter(l => l.status === this.filterStatus);
    this.dataSource.data = filtered;
  }

  clearFilters(): void {
    this.filterUser = '';
    this.filterStatus = '';
    this.applyFilters();
  }

  markOverdue(): void {
    this.loanService.markOverdue().subscribe(() => this.load());
  }

  returnLoan(loan: Loan): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: { title: 'Return Book', message: `Mark "${loan.bookTitle}" as returned?` }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.loanService.returnLoan(loan.id).subscribe(() => this.load());
    });
  }

  deleteLoan(loan: Loan): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: { title: 'Delete Loan', message: `Delete loan for "${loan.bookTitle}"? This cannot be undone.` }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.loanService.deleteLoan(loan.id).subscribe(() => this.load());
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active': return 'primary';
      case 'Overdue': return 'warn';
      case 'Returned': return 'accent';
      default: return '';
    }
  }
}