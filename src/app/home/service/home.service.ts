import {Injectable} from '@angular/core';
import {HttpService} from '../../modules/http-with-injector/http.service';
import {map} from 'rxjs/operators';

@Injectable()
export class HomeService {

    constructor(private http: HttpService) {

    }

    getCompanies() {
        return this.http.get('companies').pipe(map(res => res));
    }
}
