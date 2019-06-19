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
    }

    ngOnInit() {
        setTimeout(this.showPage, 3000);
    }

    showPage() {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('myDiv').style.display = 'block';
    }
}
