import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book } from './book-service';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    RouterLink, 
    AsyncPipe,
    MatTableModule,
    MatSortModule,
    MatCardModule
  ],
  templateUrl: './books.html',
  styleUrls: ['./books.scss']
})
export class Books {
  books$: Observable<Book[]> = new Observable();
  displayedColumns: string[] = ['id', 'title', 'authorName', 'category', 'publisher', 'price', 'publishYear'];

  constructor(http: HttpClient) {
    this.books$ = http.get<Book[]>(environment.apiUrl + 'api/Books');
  }
}