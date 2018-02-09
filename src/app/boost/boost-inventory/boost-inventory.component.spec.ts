import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostInventoryComponent } from './boost-inventory.component';

describe('BoostInventoryComponent', () => {
  let component: BoostInventoryComponent;
  let fixture: ComponentFixture<BoostInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoostInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoostInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
