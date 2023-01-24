import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Provisional Data
import { dataInco } from './data';

@Component({
  selector: 'app-inconsistencies',
  templateUrl: './inconsistencies.component.html',
  styles: [],
})
export class InconsistenciesComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  //inconData = dataInco;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  selectedRow: any = null;

  edit: boolean = false;
  title: string =
    'Catálogo de Inconsistencias en la Validación del Cálculo del I.V.A';

  @Output() selected = new EventEmitter<{}>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.data.load(dataInco);
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      goodId: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  selectRow(row: any) {
    this.selectedRow = row;
  }

  confirm() {
    //let data = {};
    this.selected.emit(this.selectedRow);
    this.modalRef.hide();
  }
}
