import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Coupon } from '../../../core/models/coupon.model';
import { CouponApiService } from '../../../core/services/coupon-api.service';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Bundle } from '../../../core/models/bundle.model';
import { BundleApiService } from '../../../core/services/bundle-api.service';
import { CurrencyPipe } from '@angular/common';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';

@Component({
  imports: [ReactiveFormsModule, CurrencyPipe],
  selector: 'app-bundle-add-modal',
  styleUrl: './bundle-add-modal.css',
  templateUrl: './bundle-add-modal.html',
})
export class BundleAddModal {
  @Input({ required: true }) storeId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Bundle>();

  private bundleApiService = inject(BundleApiService);
  private formBuilder = inject(FormBuilder);

  errorMessage = signal('');
  isSaving = signal(false);

  form = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    expires_at: [''],
    coupons: this.formBuilder.array([]),
    tiers: this.formBuilder.array([]),
  });

  get couponRows(): FormArray {
    return this.form.get('coupons') as FormArray;
  }

  get tierRows(): FormArray {
    return this.form.get('tiers') as FormArray;
  }

  addCouponRow() {
    const row = this.formBuilder.group({
      receiver_name: [''],
      receiver_email: ['', Validators.email],
      discount_amount: [0, [Validators.required, Validators.min(0.01)]],
      send_date: [''],
      send_immediately: [false],
      expires_at: [''],
    });

    this.couponRows.push(row);
  }

  removeCouponRow(index: number): void {
    this.couponRows.removeAt(index);
  }

  addTierRow(): void {
    const row = this.formBuilder.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      expires_at: [''],
    });

    this.tierRows.push(row);
  }

  removeTierRow(index: number): void {
    this.tierRows.removeAt(index);
  }

  get tierTotal(): number {
    let total: number = 0;
    let index: number;

    for (index = 0; index < this.tierRows.length; index++) {
      const row = this.tierRows.at(index);
      const quantity = row.get('quantity')?.value ?? 0;
      const amount = row.get('amount')?.value ?? 0;

      total = total + quantity * amount;
    }

    return total;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.errorMessage.set('');
    this.isSaving.set(true);

    const formValue = this.form.getRawValue();

    const couponsToSend = formValue.coupons.map((row: any) => {
      return {
        receiver_name: row.receiver_name === '' ? null : row.receiver_name,
        receiver_email: row.receiver_email === '' ? null : row.receiver_email,
        discount_amount: row.discount_amount,
        send_date: row.send_date === '' ? null : row.send_date,
        send_immediately: row.send_immediately,
        expires_at: row.expires_at === '' ? null : row.expires_at,
      };
    });

    const tiersToSend = formValue.tiers.map((row: any) => {
      return {
        quantity: row.quantity,
        amount: row.amount,
        expires_at: row.expires_at === '' ? null : row.expires_at,
      };
    });

    this.bundleApiService
      .createBundle(this.storeId, {
        name: formValue.name as string,
        description: formValue.description === '' ? null : formValue.description,
        expires_at: formValue.expires_at === '' ? null : formValue.expires_at,
        coupons: couponsToSend,
        tiers: tiersToSend,
      })
      .subscribe({
        next: (newBundle: Bundle) => {
          this.isSaving.set(false);
          this.saved.emit(newBundle);
        },
        error: (error) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error));
        },
      });
  }

  onCancel(): void {
    this.closed.emit();
  }

}
