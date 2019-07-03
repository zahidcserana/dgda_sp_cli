import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualPurchaseRoutingModule } from './manual-purchase-routing.module';
import { ManualPurchaseComponent } from './manual-purchase.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CartService} from '../cart-service/cart.service';

@NgModule({
  declarations: [ManualPurchaseComponent],
  imports: [
    CommonModule,
    ManualPurchaseRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers:[CartService]
})
export class ManualPurchaseModule { }
