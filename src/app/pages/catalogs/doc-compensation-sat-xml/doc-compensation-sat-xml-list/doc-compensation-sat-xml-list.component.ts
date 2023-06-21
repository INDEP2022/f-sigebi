import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.docConpensation.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
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
        this.alert('success', 'Documento resarcimiento SAT XML', 'Borrado'),
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
