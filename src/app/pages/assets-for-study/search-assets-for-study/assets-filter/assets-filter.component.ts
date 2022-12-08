import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from '../../../../core/interfaces/model-form';
import { DefaultSelect } from '../../../../shared/components/select/default-select';

@Component({
  selector: 'app-assets-filter',
  templateUrl: './assets-filter.component.html',
  styles: [],
})
export class AssetsFilterComponent implements OnInit {
  @Input() data: any;
  @Output() searchForm = new EventEmitter<any>();
  filterForm: ModelForm<any>;
  warehouseSelected = new DefaultSelect();
  destinySelected = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log(this.data);
    this.initForm();
  }

  initForm(): void {
    //algunos datos son pre cargados
    this.filterForm = this.fb.group({
      transfer: [null],
      expedient: [null],
      warehouse: [null],
      destiny: [null],
    });
  }

  getWarehouseSelected(event: any) {}

  getDestinySelect(event: any) {}

  search(): void {
    this.searchForm.emit(this.filterForm.value);
  }

  clean(): void {
    //resetear y volver a su estado inicial
    this.filterForm.reset();
  }
}
