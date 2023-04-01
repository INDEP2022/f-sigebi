import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequestLotParam } from 'src/app/core/models/requests/request-lot-params.model';
import { LotParamsService } from 'src/app/core/services/ms-lot-parameters/lot-parameters.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { EventSelectionComponent } from '../components/event-selection/event-selection.component';
import { BATCH_PARAMETERS_COLUMNS } from './batch-parameters-columns';

@Component({
  selector: 'app-batch-parameters-list',
  templateUrl: './batch-parameters-list.component.html',
  styles: [],
})
export class BatchParametersListComponent extends BasePage implements OnInit {
  adding: boolean = false;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  lotparams: IRequestLotParam[] = [];
  filterRow: any;
  addOption: any;
  addRowElement: any;
  cancelBtn: any;
  cancelEvent: any;
  createButton: string =
    '<span class="btn btn-success active font-size-12 me-2 mb-2 py-2 px-2">Agregar</span>';
  saveButton: string =
    '<span class="btn btn-info active font-size-12 me-2 mb-2 py-2 px-2">Actualizar</span>';
  cancelButton: string =
    '<span class="btn btn-warning active font-size-12 text-black me-2 mb-2 py-2 px-2 cancel">Cancelar</span>';

  paramSettings = {
    ...TABLE_SETTINGS,
    selectedRowIndex: -1,
    mode: 'internal',
    hideSubHeader: false,
    filter: {
      inputClass: 'd-none',
    },
    attr: {
      class: 'table-bordered normal-hover',
    },
    add: {
      createButtonContent: this.createButton,
      cancelButtonContent: this.cancelButton,
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
      saveButtonContent: this.saveButton,
      cancelButtonContent: this.cancelButton,
      confirmSave: true,
    },
  };

  constructor(private lotparamsService: LotParamsService) {
    super();
    this.paramSettings.columns = BATCH_PARAMETERS_COLUMNS;
    this.paramSettings.actions.delete = true;
    this.paramSettings.columns = {
      ...this.paramSettings.columns,
      event: {
        title: 'Evento',
        sort: false,
        type: 'html',
        width: '25%',
        editor: {
          type: 'custom',
          component: EventSelectionComponent,
        },
      },
    };
  }

  ngOnInit(): void {
    this.hideFilters();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLotParams());
  }

  getLotParams() {
    const params = this.params.getValue();

    this.loading = true;
    // this.loadingText = 'Cargando';
    // params.text = this.consultTasksForm.value.txtSearch;
    // params['others'] = this.userName;

    this.lotparamsService.getAll(params).subscribe({
      next: response => {
        console.log('Estos son los lot parametros:', response.data);

        this.loading = false;
        this.lotparams = response.data;
        this.totalItems = response.count;
      },
      error: () => (this.loading = false),
    });
  }

  getSearch() {
    this.loading = true;
    console.log(this.params.getValue());
    this.loading = false;
  }

  hideFilters() {
    setTimeout(() => {
      let filterArray = document.getElementsByClassName('ng2-smart-filters');
      this.filterRow = filterArray.item(0);
      this.filterRow.classList.add('d-none');
      this.addOption = document
        .getElementsByClassName('ng2-smart-action-add-add')
        .item(0);
    }, 200);
  }

  addRow() {
    this.adding = true;
    this.addOption.click();
    setTimeout(() => {
      this.addRowElement = document
        .querySelectorAll('tr[ng2-st-thead-form-row]')
        .item(0);
      this.addRowElement.classList.add('row-no-pad');
      this.addRowElement.classList.add('add-row-height');
      this.cancelBtn = document.querySelectorAll('.cancel').item(0);
      this.cancelEvent = this.handleCancel.bind(this);
      this.cancelBtn.addEventListener('click', this.cancelEvent);
    }, 300);
  }

  handleCancel() {
    this.adding = false;
    this.cancelBtn = document.querySelectorAll('.cancel').item(0);
    this.cancelBtn.removeEventListener('click', this.cancelEvent);
  }

  alertTable() {
    this.onLoadToast(
      'error',
      'Campos incompletos',
      'Complete todos los campos para agregar un registro'
    );
  }

  async addEntry(event: any) {
    // console.log("Agregando nuevo parametro");
    let { newData, confirm } = event;
    if (!newData.event || newData.batch == '' || newData.warranty == '') {
      this.alertTable();
      return;
    }
    // newData.event = newData.event.id;
    const requestBody = {
      idLot: '',
      idEvent: event.newData.idEvent,
      publicLot: event.newData.publicLot,
      specialGuarantee: event.newData.specialGuarantee,
      nbOrigin: 'Agregado desde angular',
    };
    // console.log("Request body create: ", requestBody);

    // Llamar servicio para agregar registro
    // this.lotparamsService.createLotParameter();
    // await this.lotparamsService.createLotParameter(requestBody);
    this.lotparamsService.createLotParameter(requestBody).subscribe({
      next: resp => {
        // console.log("resp: ", resp);

        // this.loadingTurn = false;
        this.msgModal(
          'Guardado con exito '.concat(`<strong>${requestBody.idLot}</strong>`),
          'Parametro Guardado',
          'success'
        );
        confirm.resolve(newData);
        this.adding = false;
        this.totalItems += 1;
      },
      error: err => {
        console.log('Hubo un error: ', err);
        this.msgModal(
          'Error: '.concat(`<strong>${err.error.message}</strong>`),
          'Error al guardar',
          'error'
        );
      },
    });
  }

  editEntry(event: any) {
    let { newData, confirm } = event;
    if (!newData.event || newData.batch == '' || newData.warranty == '') {
      this.alertTable();
      return;
    }

    const requestBody = {
      idLot: event.newData.idLot,
      idEvent: event.newData.idEvent,
      publicLot: event.newData.publicLot,
      specialGuarantee: event.newData.specialGuarantee,
      nbOrigin: 'Actualizardo desde angualar',
    };
    // Llamar servicio para eliminar
    this.lotparamsService.update(event.newData.idLot, requestBody).subscribe({
      next: resp => {
        // this.loadingTurn = false;
        this.msgModal(
          'Actualizaci&oacute;n exitosa '.concat(
            `<strong>${requestBody.idLot}</strong>`
          ),
          'Par&aacute;metro guardado',
          'success'
        );
      },
    });
    confirm.resolve(newData);
  }

  deleteEntry(event: any) {
    let { confirm } = event;
    const idLot = event.data.idLot;

    this.alertQuestion(
      'question',
      'Eliminar',
      '¿Desea eliminar el registro?',
      'Aceptar'
    ).then(question => {
      if (question.isConfirmed) {
        // Llamar servicio para eliminar
        this.lotparamsService.remove(idLot).subscribe({
          next: resp => {
            this.msgModal(
              'Se elimino el parametro '.concat(`<strong>${idLot}</strong>`),
              'Eliminaci&oacute;n exitosa',
              'success'
            );
          },
        });

        confirm.resolve(event.newData);
        this.totalItems -= 1;
      }
    });
  }

  msgModal(message: string, title: string, typeMsg: any) {
    Swal.fire({
      title: title,
      html: message,
      icon: typeMsg,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      // if (result.isConfirmed) {
      //   // this.requestForm.reset();
      //   // this.requestForm.controls['applicationDate'].patchValue(this.bsValue);
      //   // this.getRegionalDeleg(new ListParams());
      //   // this.userName = '';
      //   // this.loadingTurn = false;
      // }
    });
  }
}
