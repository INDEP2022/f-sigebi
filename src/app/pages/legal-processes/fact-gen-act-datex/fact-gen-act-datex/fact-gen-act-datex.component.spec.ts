import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactGenActDatexComponent } from './fact-gen-act-datex.component';

describe('FactGenActDatexComponent', () => {
  let component: FactGenActDatexComponent;
  let fixture: ComponentFixture<FactGenActDatexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactGenActDatexComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactGenActDatexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
