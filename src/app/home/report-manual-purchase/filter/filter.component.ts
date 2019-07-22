import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute} from "@angular/router";
import {AccountReport} from '../../report-models/purchase.model';
import {FORMAT_SEARCH} from '../../../globals/_classes/functions';

declare let $:any;
declare var moment: any;

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
    accountReport: AccountReport;
    filter: string;
    search: boolean;
    sub: Subscription;
    @Input('status') status;
    @Input('type') type;
    @Output('loadList') loadList: EventEmitter<string> = new EventEmitter();

    constructor(private route: ActivatedRoute) {
        this.accountReport = new AccountReport();
        this.sub = this.route.paramMap.subscribe(
            val => {
                this.reset();
            }
        );
    }

    ngOnInit() {
    }
    ngAfterViewInit() {
       // this._dateRange();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    reset() {
        this.accountReport = new AccountReport();
        this.accountReport.date_start = null;
        this.accountReport.date_end = null;
    }
    searchAccountReport(){
        this.filter = FORMAT_SEARCH(this.accountReport);
        if(this.filter) {
            this.loadList.emit(this.filter);
            this.search = true;
        }
    }
    resetSearch(){
        this.reset();
        this.filter = null;
        if(this.search) {
            this.loadList.emit('');
            this.search = false;
        }
    }
    private _dateRange() {
        $('#m_daterangepicker_3').daterangepicker({
            opens: 'left',
            startDate: moment(),
            endDate: moment().endOf('month'),
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            autoUpdateInput: true,
            buttonClasses: 'm-btn btn',
            applyClass: 'btn-brand',
            cancelClass: 'btn-danger'
        }, (start, end, label) => {
            this.accountReport.date_start = start.format('YYYY-MM-DD');
            this.accountReport.date_end = end.format('YYYY-MM-DD');
            $('#m_daterangepicker_3 .form-control').val( 'From ' + start.format('YYYY-MM-DD') + ' To ' + end.format('YYYY-MM-DD'));
        });
    }
}
