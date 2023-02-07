import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AssignReceiptFormComponent } from '../../../shared-request/assign-receipt-form/assign-receipt-form.component';
import { GenerateReceiptFormComponent } from '../../../shared-request/generate-receipt-form/generate-receipt-form.component';
import { PhotographyFormComponent } from '../../../shared-request/photography-form/photography-form.component';
import {
  IUser,
  USER_COLUMNS,
} from '../../acept-programming/columns/users-columns';
import { DocumentsListComponent } from '../documents-list/documents-list.component';
import { ReschedulingFormComponent } from '../rescheduling-form/rescheduling-form.component';
import { RECEIPT_COLUMNS } from './columns/minute-columns';
import { TRANSPORTABLE_GOODS } from './columns/transportable-goods-columns';
import { receipts, tranGoods } from './execute-reception-data';

@Component({
  selector: 'app-execute-reception-form',
  templateUrl: './execute-reception-form.component.html',
  styleUrls: ['./execute-reception.scss'],
})
export class ExecuteReceptionFormComponent extends BasePage implements OnInit {
  isDropup = true;
  executeForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  settingsTranGoods = {
    ...this.settings,
    actions: false,
    selectMode: 'multi',
    columns: TRANSPORTABLE_GOODS,
  };

  settingsReceipt = {
    ...this.settings,
    actions: {
      columnTitle: 'Generar recibo',
      position: 'right',
      delete: false,
    },
    columns: RECEIPT_COLUMNS,
    edit: {
      editButtonContent: '<i class="fa fa-file text-primary mx-2"></i>',
    },
  };

  userData: IUser[] = [];
  //Cambiar a modelos//
  tranGoods = tranGoods;
  receipts = receipts;

  search: FormControl = new FormControl({});
  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    super();
    this.settings = { ...this.settings, actions: false, columns: USER_COLUMNS };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.executeForm = this.fb.group({
      saeDescription: [null],
      saeAmount: [null],
      satUnit: [null],
      stateFisicSae: [null],
      stateConservationSae: [null],
      selectColumn: [null],
    });
  }

  uploadDocuments() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const uploadDocuments = this.modalService.show(
      DocumentsListComponent,
      config
    );
  }

  uploadPicture() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const uploadPictures = this.modalService.show(
      PhotographyFormComponent,
      config
    );
  }

  createReceipt() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const createReceipt = this.modalService.show(
      GenerateReceiptFormComponent,
      config
    );
  }

  assignReceipt() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const assignReceipt = this.modalService.show(
      AssignReceiptFormComponent,
      config
    );
  }

  rescheduling() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const rescheduling = this.modalService.show(
      ReschedulingFormComponent,
      config
    );
  }

  showEstate() {
    alert('vista imprimir reporte');
  }

  delete() {}
}
