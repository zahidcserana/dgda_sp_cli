import { Component } from '@angular/core';
import {Helpers} from './helpers';
import {ScriptLoaderService} from './_services/script-loader.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DGDA';

  constructor(private _script: ScriptLoaderService) {
    this.getSettings();
  }

  getSettings() {
    Helpers.loadStyles('head', 'assets/css/bootstrap.min.css');
    Helpers.loadStyles('head', 'assets/font-awesome/4.5.0/css/font-awesome.min.css');
    Helpers.loadStyles('head', 'assets/css/fonts.googleapis.com.css');
    Helpers.loadStyles('head', 'assets/css/ace.min.css');
    Helpers.loadStyles('head', 'assets/css/ace-part2.min.css');
    Helpers.loadStyles('head', 'assets/css/ace-skins.min.css');
    Helpers.loadStyles('head', 'assets/css/ace-rtl.min.css');
    Helpers.loadStyles('head', 'assets/css/ace-ie.min.css');

    this._script.loadScripts('body', [
      'assets/js/ace-extra.min.js',
      'assets/js/html5shiv.min.js',
      'assets/js/respond.min.js',
      'assets/js/jquery-2.1.4.min.js',
      'assets/js/jquery-1.11.3.min.js',
      'assets/js/bootstrap.min.js',
      'assets/js/excanvas.min.js',
      'assets/js/jquery-ui.custom.min.js',
      'assets/js/jquery.ui.touch-punch.min.js',
      'assets/js/jquery.easypiechart.min.js',
      'assets/js/jquery.sparkline.index.min.js',
      'assets/js/jquery.flot.min.js',
      'assets/js/jquery.flot.pie.min.js',
      'assets/js/jquery.flot.resize.min.js',
      'assets/js/ace-elements.min.js',
      'assets/js/ace.min.js'
    ])
        .then(result => {
          // Helpers.setLoading(false);
        });
  }
}


