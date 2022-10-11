import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactJurDictAmasComponent } from './fact-jur-dict-amas.component';

describe('FactJurDictAmasComponent', () => {
  let component: FactJurDictAmasComponent;
  let fixture: ComponentFixture<FactJurDictAmasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactJurDictAmasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactJurDictAmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
