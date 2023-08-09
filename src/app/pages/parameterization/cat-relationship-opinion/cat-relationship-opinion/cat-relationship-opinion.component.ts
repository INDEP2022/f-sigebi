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
import { DomSanitizer } from '@angular/platform-browser';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { AffairTypeService } from 'src/app/core/services/affair/affair-type.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { RAsuntDicService } from 'src/app/core/services/catalogs/r-asunt-dic.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';

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
  columnFilters2: any = [];
  columnFilters3: any = [];

  rAsuntDicList: IRAsuntDic[] = [];
  affairTypes: IAffairType;

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;

  params3 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems3: number = 0;

  settings2;
  settings3 = { ...this.settings };

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
    private RAsuntDicService: RAsuntDicService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer
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

    this.settings3.columns = DICTA_COLUMNS;
    this.settings3.actions.delete = true;
    this.settings3.actions.edit = true;
    this.settings3.actions.add = false;
    this.settings3.hideSubHeader = false;

    /*this.settings3 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...DICTA_COLUMNS },
    };*/
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
              case 'id':
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
          this.params = this.pageFilter(this.params);
          this.getAffairAll();
        }
      });
    this.data2
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
              case 'code':
                searchFilter = SearchFilter.EQ;
                break;
              case 'dictumData':
                field = `filter.${filter.field}.description`;
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.params3 = this.pageFilter(this.params3);
          this.getRAsuntDic();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAffairAll());
    this.params3
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRAsuntDic());
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
      .subscribe(() => this.getAffairTypes());
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
    this.params3.getValue()['filter.code'] = `$eq:${idAffair.id}`;
    let params = {
      ...this.params3.getValue(),
      ...this.columnFilters2,
    };
    this.RAsuntDicService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        this.data2.load(response.data);
        this.data2.refresh();
        //this.rAsuntDicList = response.data;
        this.totalItems3 = response.count;
        this.loading3 = false;
      },
      error: error => {
        this.loading3 = false;
        this.data2.load([]);
        this.data2.refresh();
        this.totalItems3 = 0;
      },
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
        callback: (next: boolean) => {
          if (next) {
            this.getAffairTypes();
            this.getRAsuntDic();
          }
        },
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
      }
    });
  }

  delete(rAsuntDic?: IRAsuntDic) {
    this.RAsuntDicService.remove2(rAsuntDic).subscribe({
      next: () => {
        this.getRAsuntDic();
        this.alert('success', 'Dictamen', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Relación de asunto dictamen',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }

  //Abre cat de Dictamen

  openDictum() {
    const goBack = false;
    let config: ModalOptions = {
      initialState: {
        goBack,
        callback: (next: boolean) => {
          //if (next) this.getRAsuntDic();
          //this.rowsSelected(this.affairs);
          if (next) {
            this.getAffairTypes();
            this.getRAsuntDic();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(OpinionsListComponent, config);

    /*const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      initialState,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.modalService.show(OpinionsListComponent, modalConfig);*/
  }

  report() {
    let params = {
      //PN_DEVOLUCION: this.data, FCATADBRELASDIC
    };
    this.siabService.fetchReport('blank', params).subscribe(response => {
      if (response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      } else {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      }
    });
  }
}
