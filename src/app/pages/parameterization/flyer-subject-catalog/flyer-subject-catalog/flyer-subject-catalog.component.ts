import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AFFAIR_COLUMNS } from './affair-column';
import { AFFAIR_TYPE_COLUMNS } from './affair-type-column';
//models
import { IAffairType } from 'src/app/core/models/catalogs/affair-type-model';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
//service
import { AffairTypeService } from 'src/app/core/services/affair/affair-type.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import Swal from 'sweetalert2';
import { AffairModalComponent } from '../affair-modal/affair-modal.component';
import { FlyerSubjectCatalogModelComponent } from '../flyer-subject-catalog-model/flyer-subject-catalog-model.component';

@Component({
  selector: 'app-flyer-subject-catalog',
  templateUrl: './flyer-subject-catalog.component.html',
  styles: [],
})
export class FlyerSubjectCatalogComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  columns: IAffair[] = [];
  columnFilters: any = [];

  affairList: IAffair[] = [];
  affairTypeList: IAffairType[] = [];
  affairs: IAffair;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  selectedRow: any = null;

  loading1 = this.loading;
  loading2 = this.loading;

  id: any;

  settings2;

  constructor(
    private affairTypeService: AffairTypeService,
    private affairService: AffairService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private r2: Renderer2
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...AFFAIR_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: true,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...AFFAIR_TYPE_COLUMNS },
    };
  }

  //inicia cargando los filtros en columnas
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
            /*SPECIFIC CASES*/
            filter.field == 'city'
              ? (field = `filter.${filter.field}.nameCity`)
              : (field = `filter.${filter.field}`);
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
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
        this.loading1 = false;
      },
      error: error => {
        this.loading1 = false;
        console.log(error);
      },
    });
  }

  //Método para observar la fila que se selecciona de la tabla de asuntos
  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.affairTypeList = [];
    this.affairs = event.data;
    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getAffairType(this.affairs);
      const btn = document.getElementById('btn-new');
      this.r2.removeClass(btn, 'disabled');
      this.id = this.affairs;
      console.log(this.id);
    });
  }

  //Trae los tipos de asuntos por el id del asunto previamente seleccionado
  getAffairType(affair: IAffair) {
    this.loading2 = true;
    this.affairTypeService
      .getAffairTypeById(affair.id, this.params2.getValue())
      .subscribe({
        next: response => {
          this.affairTypeList = response.data;
          this.totalItems2 = response.count;
          this.loading2 = false;
        },
        error: error => (this.showNullRegister(), (this.loading2 = false)),
      });
  }

  //Formulario para actualizar tipo de asunto
  openForm(affairType?: IAffairType) {
    const idF = { ...this.affairs };
    let affair = this.affairs;
    let config: ModalOptions = {
      initialState: {
        affairType,
        affair,
        idF,
        callback: (next: boolean) => {
          if (next) this.getAffairType(affair);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(FlyerSubjectCatalogModelComponent, config);
  }

  //Formulario para actualizar asunto
  openForm2(affair?: IAffair) {
    let config: ModalOptions = {
      initialState: {
        affair,
        callback: (next: boolean) => {
          if (next) this.getAffairAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AffairModalComponent, config);
  }

  //msj de alerta para eliminar un asunto
  showDeleteAlert(affair?: IAffair) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(affair.id);
      }
    });
  }

  //método para borrar registro de asunto
  delete(id: number) {
    this.affairService.remove2(id).subscribe({
      next: () => (Swal.fire('Borrado', '', 'success'), this.getAffairAll()),
      error: err => {
        this.alertQuestion(
          'error',
          'No se puede eliminar Asunto',
          'Primero elimine sus tipos de asuntos'
        );
      },
    });
  }

  //msj de alerta para eliminar un tipo de asunto
  showDeleteAlert2(affairType?: IAffairType) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete2(affairType);
      }
    });
  }

  //método para borrar registro de tipo de asunto
  delete2(affairType?: IAffairType) {
    let affair = this.affairs;
    this.affairTypeService.remove(affairType).subscribe({
      next: () => (
        Swal.fire('Borrado', '', 'success'), this.getAffairType(affair)
      ),
    });
  }

  //Msj de que no existe volante de asunto
  showNullRegister() {
    this.alertQuestion(
      'warning',
      'Asunto sin volantes',
      '¿Desea agregarlos ahora?'
    ).then(question => {
      if (question.isConfirmed) {
        this.openForm();
      }
    });
  }

  //Muestra información de la fila seleccionada de asuntos
  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }
}
