import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { firstValueFrom, takeUntil } from 'rxjs';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
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
  disabled = false;
  constructor(
    private modalService: BsModalService,
    private conceptsService: ConceptsService,
    private expenseConceptsService: ExpenseConceptsService,
    private parameterService: ParametersConceptsService,
    private securityService: SecurityService
  ) {
    super();
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
        address: this.address,
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

  override fillColumnFilters(
    haveFilter: boolean,
    field: string,
    filter: any,
    searchFilter: SearchFilter
  ) {
    if (filter.search !== '') {
      if (
        filter.search === 'N' &&
        ['automatic', 'numerary'].includes(filter.field)
      ) {
        this.columnFilters[field] = `${searchFilter}:S`;
      } else {
        this.columnFilters[field] = `${searchFilter}:${filter.search}`;
      }

      haveFilter = true;
    } else {
      delete this.columnFilters[field];
    }
    if (haveFilter) {
      this.params.value.page = 1;
    }
  }

  override getSearchFilter(filter: any) {
    let searchFilter = SearchFilter.ILIKE;
    if (this.ilikeFilters.includes(filter.field)) {
      searchFilter = SearchFilter.ILIKE;
    } else {
      if (
        filter.search === 'N' &&
        ['automatic', 'numerary'].includes(filter.field)
      ) {
        searchFilter = SearchFilter.NEQ;
      } else {
        searchFilter = SearchFilter.EQ;
      }
    }
    return searchFilter;
  }

  async showCopyModal() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      conceptId: this.conceptId,
      address: this.address,
      callback: (body: { id: string; address: string }) => {
        if (body) {
          let listParams = new ListParams();
          listParams.limit = 10000;
          this.conceptsService
            .copyParameters(
              {
                ...body,
                concept: this.conceptId,
                address: this.address,
              },
              listParams
            )
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
                  this.alert('success', 'Se han copiado los parámetros', '');
                  // this.filesToDelete = [];
                  setTimeout(() => {
                    this.selectedConcept = body;
                  }, 500);

                  // this.expenseConceptsService.refreshParams.next(true);
                  // forkJoin(obs).subscribe({
                  //   complete: () => {
                  //     // this.files = [];

                  //     // this.getData();
                  //   },
                  // });
                } else {
                  this.alert(
                    'error',
                    'No se pudieron copiar los parámetros',
                    'Favor de revisar'
                  );
                }
              },
              error: err => {
                console.log(err);
                this.alert(
                  'error',
                  'No se pudieron copiar los parámetros',
                  'Favor de revisar'
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
    // this.expenseConceptsService.refreshParams.next(true);
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
        '¿Desea eliminar el concepto de pago?',
        ''
      );
      if (response.isConfirmed) {
        this.conceptsService
          .remove(event.data)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe({
            next: response => {
              // event.confirm.resolve();
              this.alert(
                'success',
                'Se ha eliminado el concepto de pago ' + event.data.id,
                ''
              );
              this.getData();
            },
            error: err => {
              console.log(err);
              // event.confirm.resolve();
              let errorM = err.error.message;
              this.alert(
                'error',
                'No se pudo eliminar el concepto de pago ' + event.data.id,
                errorM
                  ? errorM.includes('violates foreign key')
                    ? 'Debe eliminar sus parámetros para poder continuar'
                    : errorM
                  : 'Favor de verificar'
              );
            },
          });
      }
    }
  }
}
