import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HeaderComponent } from './home-modules/header/header.component';
import { FooterComponent } from './home-modules/footer/footer.component';
import { MenuComponent } from './home-modules/menu/menu.component';
import { FooterModule } from './home-modules/footer/footer.module';
import { HeaderModule } from './home-modules/header/header.module';
import { MenuModule } from './home-modules/menu/menu.module';
import { LoginModule } from '../pages/login/login.module';

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
    LoginModule
  ]
})

export class HomeModule { }
