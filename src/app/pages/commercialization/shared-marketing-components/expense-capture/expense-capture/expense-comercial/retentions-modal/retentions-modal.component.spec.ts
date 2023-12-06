/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionsModalComponent } from './retentions-modal.component';

describe('RetentionsModalComponent', () => {
  let component: RetentionsModalComponent;
  let fixture: ComponentFixture<RetentionsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetentionsModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
