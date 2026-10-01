import { Component, inject, Input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StoreApiService } from '../../../core/services/store-api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-store-add',
  styleUrl: './store-add.css',
  templateUrl: './store-add.html',
})
export class StoreAdd {
  private router = inject(Router);
  private storeApiService = inject(StoreApiService);
  private formBuilder = inject(FormBuilder);

  errorMessage = signal('');
  isSaving = signal(false);

  form = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
  });

  onSubmit() {
    if (this.form.valid) {
      this.errorMessage.set('');
      this.isSaving.set(true);

      const formValue = this.form.getRawValue();

      this.storeApiService
        .createStore({
          name: formValue.name as string,
          description: formValue.description === '' ? null : formValue.description,
        })
        .subscribe({
          next: (newStore) => {
            this.isSaving.set(false);
            this.router.navigate(['/stores/' + newStore.id]);
          },
          error: (error) => {
            this.isSaving.set(false);
            this.errorMessage.set(extractErrorMessage(error));
          },
        });
    } else {
      return;
    }
  }
}
