import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/home/home-page.component').then((m) => m.HomePageComponent)
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/about/about-page.component').then((m) => m.AboutPageComponent)
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./features/gallery/gallery-page.component').then((m) => m.GalleryPageComponent)
      },
      {
        path: 'categories',
        pathMatch: 'prefix',
        redirectTo: 'gallery'
      },
      {
        path: 'blog',
        pathMatch: 'prefix',
        redirectTo: '/'
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact-page.component').then((m) => m.ContactPageComponent)
      },
      {
        path: 'contact-history',
        loadComponent: () =>
          import('./features/contact/contact-history-page.component').then(
            (m) => m.ContactHistoryPageComponent
          )
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register-page.component').then((m) => m.RegisterPageComponent)
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login-page.component').then((m) => m.LoginPageComponent)
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./features/products/product-list-page.component').then((m) => m.ProductListPageComponent)
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('./features/products/product-detail-page.component').then((m) => m.ProductDetailPageComponent)
      },
      {
        path: 'add-product',
        loadComponent: () =>
          import('./features/products/add-product-page.component').then((m) => m.AddProductPageComponent)
      }
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found-page.component').then((m) => m.NotFoundPageComponent)
  }
];
