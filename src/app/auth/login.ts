import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth-service';
import { LoginRequest } from './login-request';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  form!: FormGroup<{
    username: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;
  loginError = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  get username() { return this.form.controls['username']; }
  get password() { return this.form.controls['password']; }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const loginRequest: LoginRequest = {
      username: this.username.value!,
      password: this.password.value!,
    };
    this.authService.login(loginRequest).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.loginError = 'Invalid email or password.',
    });
  }
}