import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningPanelComponent } from './mining-panel.component';

describe('MiningPanelComponent', () => {
  let component: MiningPanelComponent;
  let fixture: ComponentFixture<MiningPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiningPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiningPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
