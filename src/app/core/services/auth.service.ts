import { Injectable, signal, computed } from '@angular/core';
import { User, LoginCredentials, RegisterData } from '../../models/user.model';
import usersData from '../../data/users.json';

interface StoredUser extends User {
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly users = signal<StoredUser[]>(usersData as StoredUser[]);
  private readonly currentUser = signal<User | null>(null);

  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly user = computed(() => this.currentUser());

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const stored = localStorage.getItem('pawshop_user');
    if (stored) {
      try {
        const user = JSON.parse(stored) as User;
        this.currentUser.set(user);
      } catch {
        localStorage.removeItem('pawshop_user');
      }
    }
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('pawshop_user', JSON.stringify(user));
  }

  private removeUserFromStorage(): void {
    localStorage.removeItem('pawshop_user');
  }

  login(credentials: LoginCredentials): { success: boolean; error?: string } {
    const user = this.users().find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (!user) {
      return { success: false, error: 'Email not found. Please check your email or sign up.' };
    }

    if (user.password !== credentials.password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const { password, ...userWithoutPassword } = user;
    this.currentUser.set(userWithoutPassword);
    this.saveUserToStorage(userWithoutPassword);

    return { success: true };
  }

  register(data: RegisterData): { success: boolean; error?: string } {
    const existingUser = this.users().find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );

    if (existingUser) {
      return { success: false, error: 'Email already registered. Please sign in instead.' };
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      addresses: [],
      createdAt: new Date().toISOString(),
    };

    this.users.update((users) => [...users, newUser]);

    const { password, ...userWithoutPassword } = newUser;
    this.currentUser.set(userWithoutPassword);
    this.saveUserToStorage(userWithoutPassword);

    return { success: true };
  }

  logout(): void {
    this.currentUser.set(null);
    this.removeUserFromStorage();
  }

  updateProfile(updates: Partial<User>): void {
    const current = this.currentUser();
    if (!current) return;

    const updated = { ...current, ...updates };
    this.currentUser.set(updated);
    this.saveUserToStorage(updated);

    this.users.update((users) =>
      users.map((u) => (u.id === current.id ? { ...u, ...updates } : u))
    );
  }
}
