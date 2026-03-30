import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AuthorService, Author } from './author-service';
import { AuthorForm, AuthorFormData } from './author-form/author-form';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './authors.html',
  styleUrls: ['./authors.scss'],
})
export class Authors implements OnInit {
  dataSource = new MatTableDataSource<Author>();
  displayedColumns: string[] = ['id', 'name', 'actions'];

  constructor(private authorService: AuthorService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.authorService.getAuthors().subscribe(authors => (this.dataSource.data = authors));
  }

  openAdd(): void {
    const ref = this.dialog.open(AuthorForm, {
      data: { mode: 'add' } as AuthorFormData,
      width: '400px',
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.authorService.createAuthor(result).subscribe(newAuthor => {
          this.dataSource.data = [...this.dataSource.data, newAuthor];
        });
      }
    });
  }

  openEdit(author: Author): void {
    const ref = this.dialog.open(AuthorForm, {
      data: { mode: 'edit', author } as AuthorFormData,
      width: '400px',
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        const updated = { ...result, id: author.id };
        this.authorService.updateAuthor(author.id, updated).subscribe(() => {
          this.dataSource.data = this.dataSource.data.map(a => a.id === author.id ? updated : a);
        });
      }
    });
  }

  openDelete(author: Author): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: { title: 'Delete Author', message: `Delete "${author.name}"? This cannot be undone.` },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.authorService.deleteAuthor(author.id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(a => a.id !== author.id);
        });
      }
    });
  }
}
