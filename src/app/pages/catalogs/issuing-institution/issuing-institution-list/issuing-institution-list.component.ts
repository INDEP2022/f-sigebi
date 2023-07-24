import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IInstitutionClassification } from 'src/app/core/models/catalogs/institution-classification.model';
import { InstitutionClasificationService } from 'src/app/core/services/catalogs/institution-classification.service';
import { IIssuingInstitution } from '../../../../core/models/catalogs/issuing-institution.model';
import { InstitutionClasificationModalComponent } from '../institution-clasification-modal/institution-clasification-modal.component';
import { IssuingInstitutionFormComponent } from '../issuing-institution-form/issuing-institution-form.component';
import { IssuingInstitutionService } from './../../../../core/services/catalogs/issuing-institution.service';
import {
  INSTITUTION_COLUMNS,
  ISSUING_INSTITUTION_COLUMNS,
} from './issuing-institution-columns';

@Component({
  selector: 'app-issuing-institution-list',
  templateUrl: './issuing-institution-list.component.html',
  styles: [],
})
export class IssuingInstitutionListComponent
  extends BasePage
  implements OnInit
{
  institutionClassificationList: IInstitutionClassification[] = [];
  issuingInstitutionList: IIssuingInstitution[] = [];
  issuingInstitution: IIssuingInstitution;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  institutes: IInstitutionClassification;

  loading1 = this.loading;
  loading2 = this.loading;

  rowSelected: boolean = false;
  selectedRow: any = null;

  settings2;

  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  data1: LocalDataSource = new LocalDataSource();
  columnFilters1: any = [];
  constructor(
    private issuingInstitutionService: IssuingInstitutionService,
    private modalService: BsModalService,
    private institutionClasificationService: InstitutionClasificationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...INSTITUTION_COLUMNS },
    };
    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...ISSUING_INSTITUTION_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getInstitutionClassification();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInstitutionClassification());
  }

  getInstitutionClassification() {
    this.loading1 = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log(this.params.getValue().page);

    this.institutionClasificationService.getAll2(params).subscribe({
      next: response => {
        this.institutionClassificationList = response.data;
        this.data.load(this.institutionClassificationList);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading1 = false;
      },
      error: error => (this.loading1 = false),
    });
  }

  //Modal para actualizar las instituciones
  openForm2(institute?: IInstitutionClassification) {
    let config: ModalOptions = {
      initialState: {
        institute,
        callback: (next: boolean) => {
          if (next) this.getInstitutionClassification();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(InstitutionClasificationModalComponent, config);
  }

  //msj de alerta para borrar Clasificaciones instituciones
  showDeleteAlert2(institute?: IInstitutionClassification) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete2(institute.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  //Método para borrar Clasificaciones instituciones
  delete2(id: number) {
    this.institutionClasificationService.remove2(id).subscribe({
      next: () => {
        this.totalItems2 = 0;
        this.getInstitutionClassification();
        this.alert(
          'success',
          'Clasificación Institución',
          'Borrado Correctamente'
        );
      },
    });
  }

  //Selecciona fila de tabla de transferente para ver los estados
  rowsSelected(event: any) {
    const idInstitute = { ...this.institutes };
    this.totalItems2 = 0;
    this.issuingInstitutionList = [];
    this.institutes = event.data;
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'numClasif':
                searchFilter = SearchFilter.EQ;
                break;
              case 'zipCode':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              console.log(
                (this.columnFilters1[
                  field
                ] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.getIssuingInstitution();
        }
      });
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getIssuingInstitution(idInstitute.id));
  }

  getIssuingInstitution(id?: number) {
    this.loading2 = true;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters1,
    };
    const idInstitute = { ...this.institutes };
    this.issuingInstitutionService
      .getInstitutionByClasif(idInstitute.id, params)
      .subscribe({
        next: response => {
          console.log(response);
          this.issuingInstitutionList = response.data;
          this.data1.load(response.data);
          this.data1.refresh();
          this.totalItems2 = response.count;
          this.loading2 = false;
        },
        error: error => {
          //(this.showNullRegister1(), (this.loading2 = false)),
          this.loading2 = false;
          this.data1.load([]);
          this.data1.refresh();
          //this.showNullRegister1();
        },
      });
  }

  //Msj de que no existe autoridades emisoras para la institución seleccionado
  showNullRegister1() {
    this.alertQuestion(
      'warning',
      'Institución sin Autoridades Emisoras',
      '¿Desea agregarlas ahora?'
    ).then(question => {
      if (question.isConfirmed) {
        this.openForm();
      }
    });
  }

  //Modal para actualizar las instituciones
  openForm(issuingInstitution?: IIssuingInstitution) {
    const idInstitute = { ...this.institutes };
    let config: ModalOptions = {
      initialState: {
        issuingInstitution,
        idInstitute,
        callback: (next: boolean) => {
          console.log(next);
          if (next) {
            this.params2
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getIssuingInstitution(idInstitute.id));
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(IssuingInstitutionFormComponent, config);
  }

  //Muestra información de la fila seleccionada de clasificacion instutuciones
  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  //msj de alerta para borrar autoridades emisoras
  showDeleteAlert(issuingInstitution?: IIssuingInstitution) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(issuingInstitution.id);
      }
    });
  }

  //Método para borrar autoridades emisoras
  delete(id: number) {
    const idInstitute = { ...this.institutes };
    this.issuingInstitutionService.remove2(id).subscribe({
      next: () => {
        this.alert('success', 'Autoridad Emisora', 'Borrado Correctamente');
        this.getIssuingInstitution(idInstitute.id);
        this.loading2 = true;
      },
      error: error => {
        this.alert(
          'warning',
          'Autoridad Emisora',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }

  resetScreen() {
    this.rowSelected = false;
  }
}
