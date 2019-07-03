import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ManualPurchaseComponent} from './manual-purchase.component';

const routes: Routes = [
  {
    path: '',
    component: ManualPurchaseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualPurchaseRoutingModule { }
