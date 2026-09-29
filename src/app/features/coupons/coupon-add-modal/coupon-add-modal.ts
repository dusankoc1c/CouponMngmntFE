import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Store } from '../../../core/models/store.model';
import { Coupon } from '../../../core/models/coupon.model';
import { CouponApiService } from '../../../core/services/coupon-api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-coupon-add-modal',
  styleUrl: './coupon-add-modal.css',
  templateUrl: './coupon-add-modal.html',
})
export class CouponAddModal {
  @Input({ required: true }) bundleId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Coupon>();

  private couponApiService = inject(CouponApiService);
  private formBuilder = inject(FormBuilder);

  errorMessage = signal('');
  isSaving = signal(false);

  form = this.formBuilder.group({
    receiver_name: [''],
    receiver_email: ['', Validators.email],
    discount_amount: [0, [Validators.required, Validators.min(0.01)]],
    send_date: [''],
    send_immediately: [false],
    expires_at: [''],
  });

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.errorMessage.set('');
    this.isSaving.set(true);

    const formValue = this.form.getRawValue();

    const dataSend = {
      receiver_name: this.form.value.receiver_name === '' ? null : formValue.receiver_name,
      receiver_email: this.form.value.receiver_email === '' ? null : formValue.receiver_email,
      discount_amount: this.form.value.discount_amount as number,
      send_date: this.form.value.send_date === '' ? null : formValue.send_date,
      send_immediately: this.form.value.send_immediately as boolean,
      expires_at: this.form.value.expires_at === '' ? null : formValue.expires_at,
    };

    this.couponApiService.createCoupon(this.bundleId, dataSend).subscribe({
      next: (newCoupon) => {
        this.isSaving.set(false);
        this.saved.emit(newCoupon);
      },
      error: (error) => {
        this.isSaving.set(false);
        this.errorMessage.set(extractErrorMessage(error));
      },
    });
  }

  onCancel() {
    this.closed.emit();
  }

}


