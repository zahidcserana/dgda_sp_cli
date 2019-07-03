import {Component, OnInit} from '@angular/core';
import {Helpers} from '../helpers';
import {ScriptLoaderService} from '../_services/script-loader.service';
import {Router} from '@angular/router';
import * as $ from 'jquery';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    constructor(private _script: ScriptLoaderService) {
        document.getElementById('loader').style.display = 'block';
        document.getElementById('myDiv').style.display = 'none';
        $('body').attr('class', 'no-skin');
        this.getSettings();
    }

    ngOnInit() {
        setTimeout(this.showPage, 3000);
    }

    showPage() {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('myDiv').style.display = 'block';
    }

    getSettings() {
        Helpers.loadStyles('head', 'assets/css/select2.min.css');
        Helpers.loadStyles('head', 'assets/css/jquery-ui.custom.min.css');
        Helpers.loadStyles('head', 'assets/css/chosen.min.css');
        Helpers.loadStyles('head', 'assets/css/bootstrap-datepicker3.min.css');
        Helpers.loadStyles('head', 'assets/css/bootstrap-timepicker.min.css');
        Helpers.loadStyles('head', 'assets/css/daterangepicker.min.css');
        Helpers.loadStyles('head', 'assets/css/bootstrap-datetimepicker.min.css');
        Helpers.loadStyles('head', 'assets/css/bootstrap-colorpicker.min.css');
        Helpers.loadStyles('head', 'assets/css/custom.css');
        this._script.loadScripts('body', [
            'assets/js/jquery-2.1.4.min.js',
            'assets/js/select2.min.js',
            'assets/js/chosen.jquery.min.js',
            'assets/js/spinbox.min.js',
            'assets/js/bootstrap-datepicker.min.js',
            'assets/js/bootstrap-timepicker.min.js',
            'assets/js/moment.min.js',
            'assets/js/daterangepicker.min.js',
            'assets/js/bootstrap-datetimepicker.min.js',
            'assets/js/bootstrap-colorpicker.min.js',
            'assets/js/jquery.knob.min.js',
            'assets/js/autosize.min.js',
            'assets/js/jquery.inputlimiter.min.js',
            'assets/js/jquery.maskedinput.min.js',
            'assets/js/bootstrap-tag.min.js',
            'assets/js/custom.js',
        ])
            .then(result => {
                // Helpers.setLoading(false);
            });


    }
}
