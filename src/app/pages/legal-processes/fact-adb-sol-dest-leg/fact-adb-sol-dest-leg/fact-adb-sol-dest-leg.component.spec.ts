import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactAdbSolDestLegComponent } from './fact-adb-sol-dest-leg.component';

describe('FactAdbSolDestLegComponent', () => {
  let component: FactAdbSolDestLegComponent;
  let fixture: ComponentFixture<FactAdbSolDestLegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactAdbSolDestLegComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactAdbSolDestLegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
