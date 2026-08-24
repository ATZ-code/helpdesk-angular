import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { TicketService } from '../core/services/ticket.service';
import {
  Ticket,
  TicketComment
} from '../core/models/ticket.model';





@Component({
  selector: 'app-ticket-detail',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './ticket-detail.html',

  styleUrl: './ticket-detail.scss'
})
export class TicketDetailComponent implements OnInit {

  ticket: Ticket | null = null;


  loading = false;

  errorMessage = '';


  // =========================
  // COMENTARIOS
  // =========================

  comments: TicketComment[] = [];

  commentsLoading = false;

  commentsErrorMessage = '';


  newComment = '';

  submittingComment = false;

  commentErrorMessage = '';


  constructor(
  private route: ActivatedRoute,

  private ticketService: TicketService,

  private cdr: ChangeDetectorRef
) {}


  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');


    if (!id) {

      this.errorMessage =
        'No se encontró el ID del ticket.';

      return;

    }


    this.loadTicket(id);

    this.loadComments(id);

  }


  // =========================
  // CARGAR TICKET
  // =========================

  loadTicket(id: string): void {

  this.loading = true;
  this.errorMessage = '';

  console.log('Cargando ticket:', id);

  this.ticketService.getTicket(id).subscribe({

    next: (response) => {

      console.log(
        'Respuesta del ticket:',
        response
      );

      console.log(
        'DATA DEL TICKET:',
        response.data
      );

      this.ticket = response.data;

      this.loading = false;

      console.log(
        'loading después de recibir ticket:',
        this.loading
      );

      console.log(
        'ticket después de recibir:',
        this.ticket
      );

      this.cdr.detectChanges();

    },

    error: (error) => {

      console.error(
        'ERROR DETALLE TICKET:',
        error
      );

      if (error.name === 'TimeoutError') {

        this.errorMessage =
          'La API tardó demasiado en responder al consultar el ticket.';

      } else {

        this.errorMessage =
          error.error?.error?.message ||
          'No se pudo cargar el ticket.';

      }

      this.loading = false;

      this.cdr.detectChanges();

    }

  });

}


  // =========================
  // CARGAR COMENTARIOS
  // =========================

  loadComments(id: string): void {

  this.commentsLoading = true;

  this.commentsErrorMessage = '';

  this.cdr.detectChanges();


  console.log(
    'Cargando comentarios para:',
    id
  );


  this.ticketService
    .getComments(id)
    .subscribe({

      next: (response) => {

        console.log(
          'Comentarios recibidos:',
          response
        );


        this.comments =
          response.data;


        this.commentsLoading = false;


        console.log(
          'Cantidad de comentarios:',
          this.comments.length
        );


        this.cdr.detectChanges();

      },


      error: (error) => {

        console.error(
          'Error cargando comentarios:',
          error
        );


        this.commentsErrorMessage =
          error.error?.error?.message ||
          'No se pudieron cargar los comentarios.';


        this.commentsLoading = false;


        this.cdr.detectChanges();

      }

    });

}


  // =========================
  // AGREGAR COMENTARIO
  // =========================

  addComment(): void {

  if (!this.ticket) {
    return;
  }


  const body = this.newComment.trim();


  if (!body) {
    return;
  }


  this.submittingComment = true;

  this.commentErrorMessage = '';

  this.cdr.detectChanges();


  console.log(
    'Agregando comentario:',
    body
  );


  this.ticketService
    .createComment(
      this.ticket.id,
      body
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Comentario creado:',
          response
        );


        // Limpiar textarea
        this.newComment = '';


        // Dejar de mostrar "Enviando..."
        this.submittingComment = false;


        // Actualizar la vista inmediatamente
        this.cdr.detectChanges();


        // Recargar comentarios
        this.loadComments(
          this.ticket!.id
        );

      },


      error: (error) => {

        console.error(
          'Error agregando comentario:',
          error
        );


        this.commentErrorMessage =
          error.error?.error?.message ||
          'No se pudo agregar el comentario.';


        this.submittingComment = false;


        // Actualizar la vista
        this.cdr.detectChanges();

      }

    });

}


  // =========================
  // LABELS
  // =========================

  getStatusLabel(
    status: string
  ): string {

    const labels: Record<string, string> = {

      open: 'Abierto',

      in_progress: 'En progreso',

      resolved: 'Resuelto',

      closed: 'Cerrado'

    };


    return labels[status] || status;

  }


  getPriorityLabel(
    priority: string
  ): string {

    const labels: Record<string, string> = {

      low: 'Baja',

      medium: 'Media',

      high: 'Alta',

      urgent: 'Urgente'

    };


    return labels[priority] || priority;

  }


  getRoleLabel(
    role: string
  ): string {

    const labels: Record<string, string> = {

      admin: 'Administrador',

      agent: 'Agente',

      client: 'Cliente'

    };


    return labels[role] || role;

  }

}