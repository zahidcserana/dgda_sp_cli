import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportManualPurchaseRoutingModule } from './report-manual-purchase-routing.module';
import { ReportManualPurchaseComponent } from './report-manual-purchase.component';
import {PurchaseService} from './purchase-service/purchase.service';

@NgModule({
  declarations: [ReportManualPurchaseComponent],
  imports: [
    CommonModule,
    ReportManualPurchaseRoutingModule
  ],
  providers: [PurchaseService]
})
export class ReportManualPurchaseModule { }
