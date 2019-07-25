import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PurchaseRoutingModule} from './purchase-routing.module';
import {PurchaseComponent} from './purchase.component';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CartService} from '../cart-service/cart.service';
import {ManualComponent} from './manual/manual.component';
import {ManualModule} from './manual/manual.module';

@NgModule({
    declarations: [
        PurchaseComponent,
    ],
    imports: [
        CommonModule,
        PurchaseRoutingModule,
        FormsModule,
        NgbModule,
        ManualModule
    ],
    bootstrap: [PurchaseComponent],
    providers: [CartService]
})
export class PurchaseModule {
}
