import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuditorioService } from '../../services/auditorio.service';
import { Auditorio } from '../../models/auditorio.model';

@Component({
  selector: 'app-auditorios-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Auditorios Disponibles</h2>
      
      <div *ngIf="loading" class="loading">Cargando auditorios...</div>
      
      <div *ngIf="error" class="alert alert-error">{{ error }}</div>
      
      <div class="grid" *ngIf="!loading && !error">
        <div class="card auditorio-card" *ngFor="let auditorio of auditorios">
          <div class="auditorio-image" *ngIf="auditorio.imagenUrl">
            <img [src]="auditorio.imagenUrl" [alt]="auditorio.nombre" />
          </div>
          <div class="auditorio-content">
            <h3>{{ auditorio.nombre }}</h3>
            <p><strong>Capacidad:</strong> {{ auditorio.capacidad }} personas</p>
            <p><strong>Ubicación:</strong> {{ auditorio.ubicacion || 'No especificada' }}</p>
            <p *ngIf="auditorio.descripcion">{{ auditorio.descripcion }}</p>
            <div class="auditorio-actions">
              <a [routerLink]="['/reservar', auditorio.id]" class="btn btn-primary">Reservar</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h2 {
      color: white;
      margin-bottom: 30px;
      font-size: 36px;
      text-align: center;
    }
    .auditorio-card {
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
    }
    .auditorio-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    .auditorio-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    .auditorio-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .auditorio-content h3 {
      color: #667eea;
      margin-bottom: 15px;
    }
    .auditorio-content p {
      margin-bottom: 10px;
      color: #666;
    }
    .auditorio-actions {
      margin-top: 20px;
    }
  `]
})
export class AuditoriosListComponent implements OnInit {
  auditorios: Auditorio[] = [];
  loading = true;
  error: string | null = null;

  constructor(private auditorioService: AuditorioService) {}

  ngOnInit(): void {
    this.loadAuditorios();
  }

  loadAuditorios(): void {
    this.loading = true;
    this.auditorioService.getAuditoriosActivos().subscribe({
      next: (data) => {
        this.auditorios = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los auditorios';
        this.loading = false;
        console.error(err);
      }
    });
  }
}

