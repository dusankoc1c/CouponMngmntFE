import { Component, EventEmitter, Input, Output, inject, signal, Inject } from '@angular/core';
import { CouponApiService } from '../../../core/services/coupon-api.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';

@Component({
  imports: [],
  selector: 'app-csv-import-modal',
  styleUrl: './csv-import-modal.css',
  templateUrl: './csv-import-modal.html',
})
export class CsvImportModal {
  @Input({ required: true }) bundleId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() imported = new EventEmitter<void>();

  private couponApiService = inject(CouponApiService);

  selectedFile: File | null = null;
  errorMessage = signal('');
  isUploading = signal(false);

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if(inputElement.files !== null && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
    }else{
      this.selectedFile = null;
    }
  }

  onSubmit() {
    if(this.selectedFile === null){
      this.errorMessage.set('No file selected.');
      return;
    }

    this.errorMessage.set('');
    this.isUploading.set(true);

    this.couponApiService.importCsv(this.bundleId, this.selectedFile).subscribe({
      next: (result) => {
        this.isUploading.set(false);
        this.imported.emit();
      },
      error: (error) => {
        this.isUploading.set(false);
        this.errorMessage.set(extractErrorMessage(error));
      }
    })
  }

  onCancel(){
    this.closed.emit();
  }
}
