import {Component, OnInit} from '@angular/core';
import {Helpers} from '../../helpers';
import {ScriptLoaderService} from '../../_services/script-loader.service';

@Component({
    selector: 'app-sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

    constructor(private _script: ScriptLoaderService
    ) {
        this.getSettings();

    }

    ngOnInit() {
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
