import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Author } from '../author-service';

export interface AuthorFormData {
  mode: 'add' | 'edit';
  author?: Author;
}

@Component({
  selector: 'app-author-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './author-form.html',
})
export class AuthorForm {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AuthorForm>,
    @Inject(MAT_DIALOG_DATA) public data: AuthorFormData,
  ) {
    this.form = new FormGroup({
      name: new FormControl(data.author?.name ?? '', [Validators.required]),
    });
  }

  get name() { return this.form.controls['name']; }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
