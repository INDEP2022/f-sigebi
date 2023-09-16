/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeraireDispersionComponent } from './numeraire-dispersion.component';

describe('NumeraireDispersionComponent', () => {
  let component: NumeraireDispersionComponent;
  let fixture: ComponentFixture<NumeraireDispersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NumeraireDispersionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeraireDispersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
