import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReportManualPurchaseComponent} from './report-manual-purchase.component';

const routes: Routes = [
  {
    path: '',
    component: ReportManualPurchaseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportManualPurchaseRoutingModule { }
