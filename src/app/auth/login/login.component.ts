import { Component, OnInit } from '@angular/core';
import { ScriptLoaderService } from 'src/app/_services/script-loader.service';
import {Router} from "@angular/router"
import { Helpers } from 'src/app/helpers';
import { AuthService } from '../auth.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( private _script: ScriptLoaderService,
    private router: Router,
    private authService: AuthService
    ) {
      $('body').attr('class', 'login-layout light-login');
  }

  ngOnInit() {
    this.getSettings();
  }


  login(){
    //const email = form.value.email;
    const email = 'zahid@gmail.com';
    const password = '123456';
    //const password = form.value.password;
    this.authService.signinUser(email, password);
  }
  getSettings() {
    Helpers.loadStyles('head', 'assets/css/bootstrap.min.css');
    Helpers.loadStyles('head', 'assets/font-awesome/4.5.0/css/font-awesome.min.css');
    Helpers.loadStyles('head', 'assets/css/fonts.googleapis.com.css');
    Helpers.loadStyles('head', 'assets/css/ace.min.css');
    Helpers.loadStyles('head', 'assets/css/ace-rtl.min.css');

    this._script.loadScripts('body', [
      'assets/js/jquery-2.1.4.min.js',
    ])
        .then(result => {
          Helpers.setLoading(false);
        });
  }
}
