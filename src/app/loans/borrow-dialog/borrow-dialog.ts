import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../books/book-service';

@Component({
  selector: 'app-borrow-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Borrow "{{ data.book.title }}"</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Due Date</mat-label>
        <input matInput [matDatepicker]="picker" [formControl]="dueDate" [min]="minDate">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
        <mat-error *ngIf="dueDate.invalid">Please select a due date</mat-error>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="confirm()">Borrow</button>
    </mat-dialog-actions>
  `,
})
export class BorrowDialog {
  minDate = new Date();
  dueDate = new FormControl<Date | null>(null, Validators.required);

  constructor(
    public dialogRef: MatDialogRef<BorrowDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { book: Book }
  ) {}

  confirm(): void {
    if (this.dueDate.invalid || !this.dueDate.value) return;
    this.dialogRef.close(this.dueDate.value.toISOString());
  }
}