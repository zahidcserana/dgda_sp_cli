import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ManualPurchaseRoutingModule } from './manual-purchase-routing.module';
import { ManualPurchaseComponent } from './manual-purchase.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../cart-service/cart.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// RECOMMENDED
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
  declarations: [ManualPurchaseComponent],
  imports: [
    CommonModule,
    ManualPurchaseRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,

    BsDatepickerModule.forRoot()
  ],
  providers: [CartService, DatePipe]
})
export class ManualPurchaseModule { }
