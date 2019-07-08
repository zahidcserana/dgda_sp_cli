import {Component, OnInit} from '@angular/core';
import {PurchaseModel} from '../report-models/purchase.model';
import {PurchaseService} from './purchase-service/purchase.service';
import * as $ from 'jquery';
import {Helpers} from '../../helpers';
import {ScriptLoaderService} from '../../_services/script-loader.service';
import {Pagi} from '../../modules/pagination/pagi.model';
import {AlertService} from '../../modules/alert/alert.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {map, catchError} from 'rxjs/operators';
import {of} from 'rxjs';


@Component({
    selector: 'app-report-manual-purchase',
    templateUrl: './report-manual-purchase.component.html',
    styleUrls: ['./report-manual-purchase.component.css']
})
export class ReportManualPurchaseComponent implements OnInit {
    filter: string;
    // accounts: Accounts[] = [];
    // account: Accounts = new Accounts();
    // accountReport: AccountReport = new AccountReport();
    sideBaropen: boolean;
    sideBarName: string = null;
    loader: boolean;
    pagi: Pagi = new Pagi();
    status = [];
    type = [];
    loaderExport: boolean;
    purchaseItemList: PurchaseModel[] = [];
    purchaseItem: PurchaseModel = new PurchaseModel();

    /**
     * Pagination stat
     */
    constructor(
               // private settingS: SettingService,
                private alertS: AlertService,
               // private adminS: AdminService,
                private modalService: NgbModal,

                private _script: ScriptLoaderService,
                private purchaseS: PurchaseService
    ) {
        this.filter = this.filter ? this.filter : '';
        this.pagi.limit = this.pagi.limit ? this.pagi.limit : 20;
        this.pagi.page = this.pagi.page ? this.pagi.page : 1;
        // this.pagi.page = val.get('page') ? parseInt(val.get('page')) : this.pagi.page;
        // this.pagi.limit = val.get('limit') ? parseInt(val.get('limit')) : this.pagi.limit;
    }

    /** *** */
    ngOnInit() {
        this.getManualPurchaseList(this.pagi.page, this.pagi.limit, this.filter);

        this.getSettings();

    }
    reloadTable(e) {
         this.getManualPurchaseList(e.page, e.limit, e.filter);
    }

    filterList(e){
        this.filter = e;
        this.getManualPurchaseList(1, 20, this.filter);
    }
    getManualPurchaseList(p, l, q) {
        this.loader = true;
        this.purchaseS.getAllManualPurchase(p, l, q).pipe(map(res => {
            return res;
        }), catchError(err => {
            this.loader = false;
            return of([]);
        })).subscribe(res => {
            this.loader = false;
            this.purchaseItemList = res.data;
            // this.accounts = res.data;
            this.dataList(res);
            // this.accountReport = res.account;
            console.log(res);
        });
        this.executeAction();
    }
    private dataList(res) {
        // this.accounts = res.data;
        this.purchaseItemList = res.data;

        // this.accountReport = res.account;
        this.pagi.total = res['total'] || 0;
        this.pagi.page = parseInt(res['page_no']) || 1;
        this.pagi.limit = parseInt(res['limit']) || 20;
    }
    executeAction() {
        this.sideBaropen = null;
        $('.native-routing').css('display', 'none');
    }

    checkStatus(s) {
        return this.purchaseS.checkStatus(s);
    }

    getStatus(s) {
        return this.purchaseS.getStatus(s);
    }

    getSettings() {
        Helpers.loadStyles('head', 'assets/css/bootstrap.min.css');
        this._script.loadScripts('body', [
            'assets/js/jquery-2.1.4.min.js',
            'assets/js/ace-elements.min.js',
            'assets/js/wizard.min.js'
        ])
            .then(result => {
                // Helpers.setLoading(false);
            });
    }
}
