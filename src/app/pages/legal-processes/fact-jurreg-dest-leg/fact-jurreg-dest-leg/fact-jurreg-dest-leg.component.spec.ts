import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactJurregDestLegComponent } from './fact-jurreg-dest-leg.component';

describe('FactJurregDestLegComponet', () => {
  let component: FactJurregDestLegComponent;
  let fixture: ComponentFixture<FactJurregDestLegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactJurregDestLegComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactJurregDestLegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
