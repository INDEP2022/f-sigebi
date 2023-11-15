/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeraireDispersionModalComponent } from './numeraire-dispersion-modal.component';

describe('NumeraireDispersionModalComponent', () => {
  let component: NumeraireDispersionModalComponent;
  let fixture: ComponentFixture<NumeraireDispersionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NumeraireDispersionModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeraireDispersionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
