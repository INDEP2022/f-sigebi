/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryOrdersComponent } from './entry-orders.component';

describe('EntryOrdersComponent', () => {
  let component: EntryOrdersComponent;
  let fixture: ComponentFixture<EntryOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryOrdersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
