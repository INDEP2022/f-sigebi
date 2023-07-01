/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioInputComponent } from './folio-input.component';

describe('FolioInputComponent', () => {
  let component: FolioInputComponent;
  let fixture: ComponentFixture<FolioInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FolioInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolioInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
