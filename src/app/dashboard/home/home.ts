import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TicketService } from '../../core/services/ticket.service';
import { Ticket } from '../../core/models/ticket.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {

  tickets: Ticket[] = [];

  status = '';
  priority = '';

  page = 1;
  limit = 10;

  total = 0;
  totalPages = 0;

  loading = false;
  errorMessage = '';

  userRole: string | null = null;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.userRole = this.authService.getRole();

    this.loadTickets();

  }

  loadTickets(): void {

    this.loading = true;
    this.errorMessage = '';

    this.ticketService.getTickets(
      this.status || undefined,
      this.priority || undefined,
      this.page,
      this.limit
    ).subscribe({

      next: (response) => {

        this.tickets = response.data;

        this.total = response.meta.total;
        this.page = response.meta.page;
        this.limit = response.meta.limit;
        this.totalPages = response.meta.totalPages;

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Error cargando tickets:',
          error
        );

        this.errorMessage =
          error.error?.error?.message ||
          'No se pudieron cargar los tickets.';

        this.loading = false;

      }

    });

  }

  applyFilters(): void {

    this.page = 1;

    this.loadTickets();

  }

  clearFilters(): void {

    this.status = '';
    this.priority = '';
    this.page = 1;

    this.loadTickets();

  }

  previousPage(): void {

    if (this.page > 1) {

      this.page--;

      this.loadTickets();

    }

  }

  nextPage(): void {

    if (this.page < this.totalPages) {

      this.page++;

      this.loadTickets();

    }

  }

  getStatusLabel(status: string): string {

    const labels: Record<string, string> = {

      open: 'Abierto',

      in_progress: 'En progreso',

      resolved: 'Resuelto',

      closed: 'Cerrado'

    };

    return labels[status] || status;

  }

  getPriorityLabel(priority: string): string {

    const labels: Record<string, string> = {

      low: 'Baja',

      medium: 'Media',

      high: 'Alta',

      urgent: 'Urgente'

    };

    return labels[priority] || priority;

  }

}