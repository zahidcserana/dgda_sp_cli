import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportManualPurchaseComponent } from './report-manual-purchase.component';

describe('ReportManualPurchaseComponent', () => {
  let component: ReportManualPurchaseComponent;
  let fixture: ComponentFixture<ReportManualPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportManualPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportManualPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
