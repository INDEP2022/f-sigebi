import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'app-event-selection',
  templateUrl: './event-selection.component.html',
  styles: [],
})
export class EventSelectionComponent extends DefaultEditor implements OnInit {
  selectForm: FormGroup = new FormGroup({});
  items = new DefaultSelect();
  @ViewChild('select') select: ElementRef;

  eventsTestData = [
    {
      id: 3107,
    },
    {
      id: 3201,
    },
    {
      id: 3305,
    },
    {
      id: 3306,
    },
    {
      id: 3408,
    },
  ];

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.selectForm = this.fb.group({
      item: [null],
    });
    this.items = new DefaultSelect(this.eventsTestData, 5);
    if (this.cell.newValue !== '')
      this.selectForm.controls['item'].setValue(this.cell.newValue);
  }

  selectItem(event: any) {
    this.cell.newValue = event;
  }

  getItems(params: ListParams) {
    if (params.text == '') {
      this.items = new DefaultSelect(this.eventsTestData, 5);
    } else {
      const search = params.text;
      const item = [
        this.eventsTestData.filter((i: any) => i.description == search),
      ];
      this.items = new DefaultSelect(item[0], 1);
    }
  }
}
