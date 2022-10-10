import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactGenExpedNotifComponent } from './fact-gen-exped-notif.component';

describe('FactGenExpedNotifComponent', () => {
  let component: FactGenExpedNotifComponent;
  let fixture: ComponentFixture<FactGenExpedNotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactGenExpedNotifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactGenExpedNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
