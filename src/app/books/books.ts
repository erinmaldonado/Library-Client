import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BookService, Book } from './book-service';
import { BookForm, BookFormData } from './book-form/book-form';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';
import { AuthService } from '../auth/auth-service';
import { LoanService } from '../loans/loan-service';
import { BorrowDialog } from '../loans/borrow-dialog/borrow-dialog';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './books.html',
  styleUrls: ['./books.scss'],
})
export class Books implements OnInit {
  dataSource = new MatTableDataSource<Book>();
  isAdmin = false;
  userId = '';

  get displayedColumns(): string[] {
    return this.isAdmin
      ? ['id', 'title', 'authorName', 'category', 'publisher', 'price', 'publishYear', 'actions']
      : ['id', 'title', 'authorName', 'category', 'publisher', 'price', 'publishYear', 'borrow'];
  }

  constructor(
    private bookService: BookService,
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
    this.bookService.getBooks().subscribe(books => (this.dataSource.data = books));
  }

  openAdd(): void {
    const ref = this.dialog.open(BookForm, {
      data: { mode: 'add' } as BookFormData,
      width: '600px',
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.bookService.createBook(result).subscribe(() => this.load());
    });
  }

  openEdit(book: Book): void {
    const ref = this.dialog.open(BookForm, {
      data: { mode: 'edit', book } as BookFormData,
      width: '600px',
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.bookService.updateBook(book.id, { ...result, id: book.id }).subscribe(() => this.load());
      }
    });
  }

  openDelete(book: Book): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: { title: 'Delete Book', message: `Delete "${book.title}"? This cannot be undone.` },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.bookService.deleteBook(book.id).subscribe(() => this.load());
    });
  }

  openBorrow(book: Book): void {
    const ref = this.dialog.open(BorrowDialog, {
      data: { book },
      width: '400px',
    });
    ref.afterClosed().subscribe(dueDate => {
      if (dueDate) {
        this.loanService.createLoan(book.id, this.userId, dueDate).subscribe();
      }
    });
  }
}