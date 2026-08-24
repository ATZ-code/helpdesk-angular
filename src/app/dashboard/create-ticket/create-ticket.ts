import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';

import { TicketService } from '../../core/services/ticket.service';


@Component({
  selector: 'app-create-ticket',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './create-ticket.html',

  styleUrl: './create-ticket.scss'
})
export class CreateTicketComponent {

  ticketForm: FormGroup;

  loading = false;

  errorMessage = '';


  constructor(
    private fb: FormBuilder,

    private ticketService: TicketService,

    private router: Router
  ) {

    this.ticketForm = this.fb.group({

      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      ],

      priority: [
        'medium',
        Validators.required
      ]

    });

  }


  crearTicket(): void {

    if (this.ticketForm.invalid) {

      this.ticketForm.markAllAsTouched();

      return;

    }


    this.loading = true;

    this.errorMessage = '';


    this.ticketService
      .createTicket(this.ticketForm.value)
      .subscribe({

        next: () => {

          this.loading = false;

          this.router.navigate(['/dashboard']);

        },


        error: (error) => {

          console.error(
            'Error creando ticket:',
            error
          );

          this.errorMessage =
            error.error?.error?.message ||
            'No se pudo crear el ticket.';

          this.loading = false;

        }

      });

  }

}