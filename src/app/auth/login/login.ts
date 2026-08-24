import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  iniciarSesion(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const data = this.loginForm.getRawValue();

    console.log('Enviando login:', data);

    this.authService.login(data).subscribe({

      next: (respuesta) => {

        console.log('Login exitoso:', respuesta);

        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl')
          || '/dashboard';

        this.router.navigateByUrl(returnUrl);

      },

      error: (error) => {

        console.error('Error en login:', error);

      }

    });
  }
}