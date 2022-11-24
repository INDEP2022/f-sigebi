import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';
import { AnnexKComponent } from '../annex-k/annex-k.component';
import { LIST_ORDERS_COLUMNS } from './columns/list-orders-columns';

var data = [
  {
    id: 1,
    noServiceOrder: '1275',
    foilServiceOrder: 'METROPOLITANA-SAT-1275-08',
    typeServiceOrder: 'Validación de requerimientos',
    regionalDelegation: 'METROPOLITANA',
    transfer: 'SAT-COMERCIO-EXTERIOR',
    noContract: '124',
    noRequest: '1428',
    costServices: '185.14',
  },
  {
    id: 2,
    noServiceOrder: '1233',
    foilServiceOrder: 'METROPOLITANA-SAT-1233-08',
    typeServiceOrder: 'Validación de requerimientos',
    regionalDelegation: 'METROPOLITANA',
    transfer: 'SAT-COMERCIO-EXTERIOR',
    noContract: '122',
    noRequest: '1422',
    costServices: '85.14',
  },
];

@Component({
  selector: 'app-generate-query',
  templateUrl: './generate-query.component.html',
  styleUrls: ['./generate-query.component.scss'],
})
export class GenerateQueryComponent extends BasePage implements OnInit {
  title: string = 'Genera Consulta';
  orderServiceForm: ModelForm<any>;
  geographicalAreaSelected = new DefaultSelect();
  contractNumberSelected = new DefaultSelect();
  selectedRows: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;

  sendData: any[] = [];
  //Datos Anexo para pasar
  dataAnnex: any;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: LIST_ORDERS_COLUMNS,
    };
    this.initForm();
    this.getData();
  }

  getData() {
    this.paragraphs = data;
  }

  initForm() {
    this.orderServiceForm = this.fb.group({
      geographicalArea: [null],
      samplingPeriod: [null],
      contractNumber: [null],
    });
  }

  addOrders(): void {
    this.sendData = this.selectedRows;
  }

  rowsSelected(event: any) {
    this.selectedRows = event.selected;
  }

  getContractNumberSelect(event: any) {}

  getgeographicalAreaSelect(event: any) {}

  openAnnexK() {
    this.openModal(AnnexKComponent, '', 'generate-query');
  }

  turnSampling() {}

  save() {}

  openModal(component: any, data?: any, typeAnnex?: string) {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeAnnex: typeAnnex,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);
  }
}
