import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CouponApiService } from '../../../core/services/coupon-api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-coupon-edit',
  styleUrl: './coupon-edit.css',
  templateUrl: './coupon-edit.html',
})
export class CouponEdit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private couponApiService = inject(CouponApiService);
  private formBuilder = inject(FormBuilder);

  couponId = 0;
  bundleId = signal<number | null>(null);

  isLoading = signal(true);
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

  ngOnInit() {
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    this.couponId = Number(idFromUrl);

    this.couponApiService.getCoupon(this.couponId).subscribe({
      next: (coupon) => {
        this.bundleId.set(coupon.bundle_id);

        this.form.patchValue({
          receiver_name: coupon.receiver_name,
          receiver_email: coupon.receiver_email,
          discount_amount: Number(coupon.discount_amount),
          send_date: coupon.send_date !== null ? coupon.send_date.slice(0, 10) : '',
          send_immediately: coupon.send_immediately,
          expires_at: coupon.expires_at !== null ? coupon.expires_at.slice(0, 10) : '',
        });

        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Kupon nije ucitan');
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.errorMessage.set('');
      this.isSaving.set(true);

      const formValue = this.form.getRawValue();

      this.couponApiService
        .updateCoupon(this.couponId, {
          receiver_name: formValue.receiver_name === '' ? null : formValue.receiver_name,
          receiver_email: formValue.receiver_email === '' ? null : formValue.receiver_email,
          discount_amount: formValue.discount_amount as number,
          send_date: formValue.send_date === '' ? null : formValue.send_date,
          send_immediately: formValue.send_immediately as boolean,
          expires_at: formValue.expires_at === '' ? null : formValue.expires_at,
        })
        .subscribe({
          next: () => {
            this.isSaving.set(false);
            this.router.navigate(['/bundles', this.bundleId()]);
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
