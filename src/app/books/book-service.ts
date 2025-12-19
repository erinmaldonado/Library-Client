import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Book {
  id: number;
  title: string;
  description?: string;
  category?: string;
  publisher?: string;
  price?: number;
  publishMonth?: string;
  publishYear?: number;
  authorId: number;
  authorName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = environment.apiUrl + 'api/Books';

  constructor(private http: HttpClient) {}

  getBooks(page: number = 1, pageSize: number = 50): Observable<Book[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<Book[]>(this.apiUrl, { params });
  }

  getBooksCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/count`);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  getBooksByAuthor(authorId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/ByAuthor/${authorId}`);
  }

  getBooksByCategory(category: string): Observable<Book[]> {
    const params = new HttpParams().set('category', category);
    return this.http.get<Book[]>(`${this.apiUrl}/ByCategory`, { params });
  }

  createBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Book): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}