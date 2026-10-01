import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { OutletContext } from '@angular/router';
import { Store } from '../../../core/models/store.model';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-export-all-modal',
  styleUrl: './export-all-modal.css',
  templateUrl: './export-all-modal.html',
})
export class ExportAllModal {
  @Input({ required: true }) stores!: Store[];
  @Output() closed = new EventEmitter<void>();

  private adminApiService = inject(AdminApiService);

  selectedStoreIds = signal<number[]>([]);
  createdFrom = '';
  createdTo = '';
  status = 'all';
  amount_min = '';
  amount_max = '';

  errorMessage = signal('');
  isExporting = signal(false);

  onToggleStore(storeId: number) {
    const currentIds = this.selectedStoreIds();
    if (currentIds.includes(storeId)) {
      this.selectedStoreIds.set(currentIds.filter((id) => id !== storeId));
    } else {
      this.selectedStoreIds.set([...currentIds, storeId]);
    }
  }

  isStoreSelected(storeId: number) {
    return this.selectedStoreIds().includes(storeId);
  }

  onClearFilters(): void {
    this.createdFrom = '';
    this.createdTo = '';
    this.status = 'all';
    this.amount_min = '';
    this.amount_max = '';
    this.selectedStoreIds.set([]);
  }

  onExport() {
    if (this.selectedStoreIds().length !== 0) {
      this.errorMessage.set('');
      this.isExporting.set(true);

      const data: any = {
        store_ids: this.selectedStoreIds(),
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
      if (this.amount_min !== '') {
        data.amount_min = this.amount_min;
      }
      if (this.amount_max !== '') {
        data.amount_max = this.amount_max;
      }

      this.adminApiService.exportAll(data).subscribe({
        next: (blob) => {
          this.isExporting.set(false);
          this.downloadBlob(blob);
          this.closed.emit();
        },
        error: (e) => {
          this.isExporting.set(false);
          this.errorMessage.set(extractErrorMessage(e));
        },
      });
    } else {
      this.errorMessage.set('Nije izabrana prodavnica');
      return;
    }
  }

  onCancel() {
    this.closed.emit();
  }

  private downloadBlob(blob: Blob) {
    const today = new Date().toISOString().slice(0, 10);
    const fileName = 'export-all' + today + '.csv';

    const objectUrl = window.URL.createObjectURL(blob);
    const linkElement = document.createElement('a');

    linkElement.href = objectUrl;
    linkElement.download = fileName;
    linkElement.click();

    window.URL.revokeObjectURL(objectUrl);
  }
}
