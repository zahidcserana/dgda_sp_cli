import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FooterModule } from './home-modules/footer/footer.module';
import { HeaderModule } from './home-modules/header/header.module';
import { MenuModule } from './home-modules/menu/menu.module';
import { LoginModule } from '../auth/login/login.module';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth-guard.service';
import { PurchaseService } from './report-manual-purchase/purchase-service/purchase.service';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FooterModule,
    HeaderModule,
    MenuModule,
    LoginModule,
  ],
  providers: [AuthService, AuthGuard, PurchaseService]
})

export class HomeModule { }
