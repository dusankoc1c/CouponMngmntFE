import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Layout } from './core/layout/layout';
import { StoreList } from './features/stores/store-list/store-list';
import { authGuard } from './core/guards/auth-guard';
import { StoreDetail } from './features/stores/store-detail/store-detail';
import { BundleDetail } from './features/bundles/bundle-detail/bundle-detail';
import { AdminList } from './features/admin/admin-list/admin-list';
import { Unsubscribed } from './features/public/unsubscribed/unsubscribed';
import { CouponEdit } from './features/coupons/coupon-edit/coupon-edit';
import { StoreAdd } from './features/stores/store-add/store-add';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'unsubscribed', component: Unsubscribed },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'stores', component: StoreList },
      { path: 'stores/add', component: StoreAdd },
      { path: 'stores/:id', component: StoreDetail },
      { path: 'bundles/:id', component: BundleDetail },
      { path: 'admins', component: AdminList },
      { path: 'coupons/:id/edit', component: CouponEdit },
    ],
  },
];
