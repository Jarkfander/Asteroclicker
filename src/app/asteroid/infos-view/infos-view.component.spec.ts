import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosViewComponent } from './infos-view.component';

describe('InfosViewComponent', () => {
  let component: InfosViewComponent;
  let fixture: ComponentFixture<InfosViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfosViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
