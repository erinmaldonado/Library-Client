import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth-service';
import { LoginRequest } from './login-request';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  form!: FormGroup<{
    username: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;
  submitted = false;

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
    this.submitted = true;
    if (this.form.invalid) return;

    const loginRequest: LoginRequest = {
      username: this.username.value!,
      password: this.password.value!,
    };
    this.authService.login(loginRequest).subscribe({
      next: result => {
        console.log('Login successful', result);
        this.router.navigate(['/']);
      },
      error: error => {
        console.log('Login failed', error);
      },
    });
  }
}