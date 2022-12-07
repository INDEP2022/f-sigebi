import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { DetailDelegationsComponent } from '../../../shared-final-destination/detail-delegations/detail-delegations.component';
import { COLUMNS_GOODS } from './columns-goods';
import { COLUMNS_ORDERS } from './columns-orders';

@Component({
  selector: 'app-generate-estrategy',
  templateUrl: './generate-estrategy.component.html',
  styles: [],
})
export class GenerateEstrategyComponent extends BasePage implements OnInit {
  formService: FormGroup;
  formGoods: FormGroup;
  bsModalRef?: BsModalRef;
  myTime: Date = new Date();
  settingsGoods = { ...this.settings, actions: false };
  settingsOrders = { ...this.settings, actions: false };
  dataGoods = EXAMPLE_DATA1;
  dataOrders = EXAMPLE_DATA2;
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settingsGoods.columns = COLUMNS_GOODS;
    this.settingsOrders.columns = COLUMNS_ORDERS;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formService = this.fb.group({
      type: [null, []],
      process: [null, []],
      processDescrip: [null, []],
      captureDate: [null, []],
      regionalCoord: [null, []],
      coordinationDescrip: [null, []],
      serviceKey: [null, []],
      cancellAuthDate: [null, []],
      uniqueKey: [null, []],
      transferenceId: [null, []],
      transferenceDescrip: [null, []],
      transmitterId: [null, []],
      transmitterDescrip: [null, []],
      authorityId: [null, []],
      authorityDescrip: [null, []],
      keyStore: [null, []],
      storeDescrip: [null, []],
      ubication: [null, []],
    });

    this.formGoods = this.fb.group({
      eventStartDate: [null, []],
      eventEndDate: [null, []],
      eventTime: [new Date(), []],
      statusChange: [null, []],
    });
  }

  openModal() {
    const initialState: ModalOptions = {
      initialState: {
        title: 'Histórico de Estatus',
        optionColumn: 'status-history',
      },
    };
    this.bsModalRef = this.modalService.show(
      DetailDelegationsComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  settingsChange($event: any): void {
    this.settingsOrders = $event;
  }

  onSubmit() {}

  onSubmit2() {}
}

const EXAMPLE_DATA1 = [
  {
    numberGood: 12121,
    description: 'Muebles',
    quantity: 15,
    volumetry: 'volumen',
  },
];

const EXAMPLE_DATA2 = [
  {
    idService: 1,
    serviceDescription: 'posicion de alr..',
    idSpecification: 15,
    specification: 'Almacén techado',
    idTurn: 21,
    turn: 'Posición Piso',
    idVariableCost: 9,
    variableCost: 'Cuota Mensual',
    observations: '',
    cost: '',
    quantity: '',
    amount: '',
  },
];
