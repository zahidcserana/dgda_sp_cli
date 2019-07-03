import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
import {LoginComponent} from '../auth/login/login.component';
import {AuthGuard} from '../auth/auth-guard.service';
import {HomeResolveService} from './service/home-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                loadChildren: './dashboard/dashboard.module#DashboardModule',
            },
            {
                path: 'purchase',
                loadChildren: './purchase/purchase.module#PurchaseModule',
                resolve: {companies: HomeResolveService}
            },
            {
                path: 'manual-purchase',
                loadChildren: './manual-purchase/manual-purchase.module#ManualPurchaseModule',
                resolve: {companies: HomeResolveService}
            },
            {
                path: 'sale',
                loadChildren: './sale/sale.module#SaleModule',
            },
        ],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule {
}
