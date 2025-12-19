import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../auth/auth-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterLink , 
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar  implements OnInit, OnDestroy{
  private destroy = new Subject();
  isLoggedIn!: boolean;
  constructor(public authService: AuthService) {
    authService.authStatus.pipe(takeUntil(this.destroy)).subscribe(status => {
      this.isLoggedIn = status;
    }); 
  }
  ngOnInit(): void {
    this.authService.authStatus.subscribe(status => {
      this.isLoggedIn = status;
    });
  }
  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}