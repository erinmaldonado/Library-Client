import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BookService, Book } from './book-service';
import { BookForm, BookFormData } from './book-form/book-form';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
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
  displayedColumns: string[] = [
    'id', 'title', 'authorName', 'category', 'publisher', 'price', 'publishYear', 'actions',
  ];

  constructor(private bookService: BookService, private dialog: MatDialog) {}

  ngOnInit(): void {
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
      if (result) {
        this.bookService.createBook(result).subscribe(newBook => {
          this.dataSource.data = [...this.dataSource.data, newBook];
        });
      }
    });
  }

  openEdit(book: Book): void {
    const ref = this.dialog.open(BookForm, {
      data: { mode: 'edit', book } as BookFormData,
      width: '600px',
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        const updated = { ...result, id: book.id };
        this.bookService.updateBook(book.id, updated).subscribe(() => {
          this.dataSource.data = this.dataSource.data.map(b => b.id === book.id ? updated : b);
        });
      }
    });
  }

  openDelete(book: Book): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: { title: 'Delete Book', message: `Delete "${book.title}"? This cannot be undone.` },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.bookService.deleteBook(book.id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(b => b.id !== book.id);
        });
      }
    });
  }
}
