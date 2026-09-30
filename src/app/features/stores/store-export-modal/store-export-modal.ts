import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { StoreApiService } from '../../../core/services/store-api.service';
import { Bundle } from '../../../core/models/bundle.model';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-store-export-modal',
  styleUrl: './store-export-modal.css',
  templateUrl: './store-export-modal.html',
})
export class StoreExportModal {
  @Input({ required: true }) storeId!: number;
  @Input({ required: true }) bundles!: Bundle[];
  @Output() closed = new EventEmitter<void>();

  private storeApiService = inject(StoreApiService);

  selectedBundleIds = signal<number[]>([]);
  createdFrom = '';
  createdTo = '';
  status = 'all';
  amountMin = '';
  amountMax = '';

  errorMessage = signal('');
  isExporting = signal(false);

  onToggleBundle(bundleId: number) {
    const currentIds = this.selectedBundleIds();
    if (currentIds.includes(bundleId)) {
      this.selectedBundleIds.set(currentIds.filter((id) => id !== bundleId));
    } else {
      this.selectedBundleIds.set([...currentIds, bundleId]);
    }
  }

  isBundleSelected(bundleId: number) {
    return this.selectedBundleIds().includes(bundleId);
  }

  onClearFilters(): void {
    this.createdFrom = '';
    this.createdTo = '';
    this.status = 'all';
    this.amountMin = '';
    this.amountMax = '';
    this.selectedBundleIds.set([]);
  }

  onExport() {
    if (this.selectedBundleIds().length !== 0) {
      this.errorMessage.set('');
      this.isExporting.set(true);

      const data: any = {
        bundle_ids: this.selectedBundleIds(),
      };

      if (this.createdFrom !== '') {
        data.created_from = this.createdFrom;
      }
      if (this.createdTo !== '') {
        data.created_to = this.createdTo;
      }
      if (this.status !== 'all') {
        data.status = this.status;
      }
      if (this.amountMin !== '') {
        data.amount_min = this.amountMin;
      }
      if (this.amountMax !== '') {
        data.amount_max = this.amountMax;
      }

      this.storeApiService.exportCodes(this.storeId, data).subscribe({
        next: (data) => {
          this.isExporting.set(false);
          this.downloadData(data);
          this.closed.emit();
        },
        error: (error) => {
          this.isExporting.set(false);
          this.errorMessage.set(extractErrorMessage(error));
        },
      });
    } else {
      this.errorMessage.set('Nije izabran ni jedan bundle');
      return;
    }
  }

  onCancel(): void {
    this.closed.emit();
  }

  downloadData(data: any) {
    const today = new Date().toISOString().slice(0, 10);
    const fileName = 'export-codes' + today + '.csv';

    const objectUrl = window.URL.createObjectURL(data);
    const linkElem = document.createElement('a');

    linkElem.href = objectUrl;
    linkElem.download = fileName;
    linkElem.click();

    window.URL.revokeObjectURL(objectUrl);
  }
}
