import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  token: string;

  constructor(private router: Router) {}

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

   this.router.navigate(['/']);
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
    return this.token != null;
  }
}
