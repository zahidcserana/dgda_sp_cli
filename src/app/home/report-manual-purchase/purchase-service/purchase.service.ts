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
        return this.http
            .get(`reports/purchase-manual?page_no=${p ? p : 1}&limit=${l ? l : 20}${params}`)
            .pipe(map(res => res));
    }

    changeStatus(data) {
        return this.http.post('orders/update-status', data).toPromise();
    }

    dataSyncToServe() {
        return this.http.get('data-sync').toPromise();
    }
    deleteItem(item_id) {
        return this.http.post('orders/delete-item', {item_id: item_id}).toPromise();
    }

    checkStatus(s) {
        if (s) {
            switch (s) {
                case 'OK':
                    return 'label label-sm label-info';
                case 'SOLD':
                    return 'label label-sm label-success';
                case 'RETURNED':
                    return 'label label-sm label-danger';
                case 'REMOVED':
                    return 'label label-sm label-warning';
                default:
                    return 'label label-sm label-info';
            }
        }
        return '';
    }
    expStatus(s) {
        if (s) {
            switch (s) {
                case 'EXP':
                    return 'expired';
                case '1M':
                    return 'expired1';
                case '3M':
                    return 'expired3';
            }
        }
        return '';
    }


    getStatus(data) {
        if (data) {
            switch (data) {
                case 1:
                    return 'Active';
                case 2:
                    return 'Inactive';
                case 3:
                    return 'Out of Stock';
                case 4:
                    return 'Faulty';
                case 5:
                    return 'Delete';
            }
        }
        return '';
    }
}
