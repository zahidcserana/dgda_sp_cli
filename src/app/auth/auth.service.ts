import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {UserData} from '../modules/auth/auth.module';
import {Observable} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {HttpService} from '../modules/http-with-injector/http.service';

@Injectable()
export class AuthService {
    user: any;

    constructor(
        private router: Router,
        private http: HttpService
    ) {
    }

    login(data: any): Observable<any> {
        return this.http.post('auth/login', data);
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
        if (user && user['email']) {
            return true;
        }
        return false;
    }

    get storeUser(): boolean {
        const user = this.getUser();
        const type = ['PHARMACYSUPERADMIN'];
        return (user && type.includes(user.user_type)) ? true : false;
    }

    getUser(): UserData {
        return JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    }

    setUser(user) {
        const current_user = JSON.stringify(user);
        localStorage.setItem('currentUser', current_user);
        sessionStorage.setItem('currentUser', current_user);
    }

    getToken(): string | boolean {
        const current_user = this.getUser();
        if (current_user) {
            const splitToken = current_user.token.split('.');
            const token = splitToken.map((m, i) => {
                return (i + 1) % 2 === 0 ? dcrypt(m, 'upper') : dcrypt(m);
            }).join('.');
            return token.trim();
        }
        return false;
    }

    getErrorMessage(err: HttpErrorResponse) {
        return this.http.getErrorMessage(err);
    }
}
