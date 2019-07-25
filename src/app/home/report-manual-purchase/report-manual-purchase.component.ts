import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChangeStatus, PurchaseModel } from '../report-models/purchase.model';
import { PurchaseService } from './purchase-service/purchase.service';
import * as $ from 'jquery';
import { Helpers } from '../../helpers';
import { ScriptLoaderService } from '../../_services/script-loader.service';
import { Pagi } from '../../modules/pagination/pagi.model';
import { AlertService } from '../../modules/alert/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-manual-purchase',
  templateUrl: './report-manual-purchase.component.html',
  styleUrls: ['./report-manual-purchase.component.css']
})
export class ReportManualPurchaseComponent implements OnInit {
  filter: string;
  sideBaropen: boolean;
  loader: boolean;
  pagi: Pagi = new Pagi();
  status = [];
  changeStatus = new ChangeStatus();
  type = [];
  loaderExport: boolean;
  purchaseItemList: PurchaseModel[] = [];
  purchaseItem: PurchaseModel = new PurchaseModel();

  @ViewChild('hasAlert') alertContainer: ElementRef;

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

  async purchaseStatus(item) {
    console.log(item);
    await Swal.fire({
      title: 'Change Status',
      input: 'select',
      inputOptions: {
        'RETURNED': 'RETURNED',
        'SOLD': 'SOLD',
        'REMOVED': 'REMOVED',
        'OK': 'OK'
      },
      inputPlaceholder: 'Select a status',
      showCancelButton: true,
      customClass: {
        confirmButton: 'confirm-button-class',
        cancelButton: 'cancel-button-class',
      },
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === '') {
            resolve('You need to select one status !');

          } else {

            this.changeStatus.status = value;
            this.changeStatus.item_id = item.id;
            this.purchaseS.changeStatus(this.changeStatus).then(
              res => {
                if (res.success === true) {
                  this.getManualPurchaseList(this.pagi.page, this.pagi.limit, this.filter);

                  Swal.fire({
                    position: 'center',
                    type: 'success',
                    title: 'Status successfully changed.',
                    showConfirmButton: false,
                    timer: 1500
                  })

                } else {
                  Swal.fire({
                    position: 'center',
                    type: 'warning',
                    title: 'Already changed!',
                    showConfirmButton: false,
                    timer: 1500
                  })
                }

              }
            ).catch(
              err => {
                this.alertS.error(this.alertContainer, err.error.error, true, 3000);
              }
            );

          }
        })
      }
    })
  }

  filterList(e) {
    this.filter = e;
    this.getManualPurchaseList(1, 20, this.filter);
  }

  removeItem(itemId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {

        this.purchaseS.deleteItem(itemId).then(
          res => {
            this.getManualPurchaseList(this.pagi.page, this.pagi.limit, this.filter);
          }
        );
      }
    });
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

  expStatus(s) {
    return this.purchaseS.expStatus(s);
  }

  checkStatus(s) {
    return this.purchaseS.checkStatus(s);
  }

  statusChange(f) {
    this.changeStatus.status = f.status.value;
    this.changeStatus.item_id = f.item_id.value;


    this.purchaseS.changeStatus(this.changeStatus).then(
      res => {
        if (res.success === true) {
          this.getManualPurchaseList(this.pagi.page, this.pagi.limit, this.filter);
        }
        window.location.reload();

        // $('.modal-backdrop').remove();
      }
    ).catch(
      err => {
        this.alertS.error(this.alertContainer, err.error.error, true, 3000);
      }
    );
  }

  getStatus(s) {
    return this.purchaseS.getStatus(s);
  }

  getSettings() {
    Helpers.loadStyles('head', 'assets/css/bootstrap.min.css');
    this._script.loadScripts('body', [
      'assets/js/jquery-2.1.4.min.js',
      'assets/js/ace-elements.min.js',
      'assets/js/wizard.min.js',
      'assets/js/purchase.js',
    ])
      .then(result => {
        // Helpers.setLoading(false);
      });
  }
}
