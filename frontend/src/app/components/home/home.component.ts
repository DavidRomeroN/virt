import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuditorioService } from '../../services/auditorio.service';
import { Auditorio } from '../../models/auditorio.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="hero">
        <h1>Bienvenido al Sistema de Reserva de Auditorios</h1>
        <p>Gestiona tus reservas de manera fácil y rápida</p>
        <a routerLink="/auditorios" class="btn btn-primary">Ver Auditorios Disponibles</a>
      </div>

      <div class="features">
        <div class="feature-card">
          <h3>📅 Reserva Fácil</h3>
          <p>Reserva auditorios con fecha, día y hora de manera sencilla</p>
        </div>
        <div class="feature-card">
          <h3>📋 Gestión Completa</h3>
          <p>Administra todas tus reservas desde un solo lugar</p>
        </div>
        <div class="feature-card">
          <h3>🎥 Multimedia</h3>
          <p>Visualiza fotos y videos de los auditorios disponibles</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 60px 20px;
      color: white;
    }
    .hero h1 {
      font-size: 48px;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .hero p {
      font-size: 24px;
      margin-bottom: 30px;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-top: 40px;
    }
    .feature-card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .feature-card h3 {
      color: #667eea;
      margin-bottom: 15px;
      font-size: 24px;
    }
  `]
})
export class HomeComponent implements OnInit {
  constructor(private auditorioService: AuditorioService) {}

  ngOnInit(): void {}
}

