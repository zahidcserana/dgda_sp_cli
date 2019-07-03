import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualPurchaseComponent } from './manual-purchase.component';

describe('ManualPurchaseComponent', () => {
  let component: ManualPurchaseComponent;
  let fixture: ComponentFixture<ManualPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
