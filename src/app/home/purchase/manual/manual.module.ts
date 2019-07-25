import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualComponent } from './manual.component';
import {RouterModule, Routes} from '@angular/router';
import { CartService } from '../../cart-service/cart.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const routes: Routes = [
  {
    path: '',
    component: ManualComponent,
  }
];
@NgModule({
  declarations: [ManualComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot()
  ],
  exports: [RouterModule],
  providers: [CartService]
})
export class ManualModule { }
