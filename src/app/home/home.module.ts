import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import {HeaderComponent} from './home-modules/header/header.component';
import {FooterComponent} from './home-modules/footer/footer.component';

@NgModule({
  declarations: [
    HomeComponent,
      HeaderComponent,
      FooterComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
  ]
})

export class HomeModule { }
