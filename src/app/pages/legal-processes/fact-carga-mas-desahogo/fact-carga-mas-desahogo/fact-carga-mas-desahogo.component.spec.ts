import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactCargaMasDesahogoComponent } from './fact-carga-mas-desahogo.component';

describe('FactCargaMasDesahogoComponent', () => {
  let component: FactCargaMasDesahogoComponent;
  let fixture: ComponentFixture<FactCargaMasDesahogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactCargaMasDesahogoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactCargaMasDesahogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
