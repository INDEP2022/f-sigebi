/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivationCharGoodCellComponent } from './derivation-char-good-cell.component';

describe('DerivationCharGoodCellComponent', () => {
  let component: DerivationCharGoodCellComponent;
  let fixture: ComponentFixture<DerivationCharGoodCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DerivationCharGoodCellComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivationCharGoodCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
