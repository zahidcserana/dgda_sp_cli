import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserData } from '../modules/auth/auth.module';

@Injectable()
export class AuthService {
  token: string = '222222';
  user: any;

  constructor(
    private router: Router
  ) { }

  signupUser(email: string, password: string) {
  }

  signinUser(email: string, password: string) {
    //  firebase.auth().signInWithEmailAndPassword(email, password)
    //    .then(
    //      response => {
    //        this.router.navigate(['/']);
    //        firebase.auth().currentUser.getToken()
    //          .then(
    //            (token: string) => this.token = token
    //          )
    //      }
    //    )
    //    .catch(
    //      error => console.log(error)
    //    );
    console.log('email');
    console.log(email);
    this.user = { 'email': email, 'password': password, 'user_type_id': 1 };
    this.setUser(this.user);
    this.router.navigate(['/home']);
    this.token = '123456';
  }

  logout() {
    //firebase.auth().signOut();
    this.token = null;
  }

  getToken() {
    //  firebase.auth().currentUser.getToken()
    //    .then(
    //      (token: string) => this.token = token
    //    );
    return this.token;
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
