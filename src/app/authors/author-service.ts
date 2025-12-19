import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book } from '../books/book-service';

export interface Author {
  id: number;
  name: string;
}

export interface AuthorWithBooks {
  id: number;
  name: string;
  books: Book[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private apiUrl = environment.apiUrl + 'api/Authors';

  constructor(private http: HttpClient) {}

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl);
  }

  getAuthor(id: number): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/${id}`);
  }

  getAuthorWithBooks(id: number): Observable<AuthorWithBooks> {
    return this.http.get<AuthorWithBooks>(`${this.apiUrl}/${id}/books`);
  }

  createAuthor(author: Omit<Author, 'id'>): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, author);
  }

  updateAuthor(id: number, author: Author): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, author);
  }

  deleteAuthor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}