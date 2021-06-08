import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineSessionComponent } from './online-session.component';

describe('OnlineSessionComponent', () => {
  let component: OnlineSessionComponent;
  let fixture: ComponentFixture<OnlineSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
