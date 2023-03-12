import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BatchService } from 'src/app/core/services/catalogs/batch.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DATA } from './data';
import {
  dataBatchColum,
  PUBLICATION_PHOTO1,
  PUBLICATION_PHOTO2,
} from './publication-photographs-columns';

@Component({
  selector: 'app-publication-photographs',
  templateUrl: './publication-photographs.component.html',
  styles: [
    `
      .float-check {
        position: absolute;
        top: -10px;
        right: -10px;
      }
    `,
  ],
})
export class PublicationPhotographsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  dataBatch: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  batchList: any;
  selectedCve: any = null;
  cveItems = new DefaultSelect();
  totalItems: number = 0;

  data1: LocalDataSource = new LocalDataSource();
  dataAllotment = DATA;

  data2: LocalDataSource = new LocalDataSource();
  rowSelected: boolean = false;
  rowAllotment: string = null;
  selectedRow: any = null;

  rowSelectedGood: boolean = false;

  settings1;
  settings2;
  settings4;

  columns: any[] = [];
  @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder, private batchService: BatchService) {
    super();
    this.settings1 = {
      ...this.settings,
      actions: false,
      columns: { ...PUBLICATION_PHOTO1 },
    };

    this.settings2 = {
      ...this.settings,
      actions: false,
      columns: { ...PUBLICATION_PHOTO2 },
    };
    this.settings4 = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: { ...dataBatchColum },
      noDataMessage: 'No se encontrarón registros',
    };
  }

  ngOnInit(): void {
    this.getCve({ page: 1, text: '' });
    this.data1.load(this.dataAllotment);
    this.prepareForm();
    this.getBatch();
  }

  private prepareForm() {
    this.form = this.fb.group({
      favorite: [null, [Validators.required]],
      id: [null, [Validators.required]],
    });
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
      type: 'SUBASTA',
      status: 'EN SUBASTA',
    },
    {
      id: '3242',
      description: 'COMER/COMDD/09-21/74',
      type: 'TIPO 03',
      status: 'DONACIÓN',
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

  selectRow(row: any) {
    this.data2.load(row.goods); //Sub
    this.data2.refresh();
    this.rowAllotment = row.allotment; //primary
    this.rowSelected = true;
  }

  selectRowGood() {
    this.rowSelectedGood = true;
  }
  getBatch() {
    this.loading = true;
    this.batchService.getAll(this.params.getValue()).subscribe({
      next: data => {
        this.batchList = data;
        this.dataBatch = this.batchList.data;
        this.totalItems = data.count;
        console.log(this.dataBatch);
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  //Carrusel de fotografías
  itemsPerSlide = 5;
  singleSlideOffset = true;

  slides = [
    {
      image:
        'https://i.pinimg.com/originals/b5/32/5b/b5325b470c543806ab38376946d194c0.jpg',
    },
    {
      image:
        'https://i.pinimg.com/originals/55/da/25/55da25dd5c6763f54f72e525c4462c18.jpg',
    },
    {
      image:
        'https://i.pinimg.com/originals/25/19/12/251912a9122dce982d4f9a4c4f7a3360.jpg',
    },
    {
      image:
        'https://i.pinimg.com/originals/8a/88/81/8a88817c9c7702d4cecf14f84e601158.jpg',
    },
    {
      image:
        'https://cdn.dealeraccelerate.com/premier/19/5096/92829/1920x1440/1984-chevrolet-silverado-k10-4x4-pickup',
    },
    {
      image:
        'https://bringatrailer.com/wp-content/uploads/2022/01/1984_chevrolet_k10_20210909_180334-Copy-100030.jpg?fit=940%2C626',
    },
  ];
}
