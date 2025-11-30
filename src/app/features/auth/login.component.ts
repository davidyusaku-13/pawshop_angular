import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LoginCredentials } from '../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2 mb-6">
            <span class="text-4xl">🐱</span>
            <span class="text-2xl font-bold text-orange-600">Pawshop</span>
          </a>
          <h1 class="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p class="text-gray-500 mt-2">Sign in to continue shopping for your cat</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-5">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                [(ngModel)]="credentials.email"
                required
                email
                #emailInput="ngModel"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                [class.border-red-500]="emailInput.invalid && emailInput.touched"
                placeholder="you@example.com"
              />
              @if (emailInput.invalid && emailInput.touched) {
              <p class="mt-1 text-sm text-red-500">Please enter a valid email address</p>
              }
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  name="password"
                  [(ngModel)]="credentials.password"
                  required
                  minlength="6"
                  #passwordInput="ngModel"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-12"
                  [class.border-red-500]="passwordInput.invalid && passwordInput.touched"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  (click)="showPassword.set(!showPassword())"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                >
                  @if (showPassword()) {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                  } @else {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  }
                </button>
              </div>
              @if (passwordInput.invalid && passwordInput.touched) {
              <p class="mt-1 text-sm text-red-500">Password must be at least 6 characters</p>
              }
            </div>

            <!-- Error Message -->
            @if (errorMessage()) {
            <div
              class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 flex-shrink-0"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              {{ errorMessage() }}
            </div>
            }

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading()"
              class="w-full py-3 px-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 active:bg-orange-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              @if (isLoading()) {
              <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="3"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Signing in... } @else { Sign In }
            </button>
          </form>

          <!-- Divider -->
          <div class="my-6 flex items-center">
            <div class="flex-1 border-t border-gray-200"></div>
            <span class="px-4 text-sm text-gray-400">or</span>
            <div class="flex-1 border-t border-gray-200"></div>
          </div>

          <!-- Demo Account Info -->
          <div class="bg-gray-50 rounded-lg p-4 text-sm">
            <p class="font-medium text-gray-700 mb-2">Demo Account:</p>
            <p class="text-gray-600">
              Email: <code class="bg-gray-200 px-1 rounded">john&#64;example.com</code>
            </p>
            <p class="text-gray-600">
              Password: <code class="bg-gray-200 px-1 rounded">password123</code>
            </p>
          </div>
        </div>

        <!-- Sign Up Link -->
        <p class="text-center mt-6 text-gray-600">
          Don't have an account?
          <a routerLink="/auth/signup" class="text-orange-600 font-medium hover:text-orange-700">
            Sign up
          </a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly showPassword = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  protected credentials: LoginCredentials = {
    email: '',
    password: '',
  };

  protected onSubmit(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    // Simulate network delay
    setTimeout(() => {
      const result = this.authService.login(this.credentials);

      if (result.success) {
        const returnUrl = sessionStorage.getItem('returnUrl') || '/';
        sessionStorage.removeItem('returnUrl');
        this.router.navigateByUrl(returnUrl);
      } else {
        this.errorMessage.set(result.error || 'Login failed. Please try again.');
      }

      this.isLoading.set(false);
    }, 800);
  }
}
