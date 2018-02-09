import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostListComponent } from './boost-list.component';

describe('BoostListComponent', () => {
  let component: BoostListComponent;
  let fixture: ComponentFixture<BoostListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoostListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
