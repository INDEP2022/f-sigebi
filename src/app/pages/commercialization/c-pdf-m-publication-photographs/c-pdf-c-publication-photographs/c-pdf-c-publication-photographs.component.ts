import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-c-pdf-c-publication-photographs',
  templateUrl: './c-pdf-c-publication-photographs.component.html',
  styles: [],
})
export class CPdfCPublicationPhotographsComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  selectedCve: any = null;
  cveItems = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getCve({ inicio: 1, text: '' });
  }

  data: any[] = [
    {
      id: '9423',
      description: 'DESTRU/COMDD/10-03/02',
      type: 'REMESA',
      status: 'EN PREPARACIÓN',
    },
    {
      id: '7897',
      description: 'CRCUL/COMDD/08-10/15',
      type: 'REMESA',
      status: 'EN PREPARACIÓN',
    },
    {
      id: '3242',
      description: 'COMER/COMDD/09-21/74',
      type: 'REMESA',
      status: 'EN PREPARACIÓN',
    },
  ];

  getCve(params: ListParams) {
    if (params.text == '') {
      this.cveItems = new DefaultSelect(this.data, 3);
    } else {
      const id = parseInt(params.text);
      const item = [this.data.filter((i: any) => i.id == id)];
      this.cveItems = new DefaultSelect(item[0], 1);
    }
  }

  selectCve(event: any) {
    this.selectedCve = event;
  }
}
