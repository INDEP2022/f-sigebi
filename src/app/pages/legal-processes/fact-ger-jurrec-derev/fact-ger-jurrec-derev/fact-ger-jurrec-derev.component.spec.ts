import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactGerJurrecDerevComponent } from './fact-ger-jurrec-derev.component';

describe('FactGerJurrecDerevComponent', () => {
  let component: FactGerJurrecDerevComponent;
  let fixture: ComponentFixture<FactGerJurrecDerevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactGerJurrecDerevComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactGerJurrecDerevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
