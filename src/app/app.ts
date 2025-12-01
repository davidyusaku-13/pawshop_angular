import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!isAdminRoute()) {
    <div class="min-h-screen flex flex-col bg-gray-50">
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>
    } @else {
    <router-outlet />
    }
  `,
})
export class App {
  private readonly router = inject(Router);

  protected readonly isAdminRoute = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects.startsWith('/admin')),
      startWith(this.router.url.startsWith('/admin'))
    ),
    { initialValue: false }
  );
}
