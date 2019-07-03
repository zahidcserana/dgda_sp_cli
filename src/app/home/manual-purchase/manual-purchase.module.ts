import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualPurchaseRoutingModule } from './manual-purchase-routing.module';
import { ManualPurchaseComponent } from './manual-purchase.component';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ManualPurchaseComponent],
  imports: [
    CommonModule,
    ManualPurchaseRoutingModule,
    FormsModule,
    NgbModule,
  ]
})
export class ManualPurchaseModule { }
