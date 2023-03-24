import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { OpinionsListComponent } from 'src/app/pages/catalogs/opinions/opinions-list/opinions-list.component';
import { CatRelationshipOpinionModalComponent } from '../cat-relationship-opinion-modal/cat-relationship-opinion-modal.component';
import {
  AFFAIR_COLUMNS,
  AFFAIR_TYPE_COLUMNS,
  DICTA_COLUMNS,
} from './relationship-opinion-columns';
//models
import { IAffairType } from 'src/app/core/models/catalogs/affair-type-model';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
import { IRAsuntDic } from 'src/app/core/models/catalogs/r-asunt-dic.model';
//Services
import { AffairTypeService } from 'src/app/core/services/affair/affair-type.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { RAsuntDicService } from 'src/app/core/services/catalogs/r-asunt-dic.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cat-relationship-opinion',
  templateUrl: './cat-relationship-opinion.component.html',
  styles: [],
})
export class CatRelationshipOpinionComponent
  extends BasePage
  implements OnInit
{
  data: LocalDataSource = new LocalDataSource();
  columns: IAffair[] = [];
  columnFilters: any = [];

  affairs: IAffair;
  affairTypeList: IAffairType[] = [];

  data2: LocalDataSource = new LocalDataSource();

  rAsuntDicList: IRAsuntDic[] = [];
  affairTypes: IAffairType;

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;

  params3 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems3: number = 0;

  settings2;
  settings3;

  loading1 = this.loading;
  loading2 = this.loading;
  loading3 = this.loading;

  rowSelected: boolean = false;
  selectedRow: any = null;

  constructor(
    private fb: FormBuilder,
    private affairService: AffairService,
    private affairTypeService: AffairTypeService,
    private modalService: BsModalService,
    private RAsuntDicService: RAsuntDicService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...AFFAIR_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: true,
      actions: false,
      columns: { ...AFFAIR_TYPE_COLUMNS },
    };
    this.settings3 = {
      ...this.settings,
      hideSubHeader: true,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...DICTA_COLUMNS },
    };
  }

  //Caga las columnas de búsqueda de asuntos
  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'idCity':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'processDetonate':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getAffairAll();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAffairAll());
  }

  //Trae todos los asuntos
  getAffairAll() {
    this.loading1 = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.affairService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;
        this.data.load(this.columns);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading1 = false;
      },
    });
  }

  //Selecciona fila de tabla de asuntos
  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.affairTypeList = [];
    this.affairs = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAffairTypes()),
      this.getRAsuntDic();
  }

  //Muestra información de la fila seleccionada de asuntos
  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  //Trae los tipos de asuntos por el Id del asunto seleccionado
  getAffairTypes(): void {
    this.loading2 = true;
    const idAffair = { ...this.affairs };
    this.affairTypeService
      .getByAffair(idAffair.id, this.params2.getValue())
      .subscribe({
        next: response => {
          this.affairTypeList = response.data;
          this.totalItems2 = response.count;
          this.loading2 = false;
        },
        error: error => (this.loading2 = false),
      });
  }

  //Traer datos de r asunt tipo al seleccionar fila de la tabla tipo de asunto
  getRAsuntDic() {
    this.loading3 = true;
    const idAffair = { ...this.affairs };
    this.RAsuntDicService.getByCode(idAffair.id).subscribe({
      next: response => {
        console.log(response);
        this.rAsuntDicList = response.data;
        this.totalItems3 = response.count;
        this.loading3 = false;
      },
      error: error => (this.loading3 = false),
    });
  }

  //Abre modal para actualizar RasuntDic
  openForm(rAsuntDic?: IRAsuntDic) {
    console.log(rAsuntDic);
    const idAffair = { ...this.affairs };
    let affairType = this.affairTypes;
    let config: ModalOptions = {
      initialState: {
        idAffair,
        rAsuntDic,
        affairType,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CatRelationshipOpinionModalComponent, config);
  }

  //Elimina RasuntDic
  showDeleteAlert(rAsuntDic?: IRAsuntDic) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(rAsuntDic);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(rAsuntDic?: IRAsuntDic) {
    this.RAsuntDicService.remove2(rAsuntDic).subscribe({
      next: () => this.getRAsuntDic(),
    });
  }

  //Abre cat de Dictamen

  openDictum() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(OpinionsListComponent, config);
  }
}
