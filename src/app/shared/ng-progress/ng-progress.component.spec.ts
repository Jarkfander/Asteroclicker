import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgProgressComponent } from './ng-progress.component';

describe('NgProgressComponent', () => {
  let component: NgProgressComponent;
  let fixture: ComponentFixture<NgProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
