import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsteroidViewComponent } from './asteroid-view.component';

describe('AsteroidViewComponent', () => {
  let component: AsteroidViewComponent;
  let fixture: ComponentFixture<AsteroidViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsteroidViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsteroidViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
