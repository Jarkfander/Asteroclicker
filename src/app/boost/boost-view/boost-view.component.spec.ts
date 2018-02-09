import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostViewComponent } from './boost-view.component';

describe('BoostViewComponent', () => {
  let component: BoostViewComponent;
  let fixture: ComponentFixture<BoostViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoostViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoostViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
