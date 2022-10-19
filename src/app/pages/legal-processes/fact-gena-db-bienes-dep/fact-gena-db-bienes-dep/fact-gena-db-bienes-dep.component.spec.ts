import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactGenaDBBienesXDepComponent } from './fact-gena-db-bienes-dep.component';

describe('FactGenaDBBienesXDepComponent', () => {
  let component: FactGenaDBBienesXDepComponent;
  let fixture: ComponentFixture<FactGenaDBBienesXDepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactGenaDBBienesXDepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactGenaDBBienesXDepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
