import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ScriptLoaderService} from './_services/script-loader.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { LoginModule } from './auth/login/login.module';
import {HttpWithInjectorModule} from './modules/http-with-injector/http-with-injector.module';
import {AlertModule} from './modules/alert/alert.module';
import { HomeService } from './home/service/home.service';
import { HomeResolveService } from './home/service/home-resolve.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    AlertModule.forRoot({main: 'something'}),
    HttpWithInjectorModule.forRoot({endPoint: ''}),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ScriptLoaderService, AuthService, AuthGuard, HomeService, HomeResolveService],
  bootstrap: [AppComponent]
})
export class AppModule { }
