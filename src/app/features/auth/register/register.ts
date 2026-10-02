import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  errorMessage = signal('');
  isSaving = signal(false);

  inviteId: string | null = this.route.snapshot.queryParamMap.get('invite_id');

  form = new FormBuilder().group({
    name: ['', Validators.required],
    password: ['', Validators.required, Validators.minLength(6)],
    password_confirmation: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.inviteId == null) {
      this.errorMessage.set('Nemate invite link');
      return;
    }

    this.errorMessage.set('');
    this.isSaving.set(true);

    const formValue = this.form.getRawValue();

    this.authService
      .register({
        invite_id: Number(this.inviteId),
        name: formValue.name as string,
        password: formValue.password as string,
        password_confirmation: formValue.password_confirmation as string,
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/stores']);
        },
        error: (error) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error));
        },
      });
  }
}
