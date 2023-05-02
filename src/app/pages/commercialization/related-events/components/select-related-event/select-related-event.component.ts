import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-select-related-event',
  templateUrl: './select-related-event.component.html',
  styles: [],
})
export class SelectRelatedEventComponent
  extends DefaultEditor
  implements OnInit
{
  selectForm: FormGroup = new FormGroup({});
  items = new DefaultSelect();
  @ViewChild('select') select: ElementRef;

  eventsTestData = [
    {
      id: 11122,
      process: 'DECBMI0107',
      status: 'CONCILIADO A SIRSAE',
    },
    {
      id: 2321,
      process: 'DECBMI0107',
      status: 'CONCILIADO A SIRSAE',
    },
    {
      id: 3123,
      process: 'DECBMI0107',
      status: 'CONCILIADO A SIRSAE',
    },
  ];

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.selectForm = this.fb.group({
      item: [null],
    });
    this.items = new DefaultSelect(this.eventsTestData, 3);
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
