import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryTellerComponent } from './story-teller.component';

describe('StoryTellerComponent', () => {
  let component: StoryTellerComponent;
  let fixture: ComponentFixture<StoryTellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryTellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryTellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
