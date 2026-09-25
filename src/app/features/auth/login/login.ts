import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.login('superadmin@couponmanager.test', 'SuperTajnaLozinka123').subscribe({
      next: (response) => {
        console.log('USPESAN LOGIN, odgovor:', response);
      },
      error: (error) => {
        console.log('GRESKA pri login-u:', error);
      },
    });
  }
}
