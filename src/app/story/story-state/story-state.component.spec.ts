import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryStateComponent } from './story-state.component';

describe('StoryStateComponent', () => {
  let component: StoryStateComponent;
  let fixture: ComponentFixture<StoryStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
