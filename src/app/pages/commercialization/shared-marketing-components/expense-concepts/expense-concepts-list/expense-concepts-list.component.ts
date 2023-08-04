import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { firstValueFrom, takeUntil } from 'rxjs';

import { FormControl } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IConcept } from 'src/app/core/models/ms-comer-concepts/concepts';
import { ConceptsService } from 'src/app/core/services/ms-commer-concepts/concepts.service';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { secondFormatDate } from 'src/app/shared/utils/date';
import { ExpenseConceptsService } from '../services/expense-concepts.service';
import { COLUMNS } from './columns';
import { CopyParametersConceptsModalComponent } from './copy-parameters-modal/copy-parameters-modal.component';
import { ExpenseConceptsListModalComponent } from './expense-concepts-list-modal/expense-concepts-list-modal.component';

@Component({
  selector: 'app-expense-concepts-list',
  templateUrl: './expense-concepts-list.component.html',
  styleUrls: ['./expense-concepts-list.component.scss'],
})
export class ExpenseConceptsListComponent
  extends BasePageWidhtDinamicFiltersExtra<IConcept>
  implements OnInit
{
  @Input() address: string;
  toggleInformation = true;
  pageSizeOptions = [5, 10, 20, 25];
  limit: FormControl = new FormControl(5);
  disabled = false;
  constructor(
    private modalService: BsModalService,
    private conceptsService: ConceptsService,
    private expenseConceptsService: ExpenseConceptsService,
    private parameterService: ParametersConceptsService,
    private securityService: SecurityService
  ) {
    super();
    this.params.value.limit = 5;
    this.service = this.conceptsService;
    this.ilikeFilters = ['description'];
    // if (localStorage.getItem('username') !== 'sigebiadmon') {
    //   this.securityService
    //     .getScreenUser(
    //       'FCOMER083',
    //       localStorage.getItem('username').toUpperCase()
    //     )
    //     .pipe(takeUntil(this.$unSubscribe))
    //     .subscribe({
    //       next: response => {
    //         if (response && response.length > 0) {
    //           // if()
    //         }
    //       },
    //     });
    // } else {
    //   this.disabled = false;
    // }

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: true,
        delete: true,
      },
      // add: {
      //   addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
      //   createButtonContent:
      //     '<i class="bx bxs-save me-1 text-success mx-2"></i>',
      //   cancelButtonContent:
      //     '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
      //   confirmCreate: true,
      // },
      // edit: {
      //   ...this.settings.edit,
      //   saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
      //   cancelButtonContent:
      //     '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
      //   confirmSave: true,
      // },
      // delete: {
      //   ...this.settings.delete,
      //   confirmDelete: true,
      // },
      columns: { ...COLUMNS },
    };

    // this.settings2.columns = COLUMNS2;
  }

  get conceptId() {
    return this.selectedConcept ? this.selectedConcept.id : '';
  }

  get selectedConcept() {
    return this.expenseConceptsService.concept;
  }

  set selectedConcept(value) {
    this.expenseConceptsService.concept = value;
  }

  add() {
    this.openModal();
  }

  edit(row: IConcept) {
    this.openModal(row);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['address'] && changes['address'].currentValue) {
      const list = [{ value: 'C', title: 'GENERAL' }];
      if (changes['address'].currentValue === 'M') {
        list.push({ value: 'M', title: 'MUEBLES' });
      }
      if (changes['address'].currentValue === 'I') {
        list.push({ value: 'I', title: 'INMUEBLES' });
      }
      this.settings = {
        ...this.settings,
        columns: {
          ...COLUMNS,
          address: {
            ...COLUMNS.address,
            filter: {
              type: 'list',
              config: {
                selectText: 'Seleccionar',
                list,
              },
            },
          },
        },
      };
    }
  }

  openModal(concept: IConcept = null) {
    let newConcept;
    if (concept) {
      newConcept = {
        ...concept,
        numerary: concept.numerary ? concept.numerary === 'S' : false,
        automatic: concept.automatic ? concept.automatic === 'S' : false,
      };
    }

    let config: ModalOptions = {
      initialState: {
        concept: newConcept,
        callback: (next: boolean) => {
          if (next) {
            this.getData();
          }
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ExpenseConceptsListModalComponent, config);
  }

  async showCopyModal() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      conceptId: this.conceptId,
      callback: (body: { id: string }) => {
        if (body) {
          this.conceptsService
            .copyParameters({
              ...body,
              concept: this.conceptId,
              address: this.getAddressCode(this.selectedConcept.address),
            })
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe({
              next: response => {
                console.log(response);
                if (response && response.data && response.data.length > 0) {
                  const array = response.data;
                  array.forEach(async row => {
                    setTimeout(() => {
                      console.log('creando');
                    }, 500);
                    await firstValueFrom(
                      this.parameterService
                        .create({
                          conceptId: body.id,
                          parameter: row.parametro,
                          value: row.valor,
                          address: row.direccion,
                          creationDate: secondFormatDate(new Date()),
                          creationUser: localStorage
                            .getItem('username')
                            .toUpperCase(),
                        })
                        .pipe(takeUntil(this.$unSubscribe))
                    );
                  });
                  this.alert(
                    'success',
                    'Copiado de Parametros',
                    'Realizado Correctamente'
                  );
                  // this.filesToDelete = [];
                  this.selectedConcept = body;
                  this.expenseConceptsService.refreshParams.next(true);
                  // forkJoin(obs).subscribe({
                  //   complete: () => {
                  //     // this.files = [];

                  //     // this.getData();
                  //   },
                  // });
                } else {
                  this.alert(
                    'error',
                    'ERROR',
                    'No se pudieron copiar los parámetros'
                  );
                }
              },
              error: err => {
                this.alert(
                  'error',
                  'ERROR',
                  'No se pudieron copiar los parámetros'
                );
              },
            });
        }
      },
    };
    this.modalService.show(CopyParametersConceptsModalComponent, modalConfig);
  }

  getAddressCode(address: string) {
    return this.expenseConceptsService.getAddressCode(address);
  }

  selectConcept(row: IConcept) {
    if (!row) return;
    if (this.selectedConcept && row.id === this.selectedConcept.id) {
      return;
    }

    this.selectedConcept = row;
    this.expenseConceptsService.refreshParams.next(true);
  }

  override getParams() {
    // debugger;
    let newColumnFilters = this.columnFilters;

    if (newColumnFilters['filter.address']) {
      return {
        ...this.params.getValue(),
        ...newColumnFilters,
      };
    } else {
      if (this.address) {
        newColumnFilters['filter.address'] = '$in:' + this.address + ',C';
      } else {
        newColumnFilters['filter.address'] = '$in:C';
      }
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  get haveParams() {
    return this.expenseConceptsService.haveParams ?? false;
  }

  async onDeleteConfirm(event: any) {
    console.log(event);
    if (event.data) {
      const response = await this.alertQuestion(
        'warning',
        'Eliminar',
        '¿Desea Eliminar este Registro?'
      );
      if (response.isConfirmed) {
        this.conceptsService
          .remove(event.data)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe({
            next: response => {
              event.confirm.resolve();
              this.alert(
                'success',
                'Eliminación de Concepto de Pago ' + event.data.id,
                'Eliminado Correctamente'
              );
              this.getData();
            },
            error: err => {
              // event.confirm.resolve();
              this.alert(
                'error',
                'ERROR',
                'No se pudo eliminar el concepto de pago ' + event.data.id
              );
            },
          });
      }
    }
  }
}
