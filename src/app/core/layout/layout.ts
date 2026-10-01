import { Component, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ExportAllModal } from '../../features/admin/export-all-modal/export-all-modal';
import { Store } from '../models/store.model';
import { StoreApiService } from '../services/store-api.service';

@Component({
  imports: [RouterOutlet, RouterLink, ExportAllModal],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout {
  private authService = inject(AuthService);
  private router = inject(Router);
  private storeApiService = inject(StoreApiService);

  currentUser = this.authService.getUser();

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/login']);
      },
    });
  }

  isSuperAdmin() {
    return this.authService.isSuperAdmin();
  }

  isExportAllModalOpen = signal(false);
  allStores = signal<Store[]>([]);
  isLoadginStores = signal(false);

  onOpenExportAllModal() {
    this.isLoadginStores.set(true);

    this.storeApiService.getStores().subscribe({
      next: (stores) => {
        this.allStores.set(stores);
        this.isLoadginStores.set(false);
        this.isExportAllModalOpen.set(true);
      },
      error: () => {
        this.isLoadginStores.set(false);
        alert('prodavnica nisu ucitane');
      },
    })
  }

  onExportAllModalClose() {
    this.isExportAllModalOpen.set(false);
  }
}
