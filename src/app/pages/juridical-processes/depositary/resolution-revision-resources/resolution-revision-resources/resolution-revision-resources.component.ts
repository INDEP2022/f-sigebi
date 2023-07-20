/** BASE IMPORT */
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { RESOLUTION_REVISION_COLUMNS } from './resolution-revision-columns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-resolution-revision-resources',
  templateUrl: './resolution-revision-resources.component.html',
  styleUrls: ['./resolution-revision-resources.component.scss'],
})
export class ResolutionRevisionResourcesComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  @Output() loadingData = new EventEmitter<boolean>();
  showResolucion: boolean = false;
  public form: FormGroup;
  data: any[] = [];
  selectedRow: any;
  formLoading = false;
  params = new BehaviorSubject(new ListParams());
  totalItems: number = 0;

  constructor(private fb?: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: RESOLUTION_REVISION_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.startApp();

    this.data.push({
      noBien: 'DATA',
      descripcion: 'DATA',
      cantidad: 'DATA',
      estatus: 'DATA',
      motivoRecRevision: 'DATA',
      fechaRecepcion: 'DATA',
      fechaEmResolucion: 'DATA',
      obRecursoRevision: 'DATA',
    });
    this.totalItems = Number(this.data.length);
  }

  startApp() {
    this.form = this.fb.group({
      resolucion: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], //*
    });
  }

  btnResolucion() {
    this.showResolucion = true;
  }

  btnCloseResolucion() {
    console.log(this.form.value);
    this.showResolucion = false;
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
    //console.log(this.selectedRow);
  }

  formData(doc: any) {
    console.log('object -> ', doc);
    this.selectedRow = doc;
  }
}
