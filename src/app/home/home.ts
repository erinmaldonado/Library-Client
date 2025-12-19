import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  isAuthenticated: boolean = false;
  userEmail: string | null = null;  

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const isAuthenticated: boolean = this.authService.isAuthenticated();
    this.isAuthenticated = isAuthenticated;
  }
}