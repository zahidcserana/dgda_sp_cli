import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap
} from "rxjs/operators";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CartService } from "../cart-service/cart.service";
import { AlertService } from "../../modules/alert/alert.service";
import * as $ from "jquery";
import Swal from "sweetalert2";
import { DatePipe } from '@angular/common';

@Component({
  selector: "app-manual-purchase",
  templateUrl: "./manual-purchase.component.html",
  styleUrls: ["./manual-purchase.component.css"]
})
export class ManualPurchaseComponent implements OnInit {
  companyList: any[] = [];
  sub: Subscription;
  searchData: any[] = [];
  selectedFeatures: any = [];
  validationStatus = true;
  medicineSearch: any = {
    company: "",
    search: ""
  };
  manualOrder: any = {
    company: "",
    company_invoice: "",
    discount: "",
    purchase_date: new Date().toISOString().split("T")[0],
    items: []
  };

  form = new FormGroup({
    medicines: new FormArray([new FormControl()]),
    batches: new FormArray([new FormControl()]),
    quantities: new FormArray([new FormControl()]),
    mfgs: new FormArray([new FormControl()]),
    exps: new FormArray([new FormControl()]),
    totals: new FormArray([new FormControl()])
  });
  @ViewChild("hasAlert") alertContainer: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private cartS: CartService,
    private alertS: AlertService,
    private datePipe: DatePipe
  ) {}
  name = "Angular";
  modelDate = "";

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode("month");
  }
  get medicines(): FormArray {
    return this.form.get("medicines") as FormArray;
  }

  get batches(): FormArray {
    return this.form.get("batches") as FormArray;
  }

  get quantities(): FormArray {
    return this.form.get("quantities") as FormArray;
  }

  get mfgs(): FormArray {
    return this.form.get("mfgs") as FormArray;
  }

  get totals(): FormArray {
    return this.form.get("totals") as FormArray;
  }

  get exps(): FormArray {
    return this.form.get("exps") as FormArray;
  }

  addItem() {
    this.medicines.push(new FormControl());
    this.batches.push(new FormControl());
    this.quantities.push(new FormControl());
    this.mfgs.push(new FormControl());
    this.totals.push(new FormControl());
    this.exps.push(new FormControl());
  }
  removeItem(i) {
    this.medicines.removeAt(i);
    this.batches.removeAt(i);
    this.quantities.removeAt(i);
    this.mfgs.removeAt(i);
    this.totals.removeAt(i);
    this.exps.removeAt(i);
  }

  onSubmit() {
    if (confirm("Are you sure to submit.")) {
      console.log(this.form.value.medicines.length);
      this.validationCheck();
      this.emptyCheck(this.form.value);
      this.manualOrder.items = this.form.value;
      if (this.validationStatus) {
        this.cartS
          .manualOrder(this.manualOrder)
          .then(res => {
            if (res.success === true) {
              Swal.fire({
                position: "center",
                type: "success",
                title: "Orders successfully submitted.",
                showConfirmButton: false,
                timer: 1500
              });
              // this.alertS.success(this.alertContainer, 'Orders successfully submitted.', true, 3000);
              $(".validation-input").removeClass("invalid-input");
              // window.location.reload();
              $("#myForm").trigger("reset");
              $("input[name=company").val("");
              $("input[name=company_invoice").val("");
            } else {
              this.alertS.error(this.alertContainer, res.error, true, 3000);
            }
          })
          .catch(err => {
            console.log(err);
            this.alertS.error(this.alertContainer, err.error.error, true, 3000);
          });
      } else {
        Swal.fire({
          type: "warning",
          title: "Oops...",
          text: "Please enter all required field!"
        });
      }
    }
  }
  /** Validation Start */
  validationCheck() {
    const invoice = $("#company_invoice").val();
    console.log(invoice);
    if (!!invoice) {
      this.validationStatus = true;
    } else {
      this.validationStatus = false;
      $("#company_invoice").addClass("invalid-input");
    }
  }

  checkMedicine(items) {
    this.validationStatus = true;
    for (let i = 0; i < items.length; i++) {
      if (!!items[i]) {
        console.log(items[i]);
      } else {
        this.validationStatus = false;
        $("#medicine_" + i).addClass("invalid-input");
      }
    }
  }

  checkBatch(items) {
    this.validationStatus = true;
    for (let i = 0; i < items.length; i++) {
      if (!!items[i]) {
        console.log(items[i]);
      } else {
        this.validationStatus = false;
        $("#batch_" + i).addClass("invalid-input");
      }
    }
  }
  checkExp(items) {
    this.validationStatus = true;
    for (let i = 0; i < items.length; i++) {
      if (!!items[i]) {
        items[i] = this.datePipe.transform(new Date(items[i]),"yyyy-MM-dd");

        console.log(items[i]);
      } else {
        this.validationStatus = false;
        $("#exp_" + i).addClass("invalid-input");
      }
    }
  }

  emptyCheck(data) {
    this.checkMedicine(data.medicines);
    this.checkBatch(data.batches);
    this.checkExp(data.exps);
  }
  /** Validation End */
  ngOnInit() {
    this.sub = this.route.data.subscribe(val => {
      this.companyList = val && val["companies"] ? val["companies"] : [];
    });
  }

  company_search = (company$: Observable<string>) =>
    company$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2
          ? []
          : this.companyList
              .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        // this.searchData = [];
        // this.loader_sub = true;
      }),
      switchMap(term => {
        if (!!this.manualOrder.company) {
          $("#typeahead-company").removeClass("invalid-input");
          this.medicineSearch.company = this.manualOrder.company;
          this.medicineSearch.search = term.trim();
          return this.getMedicineList(this.medicineSearch);
        } else {
          this.validationStatus = false;
          $("#typeahead-company").addClass("invalid-input");
        }
      })
    );
  };

  private getMedicineList(params): any {
    if (!params && params === "") {
      // this.loader_sub = false;
      return [];
    }

    return this.cartS.searchMedicine(params).pipe(
      map(res => {
        // this.loader_sub = false;
        this.searchData = res;
        return this.searchData;
      }),
      catchError(() => {
        // this.loader_sub = false;
        return [];
      })
    );
  }
}
