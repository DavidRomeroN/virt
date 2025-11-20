import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';
import { AuditorioService } from '../../services/auditorio.service';
import { AuthService } from '../../services/auth.service';
import { Reserva, ReservaCreateDTO } from '../../models/reserva.model';
import { Auditorio } from '../../models/auditorio.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="card">
        <h2>Nueva Reserva</h2>
        
        <div *ngIf="auditorio">
          <div class="auditorio-info">
            <h3>{{ auditorio.nombre }}</h3>
            <p>Capacidad: {{ auditorio.capacidad }} personas</p>
          </div>
        </div>

        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success">{{ success }}</div>

        <form (ngSubmit)="onSubmit()" *ngIf="auditorio">
          <div class="form-group">
            <label>Fecha de Reserva</label>
            <input type="date" [(ngModel)]="reserva.fecha" name="fecha" 
                   [min]="minDate" required />
          </div>

          <div class="form-group">
            <label>Hora de Inicio</label>
            <input type="time" [(ngModel)]="reserva.horaInicio" name="horaInicio" required />
          </div>

          <div class="form-group">
            <label>Hora de Fin</label>
            <input type="time" [(ngModel)]="reserva.horaFin" name="horaFin" required />
          </div>

          <div class="form-group">
            <label>Motivo de la Reserva</label>
            <textarea [(ngModel)]="reserva.motivo" name="motivo" 
                      placeholder="Describe el motivo de tu reserva"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              {{ loading ? 'Reservando...' : 'Confirmar Reserva' }}
            </button>
            <a routerLink="/auditorios" class="btn btn-secondary">Cancelar</a>
          </div>
        </form>

        <div *ngIf="!auditorio && !loading" class="loading">
          Auditorio no encontrado
        </div>
      </div>
    </div>
  `,
  styles: [`
    h2 {
      color: #667eea;
      margin-bottom: 30px;
    }
    .auditorio-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .auditorio-info h3 {
      color: #667eea;
      margin-bottom: 10px;
    }
    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }
  `]
})
export class ReservaFormComponent implements OnInit {
  reserva: Reserva = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    motivo: '',
    auditorio: {} as Auditorio,
    usuario: {} as Usuario
  };
  
  auditorio: Auditorio | null = null;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  minDate: string = '';

  constructor(
    private reservaService: ReservaService,
    private auditorioService: AuditorioService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const auditorioId = this.route.snapshot.paramMap.get('id');
    if (auditorioId) {
      this.loadAuditorio(Number(auditorioId));
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.reserva.usuario = currentUser;
  }

  loadAuditorio(id: number): void {
    this.auditorioService.getAuditorioById(id).subscribe({
      next: (data) => {
        this.auditorio = data;
        this.reserva.auditorio = data;
      },
      error: (err) => {
        this.error = 'Error al cargar el auditorio';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (!this.reserva.fecha || !this.reserva.horaInicio || !this.reserva.horaFin) {
      this.error = 'Por favor completa todos los campos requeridos';
      return;
    }

    if (!this.reserva.auditorio?.id || !this.reserva.usuario?.id) {
      this.error = 'Error: Faltan datos del auditorio o usuario';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    // Preparar el objeto para enviar (formato que espera el backend)
    const reservaToSend: ReservaCreateDTO = {
      fecha: this.reserva.fecha,
      horaInicio: this.reserva.horaInicio,
      horaFin: this.reserva.horaFin,
      motivo: this.reserva.motivo,
      auditorioId: this.reserva.auditorio.id!,
      usuarioId: this.reserva.usuario.id!
    };

    this.reservaService.createReserva(reservaToSend).subscribe({
      next: () => {
        this.success = 'Reserva creada exitosamente';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/reservas']);
        }, 2000);
      },
      error: (err) => {
        // Mejorar el manejo de errores
        let errorMessage = 'Error al crear la reserva';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.error) {
            errorMessage = err.error.error;
          }
        }
        this.error = errorMessage;
        this.loading = false;
        console.error('Error completo:', err);
      }
    });
  }
}

