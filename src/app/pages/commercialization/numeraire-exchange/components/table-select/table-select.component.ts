import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-table-select',
  templateUrl: './table-select.component.html',
  styles: [],
})
export class TableSelectComponent extends DefaultEditor implements OnInit {
  selectForm: FormGroup = new FormGroup({});
  items = new DefaultSelect();
  @ViewChild('select') select: ElementRef;

  expenseTypeTest = [
    {
      id: 3107,
      description: 'SERVICIO DE AGUA',
    },
    {
      id: 3201,
      description: 'ARRENDAMIENTO DE SERVICIO Y LOCALES',
    },
    {
      id: 3305,
      description: 'CAPACITACIONES',
    },
    {
      id: 3306,
      description: 'SERVICIOS DE INFORMÁTICA',
    },
    {
      id: 3408,
      description: 'COMISIONES POR VENTAS',
    },
  ];

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.selectForm = this.fb.group({
      item: [null],
    });
    this.items = new DefaultSelect(this.expenseTypeTest, 5);
    if (this.cell.newValue !== '')
      this.selectForm.controls['item'].setValue(this.cell.newValue);
  }

  selectItem(event: any) {
    this.cell.newValue = event;
  }

  getItems(params: ListParams) {
    if (params.text == '') {
      this.items = new DefaultSelect(this.expenseTypeTest, 5);
    } else {
      const search = params.text;
      const item = [
        this.expenseTypeTest.filter((i: any) => i.description == search),
      ];
      this.items = new DefaultSelect(item[0], 1);
    }
  }
}
