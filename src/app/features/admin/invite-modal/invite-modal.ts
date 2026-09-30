import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse } from '../../../core/models/api-response.model';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';

@Component({
  selector: 'app-invite-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './invite-modal.html',
  styleUrl: './invite-modal.css',
})
export class InviteModal {
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private adminApiService = inject(AdminApiService);
  private formBuilder = inject(FormBuilder);

  errorMessage = signal('');
  isSending = signal(false);

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    value_limit: [null as number | null],
  });

  onSubmit() {
    if (this.form.valid) {
      this.isSending.set(true);
      this.errorMessage.set('');

      const formValue = this.form.getRawValue();

      this.adminApiService
        .sendInvite({
          email: formValue.email as string,
          value_limit: formValue.value_limit,
        })
        .subscribe({
          next: () => {
            this.isSending.set(true);
            this.saved.emit();
          },
          error: (error) => {
            this.errorMessage.set(extractErrorMessage(error));
          },
        });
    }
  }

  onCancel() {
    this.closed.emit();
  }
}
