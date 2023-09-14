import { Component, OnInit } from '@angular/core';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDocCompensationSatXml } from 'src/app/core/models/catalogs/doc-compensation-sat-xml.model';
import { DocCompensationSatXmlService } from 'src/app/core/services/catalogs/doc-compensation-sat-xml.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocCompensationSatXmlFormComponent } from '../doc-compensation-sat-xml-form/doc-compensation-sat-xml-form.component';
import { COMPENSATION_COLUMNS } from './doccompensationsatxml-columns';

@Component({
  selector: 'app-doc-compensation-sat-xml-list',
  templateUrl: './doc-compensation-sat-xml-list.component.html',
  styles: [],
})
export class DocCompensationSatXmlListComponent
  extends BasePage
  implements OnInit
{
  paragraphs: IDocCompensationSatXml[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private docConpensation: DocCompensationSatXmlService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = COMPENSATION_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
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
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'idOficioSat':
                searchFilter = SearchFilter.EQ;
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
          this.getExample();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.docConpensation.getAll(params).subscribe({
      next: response => {
        this.totalItems = response.count || 0;
        //console.log(response.data);
        //this.delegationsState = response.data;
        //console.log(this.delegationsState);
        this.data.load(response.data);
        this.data.refresh();
        //console.log(this.data);
        this.loading = false;

        /*this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;*/
      },
      error: error => (this.loading = false),
    });
  }

  openForm(compensationSatXml?: IDocCompensationSatXml) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      compensationSatXml,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.modalService.show(DocCompensationSatXmlFormComponent, modalConfig);
  }

  showDeleteAlert(compensationSatXml: IDocCompensationSatXml) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.delete(compensationSatXml.id);
      }
    });
  }

  delete(id: number) {
    this.docConpensation.remove(id).subscribe({
      next: response => {
        this.alert(
          'success',
          'Documento Resarcimiento SAT XML',
          'Borrado Correctamente'
        ),
          this.getExample();
      },
      error: err => {
        this.alert(
          'warning',
          'Documento Resarcimiento Xml',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
