import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { BookService, Book } from '../books/book-service';
import { AuthorService } from '../authors/author-service';
import { LoanService } from '../loans/loan-service';
import { AuthService } from '../auth/auth-service';
import { filter, take } from 'rxjs/operators'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  userName = '';
  isAdmin = false;
  bookCount = 0;
  authorCount = 0;
  loanCount = 0;
  overdueCount = 0;
  recentBooks: Book[] = [];
  today = new Date();

  private coverColors: Record<string, string> = {
    'Fiction':   '#3b4fd8',
    'Fantasy':   '#7b3fc4',
    'Mystery':   '#c44a3f',
    'Horror':    '#2d2d2d',
    'Romance':   '#c4436a',
    'default':   '#2d6a4f',
  };

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private loanService: LoanService,
    private authService: AuthService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.authService.authStatus.pipe(
    filter(isLoggedIn => isLoggedIn === true),
    take(1)
  ).subscribe(() => {
    this.isAdmin = this.authService.isAdmin();

    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      this.userName = email?.split('@')[0] ?? 'there';
    }


    forkJoin({
      bookCount: this.bookService.getBooksCount(),
      authors: this.authorService.getAuthors(),
      books: this.bookService.getBooks(1, 100),
    }).subscribe(({ bookCount, authors, books }) => {
      this.bookCount = bookCount.count;
      this.authorCount = authors.length;
      this.recentBooks = books.slice(0, 6);
    });

    const userId = this.authService.getUserId();
    if (this.isAdmin) {
      this.loanService.getAllLoans().subscribe(loans => {
        this.loanCount = loans.length;
        this.overdueCount = loans.filter(l => l.status === 'Overdue').length;
      });
    } else if (userId) {
      this.loanService.getLoansByUser(userId).subscribe(loans => {
        this.loanCount = loans.length;
        this.overdueCount = loans.filter(l => l.status === 'Overdue').length;
      });
    }
  });
}

  getCoverColor(category?: string): string {
    return this.coverColors[category ?? ''] ?? this.coverColors['default'];
  }

  goToBooks(): void {
    this.router.navigate(['/books']);
  }
}