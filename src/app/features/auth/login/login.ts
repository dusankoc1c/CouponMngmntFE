import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [FormsModule],
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = signal('');
  isLoading = signal(false);

  onSubmit() {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/stores']);
      },
      error: (err) => {
        this.isLoading.set(false);

        if (err.status === 422) {
          this.errorMessage.set('Pogresan email ili lozinka.');
        } else if (err.status === 429) {
          this.errorMessage.set('Previse pokusaja. Sacekaj minut pa probaj ponovo.');
        } else {
          this.errorMessage.set('Server nije dostupan.');
        }
      },
    });
  }
}
