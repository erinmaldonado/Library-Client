import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Author } from './author-service';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [
    RouterLink, 
    AsyncPipe,
    MatTableModule,
    MatCardModule
  ],
  templateUrl: './authors.html',
  styleUrls: ['./authors.scss']
})
export class Authors {
  authors$: Observable<Author[]> = new Observable();
  displayedColumns: string[] = ['id', 'name'];

  constructor(http: HttpClient) {
    this.authors$ = http.get<Author[]>(environment.apiUrl + 'api/Authors');
  }
}