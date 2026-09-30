import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { StoreApiService } from '../../../core/services/store-api.service';
import { Store } from '../../../core/models/store.model';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';

// -------------------------------- PLACEHOLDERs???------------
function requiredPlaceholders(placeholders: string[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    let index: number;

    for (index = 0; index < placeholders.length; index++) {
      if (!value.includes(placeholders[index])) {
        return { missingPlaceholder: placeholders[index] };
      }
    }

    return null;
  };
}


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-email-templates-modal',
  styleUrl: './email-templates-modal.css',
  templateUrl: './email-templates-modal.html',
})
export class EmailTemplatesModal {
  @Input({ required: true }) store!: Store;
  @Input({ required: true }) initialTemplate!: string;
  @Input({ required: true }) reminderTemplate!: string;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private storeApiService = inject(StoreApiService);
  private formBuilder = inject(FormBuilder);

  errorMessage = signal('');
  isSaving = signal(false);

  form = this.formBuilder.group({
    initial_email_template: [
      '',
      [Validators.required, requiredPlaceholders(['{{name}}', '{{amount}}', '{{store_name}}'])],
    ],
    reminder_email_template: [
      '',
      [
        Validators.required,
        requiredPlaceholders(['{{name}}', '{{amount}}', '{{store_name}}', '{{days_left}}']),
      ],
    ],
  });

  ngOnInit() {
    this.form.patchValue({
      initial_email_template: this.initialTemplate,
      reminder_email_template: this.reminderTemplate,
    });
  }

  get initialControlHasError(): boolean {
    const control = this.form.get('initial_email_template');
    return control !== null && control.touched && control.invalid;
  }

  get reminderControlHasError(): boolean {
    const control = this.form.get('reminder_email_template');
    return control !== null && control.touched && control.invalid;
  }

  onSubmit() {
    if (this.form.valid) {
      this.errorMessage.set('');
      this.isSaving.set(true);

      const formValues = this.form.getRawValue();

      this.storeApiService
        .updateEmailTemplate(this.store.id, {
          initial_email_template: formValues.initial_email_template as string,
          reminder_email_template: formValues.reminder_email_template as string,
        })
        .subscribe({
          next: () => {
            this.isSaving.set(false);
            this.saved.emit();
          },
          error: (err) => {
            this.isSaving.set(false);
            this.errorMessage.set(extractErrorMessage(err));
          },
        });
    } else {
      this.form.markAllAsTouched();
      this.errorMessage.set('nisu svi podaci uneti');
      return;
    }
  }

  onCancel() {
    this.closed.emit();
  }
}
