import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { RegisterRequest } from './register-request';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    const errors: ValidationErrors = {};
    if (value.length < 8) errors['minLength'] = true;
    if (!/[A-Z]/.test(value)) errors['uppercase'] = true;
    if (!/[0-9]/.test(value)) errors['number'] = true;
    return Object.keys(errors).length ? errors : null;
  };
}

function confirmPasswordValidator(passwordKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control.parent as FormGroup;
    if (!group) return null;
    const password = group.get(passwordKey)?.value;
    return control.value !== password ? { mismatch: true } : null;
  };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  form!: FormGroup<{
    fullName: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }>;
  serverErrors: string[] = [];
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, passwordStrengthValidator()]),
      confirmPassword: new FormControl('', [
        Validators.required,
        confirmPasswordValidator('password'),
      ]),
    });

    // Re-validate confirmPassword whenever password changes
    this.form.controls['password'].valueChanges.subscribe(() => {
      this.form.controls['confirmPassword'].updateValueAndValidity();
    });
  }

  get fullName() { return this.form.controls['fullName']; }
  get email() { return this.form.controls['email']; }
  get password() { return this.form.controls['password']; }
  get confirmPassword() { return this.form.controls['confirmPassword']; }

  onSubmit() {
    this.form.markAllAsTouched();
    this.serverErrors = [];
    if (this.form.invalid) return;

    const request: RegisterRequest = {
      fullName: this.fullName.value!,
      email: this.email.value!,
      password: this.password.value!,
    };

    this.http.post<{ success: boolean; message: string; errors?: string[] }>(
      environment.apiUrl + 'api/Admin/register',
      request
    ).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! You can now log in.';
        this.form.reset();
      },
      error: err => {
        const body = err.error;
        if (body?.errors?.length) {
          this.serverErrors = body.errors;
        } else {
          this.serverErrors = [body?.message ?? 'Registration failed. Please try again.'];
        }
      },
    });
  }
}
