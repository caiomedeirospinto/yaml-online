import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsProgressBarComponent } from './items-progress-bar.component';

describe('ItemsProgressBarComponent', () => {
  let component: ItemsProgressBarComponent;
  let fixture: ComponentFixture<ItemsProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsProgressBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
