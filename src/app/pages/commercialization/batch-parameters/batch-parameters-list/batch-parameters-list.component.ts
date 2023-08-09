import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { LotParamsService } from 'src/app/core/services/ms-lot-parameters/lot-parameters.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { BATCH_PARAMETERS_COLUMNS } from './batch-parameters-columns';

@Component({
  selector: 'app-batch-parameters-list',
  templateUrl: './batch-parameters-list.component.html',
  styles: [],
})
export class BatchParametersListComponent extends BasePage implements OnInit {
  //

  lotServiceArray: any[] = [];
  lotServiceArrayTwo: any[] = [];
  adding: boolean = false;
  totalItems: number = 0;
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  lotData: LocalDataSource = new LocalDataSource();
  filterRow: any;
  addOption: any;
  addRowElement: any;
  form: FormGroup;
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
  columnFilters: any = [];

  //

  constructor(
    private lotparamsService: LotParamsService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private serviceLot: LotService
  ) {
    super();
    this.paramSettings.columns = BATCH_PARAMETERS_COLUMNS;
    this.paramSettings.actions.delete = true;

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: { ...BATCH_PARAMETERS_COLUMNS },
    };
  }

  ngOnInit(): void {
    // this.hideFilters();
    this.lotData
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              idLot: () => (searchFilter = SearchFilter.EQ),
              idEvent: () => (searchFilter = SearchFilter.EQ),
              publicLot: () => (searchFilter = SearchFilter.EQ),
              specialGuarantee: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getLotParams();
        }
      });

    this.paramsList
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLotParams());
    this.prepareForm();
  }

  //

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: [null, Validators.required],
      lotePublico: [null, Validators.required],
      garantia: [null, Validators.required],
    });
  }

  addNew() {}

  getLotByFilters() {
    let params: HttpParams = new HttpParams();

    params = params.append(
      'filter.idEvent',
      this.form.controls['idEvent'].value
    );
    params = params.append(
      'filter.lotPublic',
      this.form.controls['lotePublico'].value
    );
    params = params.append(
      'filter.priceGuarantee',
      this.form.controls['garantia'].value
    );

    this.serviceLot.getAllComerLotsByFilter(params).subscribe({
      next: response => {
        console.log('Si hay una respuesta y es esta: ', response.data);
        this.lotServiceArray = response.data;
      },
      error: error => {
        console.log('Hay respuesta pero esta mal.');
      },
    });
  }

  getLotParams() {
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.lotparamsService.getAll_(params).subscribe({
      next: response => {
        this.loading = false;
        this.lotData.load(response.data);
        this.lotData.refresh();
        this.totalItems = response.count;
        this.lotServiceArrayTwo = response.data;
      },
      error: error => {
        this.totalItems = 0;
        this.lotData.load([]);
        this.loading = false;
      },
    });
  }

  preValidatedSaveAll() {
    this.lotServiceArray;
    this.lotData;
    for (const i of this.lotServiceArray) {
      for (const x of this.lotServiceArrayTwo) {
        if (i.idLot == x.idLot) {
        }
      }
    }
  }

  // hideFilters() {
  //   setTimeout(() => {
  //     let filterArray = document.getElementsByClassName('ng2-smart-filters');
  //     this.filterRow = filterArray.item(0);
  //     this.filterRow.classList.add('d-none');
  //     this.addOption = document
  //       .getElementsByClassName('ng2-smart-action-add-add')
  //       .item(0);
  //   }, 200);
  // }

  // addRow() {
  //   this.adding = true;
  //   this.addOption.click();
  //   setTimeout(() => {
  //     this.addRowElement = document
  //       .querySelectorAll('tr[ng2-st-thead-form-row]')
  //       .item(0);
  //     this.addRowElement.classList.add('row-no-pad');
  //     this.addRowElement.classList.add('add-row-height');
  //     this.cancelBtn = document.querySelectorAll('.cancel').item(0);
  //     this.cancelEvent = this.handleCancel.bind(this);
  //     this.cancelBtn.addEventListener('click', this.cancelEvent);
  //   }, 300);
  // }

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

  // async addEntry(event: any) {
  //   let { newData, confirm } = event;

  //   if (
  //     !newData.idEvent ||
  //     newData.idLot == '' ||
  //     newData.specialGuarantee == ''
  //   ) {
  //     this.alertTable();
  //     return;
  //   }
  //   const requestBody = {
  //     idLot: '',
  //     idEvent: event.newData.idEvent,
  //     publicLot: event.newData.publicLot,
  //     specialGuarantee: event.newData.specialGuarantee,
  //     nbOrigin: '',
  //   };

  //   // Llamar servicio para agregar registro
  //   this.lotparamsService.createLotParameter(requestBody).subscribe({
  //     next: resp => {
  //       this.msgModal(
  //         'Guardado con exito '.concat(`<strong>${requestBody.idLot}</strong>`),
  //         'Parametro Guardado',
  //         'success'
  //       );
  //       confirm.resolve(newData);
  //       this.adding = false;
  //       this.totalItems += 1;
  //     },
  //     error: err => {
  //       console.log('Hubo un error: ', err);
  //       this.msgModal(
  //         'Error: '.concat(`<strong>${err.error.message}</strong>`),
  //         'Error al guardar',
  //         'error'
  //       );
  //     },
  //   });
  // }

  // editEntry(event: any) {
  //   let { newData, confirm } = event;
  //   if (
  //     !newData.idEvent ||
  //     newData.idLot == '' ||
  //     newData.specialGuarantee == ''
  //   ) {
  //     this.alertTable();
  //     return;
  //   }

  //   const requestBody = {
  //     idLot: event.newData.idLot,
  //     idEvent: event.newData.idEvent,
  //     publicLot: event.newData.publicLot,
  //     specialGuarantee: event.newData.specialGuarantee,
  //     nbOrigin: '',
  //   };
  //   // Llamar servicio para eliminar
  //   this.lotparamsService.update(event.newData.idLot, requestBody).subscribe({
  //     next: resp => {
  //       this.msgModal(
  //         'Actualizaci&oacute;n exitosa '.concat(
  //           `<strong>${requestBody.idLot}</strong>`
  //         ),
  //         'Par&aacute;metro guardado',
  //         'success'
  //       );
  //     },
  //   });
  //   confirm.resolve(newData);
  // }

  // deleteEntry(event: any) {
  //   let { confirm } = event;
  //   const idLot = event.data.idLot;

  //   this.alertQuestion('question', '¿Desea Eliminar el Registro?', '').then(
  //     question => {
  //       if (question.isConfirmed) {
  //         // Llamar servicio para eliminar
  //         this.lotparamsService.remove(idLot).subscribe({
  //           next: resp => {
  //             this.alert('error', 'Registro Eliminado Correctamente', '');
  //           },
  //           error: err => {
  //             this.alert('error', 'Error al Eliminar el Registro', '');
  //           },
  //         });
  //       }
  //     }
  //   );
  // }

  // msgModal(message: string, title: string, typeMsg: any) {
  //   Swal.fire({
  //     title: title,
  //     html: message,
  //     icon: typeMsg,
  //     showCancelButton: false,
  //     confirmButtonColor: '#9D2449',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Aceptar',
  //   }).then(result => { });
  // }

  // edit(event: any) {
  //   this.openForm(event.data, true);
  // }
  // add() {
  //   this.openForm(null, false);
  // }

  // openForm(data: any, editVal: boolean) {
  //   let config: ModalOptions = {
  //     initialState: {
  //       data,
  //       edit: editVal,
  //       callback: (next: boolean) => {
  //         if (next) {
  //           this.getLotParams();
  //         }
  //       },
  //     },
  //     class: 'modal-lg modal-dialog-centered',
  //     ignoreBackdropClick: true,
  //   };
  //   this.modalService.show(NewAndUpdateComponent, config);
  // }
}
