import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './auth/login';
import { Register } from './auth/register';
import { Authors } from './authors/authors'; 
import { AuthorDetail } from './author-detail/author-detail';
import { Books } from './books/books'; 
import { Loans } from './loans/loans';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'authors', component: Authors, canActivate: [authGuard] },
    { path: 'authors/:id', component: AuthorDetail, canActivate: [authGuard] },
    { path: 'books', component: Books, canActivate: [authGuard] },
    { path: 'loans', component: Loans, canActivate: [authGuard] },
    { path: '**', redirectTo: '/home' } 
];