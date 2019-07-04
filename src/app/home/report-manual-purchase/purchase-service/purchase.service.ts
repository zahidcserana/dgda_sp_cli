import {Injectable} from '@angular/core';
import {HttpService} from '../../../modules/http-with-injector/http.service';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';

@Injectable()
export class PurchaseService {

    constructor(
        private http: HttpService,
        private router: Router) {
    }

    getAllManualPurchase(p, l, query?) {
        const params = query ? query : '';
        return this.http.get(`reports/purchase-manual?page_no=${p ? p : 1}&limit=${l ? l : 20}${params}`).pipe(map(res => res));
    }
}
