import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgToasterComponent } from './ng-toaster.component';

describe('NgToasterComponent', () => {
  let component: NgToasterComponent;
  let fixture: ComponentFixture<NgToasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgToasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
