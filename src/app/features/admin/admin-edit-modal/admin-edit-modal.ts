import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { User } from '../../../core/models/user.model';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';

@Component({
  selector: 'app-admin-edit-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-edit-modal.html',
  styleUrl: './admin-edit-modal.css',
})
export class AdminEditModal implements OnInit {
  @Input({ required: true }) admin!: User;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<User>();

  private adminApiService = inject(AdminApiService);
  private formBuilder = inject(FormBuilder);

  errorMessage = signal('');
  isSaving = signal(false);

  form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });
  ngOnInit(): void {
    this.form.patchValue({
      name: this.admin.name,
      email: this.admin.email,
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.errorMessage.set('');
      this.isSaving.set(true);

      const formdata = this.form.getRawValue();

      this.adminApiService
        .updateAdmin(Number(this.admin.id), {
          name: formdata.name as string,
          email: formdata.email as string,
        })
        .subscribe({
          next: (updatedAdmin) => {
            this.isSaving.set(false);
            this.saved.emit(updatedAdmin);
          },
          error: (error) => {
            this.isSaving.set(false);
            this.errorMessage.set(extractErrorMessage(error));
          },
        });
    }else{
      return;
    }
  }

  onCancel() {
    this.closed.emit();
  }
}
