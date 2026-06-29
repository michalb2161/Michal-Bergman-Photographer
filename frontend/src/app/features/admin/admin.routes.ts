import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./admin-login-page/admin-login-page.component').then((m) => m.AdminLoginPageComponent)
  },
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin-shell/admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin-dashboard-page/admin-dashboard-page.component').then(
            (m) => m.AdminDashboardPageComponent
          )
      },
      {
        path: 'images',
        loadComponent: () =>
          import('./admin-images-page/admin-images-page.component').then((m) => m.AdminImagesPageComponent)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./admin-categories-page/admin-categories-page.component').then(
            (m) => m.AdminCategoriesPageComponent
          )
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./admin-messages-page/admin-messages-page.component').then(
            (m) => m.AdminMessagesPageComponent
          )
      },
      {
        path: 'homepage',
        loadComponent: () =>
          import('./admin-homepage-page/admin-homepage-page.component').then(
            (m) => m.AdminHomepagePageComponent
          )
      }
    ]
  }
];
