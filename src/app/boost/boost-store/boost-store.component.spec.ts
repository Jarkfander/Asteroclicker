import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostStoreComponent } from './boost-store.component';

describe('BoostStoreComponent', () => {
  let component: BoostStoreComponent;
  let fixture: ComponentFixture<BoostStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoostStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoostStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
