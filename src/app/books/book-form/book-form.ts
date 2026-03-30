import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AuthorService, Author } from '../../authors/author-service';
import { Book } from '../book-service';

export interface BookFormData {
  mode: 'add' | 'edit';
  book?: Book;
}

@Component({
  selector: 'app-book-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './book-form.html',
})
export class BookForm implements OnInit {
  form: FormGroup;
  authors: Author[] = [];
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  constructor(
    private dialogRef: MatDialogRef<BookForm>,
    @Inject(MAT_DIALOG_DATA) public data: BookFormData,
    private authorService: AuthorService,
  ) {
    const b = data.book;
    this.form = new FormGroup({
      title: new FormControl(b?.title ?? '', [Validators.required]),
      description: new FormControl(b?.description ?? ''),
      category: new FormControl(b?.category ?? ''),
      publisher: new FormControl(b?.publisher ?? ''),
      price: new FormControl(b?.price ?? null, [Validators.min(0)]),
      publishMonth: new FormControl(b?.publishMonth ?? ''),
      publishYear: new FormControl(b?.publishYear ?? null, [
        Validators.min(1000),
        Validators.max(9999),
      ]),
      authorId: new FormControl(b?.authorId ?? null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.authorService.getAuthors().subscribe(authors => (this.authors = authors));
  }

  get title() { return this.form.controls['title']; }
  get price() { return this.form.controls['price']; }
  get publishYear() { return this.form.controls['publishYear']; }
  get authorId() { return this.form.controls['authorId']; }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
