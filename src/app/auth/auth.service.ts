import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserData } from '../modules/auth/auth.module';

@Injectable()
export class AuthService {
  user: any;

  constructor(
    private router: Router
  ) { }


  signinUser(email: string, password: string) {
    this.user = { 'email': email, 'password': password, 'user_type_id': 1 };
    this.setUser(this.user);
    this.router.navigate(['/home']);
  }

  isAuthenticated() {
    if (
      this.authenticated && this.storeUser
    ) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }

  get authenticated(): boolean {
    const user = this.getUser();
    if (user && user['email']) return true;
    return false;
  }

  get storeUser(): boolean {
    const user = this.getUser();
    const type = [1, 2, 3, 4];
    return (user && type.includes(user.user_type_id)) ? true : false;
  }

  getUser(): UserData {
    return JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
  }

  setUser(user) {
    const current_user = JSON.stringify(user);
    localStorage.setItem('currentUser', current_user);
    sessionStorage.setItem('currentUser', current_user);
  }
}
