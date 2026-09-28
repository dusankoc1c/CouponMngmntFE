import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Layout } from './core/layout/layout';
import { StoreList } from './features/stores/store-list/store-list';
import { authGuard } from './core/guards/auth-guard';
import { StoreDetail} from './features/stores/store-detail/store-detail';
import { BundleDetail } from './features/bundles/bundle-detail/bundle-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [{ path: 'stores', component: StoreList }],
  },
  { path: 'stores', component: StoreList},
  { path: 'stores/:id', component: StoreDetail },
  { path: 'bundles/:id', component: BundleDetail },
];
