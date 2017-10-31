import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeViewComponent } from './upgrade-view.component';

describe('UpgradeViewComponent', () => {
  let component: UpgradeViewComponent;
  let fixture: ComponentFixture<UpgradeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
