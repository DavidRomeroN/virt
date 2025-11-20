import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="card" style="max-width: 400px; margin: 50px auto;">
        <h2>Registro de Usuario</h2>
        
        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success">{{ success }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" [(ngModel)]="usuario.nombre" name="nombre" required />
          </div>

          <div class="form-group">
            <label>Apellido</label>
            <input type="text" [(ngModel)]="usuario.apellido" name="apellido" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="usuario.email" name="email" required />
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" [(ngModel)]="usuario.password" name="password" required />
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="loading" style="width: 100%;">
            {{ loading ? 'Registrando...' : 'Registrarse' }}
          </button>

          <p style="text-align: center; margin-top: 20px;">
            ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión aquí</a>
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
export class RegisterComponent {
  usuario: Usuario = {
    email: '',
    nombre: '',
    apellido: '',
    password: '',
    rol: 'ESTUDIANTE'
  };
  
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

    this.authService.register(this.usuario).subscribe({
      next: (user) => {
        this.success = 'Registro exitoso. Redirigiendo...';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrar usuario';
        this.loading = false;
      }
    });
  }
}

