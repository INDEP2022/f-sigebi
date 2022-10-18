import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactJurDictamRecrComponent } from './fact-jur-dictam-recr.component';

describe('FactJurDictamRecrComponent', () => {
  let component: FactJurDictamRecrComponent;
  let fixture: ComponentFixture<FactJurDictamRecrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactJurDictamRecrComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactJurDictamRecrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
