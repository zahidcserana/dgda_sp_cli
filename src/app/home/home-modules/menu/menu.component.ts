import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseService } from '../../report-manual-purchase/purchase-service/purchase.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

    constructor(
        private router: Router,
        private purchaseS: PurchaseService
    ) {
    }

    ngOnInit() {
    }

    logout() {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }

    dataSync() {
        this.purchaseS.dataSyncToServe().then(
            res => {
                console.log(res);

                Swal.fire({
                    position: 'center',
                    type: 'success',
                    title: 'Data successfully synced.',
                    showConfirmButton: false,
                    timer: 1500
                })

                window.location.reload();
            }
        );
    }

    reloadPage() {
        window.location.reload();
    }
}
