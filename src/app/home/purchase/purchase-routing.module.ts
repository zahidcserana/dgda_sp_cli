import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseComponent } from './purchase.component';
import {ManualComponent} from './manual/manual.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseComponent
  },
  {
    path: 'manual',
    loadChildren: './manual/manual.module#ManualModule',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
