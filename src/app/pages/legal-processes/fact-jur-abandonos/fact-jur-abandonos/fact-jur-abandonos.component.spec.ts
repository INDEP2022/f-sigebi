import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactJurAbonadosComponent } from './fact-jur-abandonos.component';

describe('FactJurAbonadosComponent', () => {
  let component: FactJurAbonadosComponent;
  let fixture: ComponentFixture<FactJurAbonadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactJurAbonadosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactJurAbonadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
