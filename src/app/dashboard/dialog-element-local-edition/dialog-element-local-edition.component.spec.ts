import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogElementLocalEditionComponent } from './dialog-element-local-edition.component';

describe('DialogElementLocalEditionComponent', () => {
  let component: DialogElementLocalEditionComponent;
  let fixture: ComponentFixture<DialogElementLocalEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogElementLocalEditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogElementLocalEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
