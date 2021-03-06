import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportManualPurchaseRoutingModule } from './report-manual-purchase-routing.module';
import { ReportManualPurchaseComponent } from './report-manual-purchase.component';
import { PurchaseService } from './purchase-service/purchase.service';
import { PaginationModule } from '../../modules/pagination/pagination.module';
import { FilterComponent } from './filter/filter.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module, SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [ReportManualPurchaseComponent, FilterComponent],
  imports: [
    CommonModule,
    ReportManualPurchaseRoutingModule,
    PaginationModule,
    FormsModule,
    NgbModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [PurchaseService]
})
export class ReportManualPurchaseModule { }
