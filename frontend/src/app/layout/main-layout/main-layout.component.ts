import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterOutlet],
  template: `
    <app-navbar />
    <main class="main">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: `
    .main {
      min-height: 60vh;
    }
  `
})
export class MainLayoutComponent {}
