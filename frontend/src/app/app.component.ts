import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  template: `
    <div class="app-container">
      <header class="header">
        <div class="container">
          <h1>🏛️ Sistema de Reserva de Auditorios</h1>
          <nav>
            <a routerLink="/" routerLinkActive="active">Inicio</a>
            <a routerLink="/auditorios" routerLinkActive="active">Auditorios</a>
            <a routerLink="/reservas" routerLinkActive="active">Mis Reservas</a>
            <a routerLink="/login" routerLinkActive="active" *ngIf="!isLoggedIn">Login</a>
            <a routerLink="/register" routerLinkActive="active" *ngIf="!isLoggedIn">Registro</a>
            <a (click)="logout()" style="cursor: pointer;" *ngIf="isLoggedIn">Cerrar Sesión</a>
          </nav>
        </div>
      </header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
    }
    .header {
      background: rgba(255, 255, 255, 0.95);
      padding: 20px 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }
    .header .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 {
      color: #667eea;
      font-size: 24px;
    }
    nav {
      display: flex;
      gap: 20px;
    }
    nav a {
      text-decoration: none;
      color: #333;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }
    nav a:hover, nav a.active {
      background: #667eea;
      color: white;
    }
    .main-content {
      padding-bottom: 40px;
    }
  `]
})
export class AppComponent {
  isLoggedIn = false;

  logout() {
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    window.location.href = '/';
  }

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('currentUser');
  }
}

