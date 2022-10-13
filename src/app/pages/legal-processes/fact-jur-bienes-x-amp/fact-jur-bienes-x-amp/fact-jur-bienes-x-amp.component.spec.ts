import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactJurBienesXAmpComponent } from './fact-jur-bienes-x-amp.component';

describe('FactJurBienesXAmpComponent', () => {
  let component: FactJurBienesXAmpComponent;
  let fixture: ComponentFixture<FactJurBienesXAmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactJurBienesXAmpComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactJurBienesXAmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
