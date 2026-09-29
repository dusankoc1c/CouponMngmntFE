import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { StoreApiService } from '../../../core/services/store-api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '../../../core/models/store.model';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-store-edit-modal',
  styleUrl: './store-edit-modal.css',
  templateUrl: './store-edit-modal.html',
})
export class StoreEditModal implements OnInit {
  @Input({ required: true }) store!: Store;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Store>();

  private storeApiService = inject(StoreApiService);
  private formBuilder = inject(FormBuilder);

  errorMessage = signal('');
  isSaving = signal(false);

  form = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    reminder_days: [null as number | null],
  });
  ngOnInit(): void {
    this.form.patchValue({
      name: this.store.name,
      description: this.store.description,
      reminder_days: this.store.reminder_days,
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.errorMessage.set('');
    this.isSaving.set(true);

    const formValue = this.form.getRawValue();

    this.storeApiService
      .updateStore(this.store.id, {
        name: formValue.name as string,
        description: formValue.description,
        reminder_days: formValue.reminder_days,
      })
      .subscribe({
        next: (updatedStore) => {
          this.isSaving.set(false);
          this.saved.emit(updatedStore);
        },
        error: (error) => {
          this.isSaving.set(false);
          this.errorMessage.set(error.toString());
        },
      });
  }

  onCancel() {
    this.closed.emit();
  }
}
