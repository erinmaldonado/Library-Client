import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthorWithBooks } from '../authors/author-service';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [
    RouterLink, 
    AsyncPipe,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './author-detail.html',
  styleUrls: ['./author-detail.scss']
})
export class AuthorDetail {
  author$: Observable<AuthorWithBooks> = new Observable();
  displayedColumns: string[] = ['id', 'title', 'category', 'publisher', 'price', 'publishYear'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    http: HttpClient
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.author$ = http.get<AuthorWithBooks>(environment.apiUrl + `api/Authors/${id}/books`);
    }
  }

  goBack(): void {
    this.router.navigate(['/authors']);
  }
}