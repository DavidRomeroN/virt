import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="card" style="max-width: 400px; margin: 50px auto;">
        <h2>Iniciar Sesión</h2>
        
        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success">{{ success }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required />
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" [(ngModel)]="password" name="password" required />
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="loading" style="width: 100%;">
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

          <p style="text-align: center; margin-top: 20px;">
            ¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    h2 {
      color: #667eea;
      margin-bottom: 30px;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = null;
    this.success = null;

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.success = 'Inicio de sesión exitoso';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Credenciales inválidas';
        this.loading = false;
      }
    });
  }
}

