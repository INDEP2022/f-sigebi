/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeAbandonmentForSecuringModalComponent } from './notice-abandonment-for-securing-modal.component';

describe('NoticeAbandonmentForSecuringModalComponent', () => {
  let component: NoticeAbandonmentForSecuringModalComponent;
  let fixture: ComponentFixture<NoticeAbandonmentForSecuringModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoticeAbandonmentForSecuringModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      NoticeAbandonmentForSecuringModalComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
