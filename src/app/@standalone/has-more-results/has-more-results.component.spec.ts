/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HasMoreResultsComponent } from './has-more-results.component';

describe('HasMoreResultsComponent', () => {
  let component: HasMoreResultsComponent;
  let fixture: ComponentFixture<HasMoreResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HasMoreResultsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HasMoreResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
