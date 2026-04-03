import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
    MatAutocompleteModule,
    MatSelectModule,
    AsyncPipe,
  ],
  templateUrl: './book-form.html',
})
export class BookForm implements OnInit {
  form: FormGroup;
  authors: Author[] = [];
  filteredAuthors!: Observable<Author[]>;
  authorSearch = new FormControl('');
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
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
    this.authorService.getAuthors().subscribe((authors) => {
      this.authors = authors;

      // Pre-fill the search input if editing
      if (this.data.book?.authorId) {
        const existing = authors.find((a) => a.id === this.data.book!.authorId);
        if (existing) this.authorSearch.setValue(existing.name);
      }

      // Set up filtered list that reacts to typing
      this.filteredAuthors = this.authorSearch.valueChanges.pipe(
        startWith(this.authorSearch.value ?? ''),
        map((value) => this._filter(value ?? '')),
      );
    });
  }

  get title() {
    return this.form.controls['title'];
  }
  get price() {
    return this.form.controls['price'];
  }
  get publishYear() {
    return this.form.controls['publishYear'];
  }
  get authorId() {
    return this.form.controls['authorId'];
  }

  private _filter(value: string): Author[] {
    const filterValue = value.toLowerCase();
    return this.authors.filter((a) => a.name.toLowerCase().includes(filterValue));
  }
  selectAuthor(author: Author): void {
    this.form.controls['authorId'].setValue(author.id);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
