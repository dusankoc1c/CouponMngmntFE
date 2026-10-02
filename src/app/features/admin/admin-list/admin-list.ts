import { Component, OnInit, inject, signal } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { AdminEditModal } from '../admin-edit-modal/admin-edit-modal';
import { InviteModal } from '../invite-modal/invite-modal';
@Component({
  imports: [DatePipe, RouterLink, AdminEditModal, InviteModal],
  selector: 'app-admin-list',
  styleUrl: './admin-list.css',
  templateUrl: './admin-list.html',
})
export class AdminList implements OnInit {
  private apiAdminService = inject(AdminApiService);

  admins = signal<User[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.apiAdminService.getAdmins().subscribe({
      next: (admins) => {
        this.admins.set(admins);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);

        if (error.status === 403) {
          this.errorMessage.set('Nemas pristup ovoj stranici.');
        } else {
          this.errorMessage.set('Admini nisu ucitani.');
        }
      },
    });
  }

  selectedAdmin = signal<User | null>(null);
  isAdminEditModalOpen = signal(false);

  onOpenEditModal(admin: User): void {
    this.selectedAdmin.set(admin);
    this.isAdminEditModalOpen.set(true);
  }

  onClosedEditModal() {
    this.isAdminEditModalOpen.set(false);
  }

  onAdminSaved(updatedAdmin: User): void {
    const updatedAdmins = this.admins().map((admin) => {
      if (admin.id === updatedAdmin.id) {
        return updatedAdmin;
      }
      return admin;
    });

    this.admins.set(updatedAdmins);
    this.isAdminEditModalOpen.set(false);
  }

  onDeleteAdmin(adminId: string): void {
    const confirmed = confirm('Obrisi ovog admina');
    if (!confirmed) {
      return;
    }

    this.apiAdminService.deleteAdmin(adminId).subscribe({
      next: () => {
        const remainingAdmins = this.admins().filter((admin) => admin.id !== adminId);
        this.admins.set(remainingAdmins);
      },
      error: (error) => {
        alert(error.message);
      },
    });
  }

  isInviteModalOpen = signal(false);
  successMessage = signal('');

  onOpenInviteModal(): void {
    this.isInviteModalOpen.set(true);
  }

  onCloseInviteModal(): void {
    this.isInviteModalOpen.set(false);
  }

  onInviteSent(): void {
    this.isInviteModalOpen.set(false);
    this.successMessage.set('Poslat invite uspesno');

    setTimeout(() => {
      this.successMessage.set('');
    }, 3000);
  }
}
