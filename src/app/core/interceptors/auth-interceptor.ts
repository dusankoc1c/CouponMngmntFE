import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if(token == null){
    return next(req);
  }

  const requestWithToken = req.clone({   //kopija zahteva sa dodatni headerom za aut
    setHeaders: {
      Authorization: 'Bearer ' + token
    }
  });

  return next(requestWithToken);
};
