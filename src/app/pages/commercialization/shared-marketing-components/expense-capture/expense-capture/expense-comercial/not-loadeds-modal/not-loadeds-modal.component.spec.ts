/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotLoadedsModalComponent } from './not-loadeds-modal.component';

describe('NotLoadedsModalComponent', () => {
  let component: NotLoadedsModalComponent;
  let fixture: ComponentFixture<NotLoadedsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotLoadedsModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotLoadedsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
