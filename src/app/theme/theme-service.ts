import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _isDark = new BehaviorSubject<boolean>(true);
  isDark$ = this._isDark.asObservable();

  toggle() {
    const next = !this._isDark.value;
    this._isDark.next(next);
    document.body.classList.toggle('light-mode', !next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  init() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    this._isDark.next(isDark);
    document.body.classList.toggle('light-mode', !isDark);
  }
}