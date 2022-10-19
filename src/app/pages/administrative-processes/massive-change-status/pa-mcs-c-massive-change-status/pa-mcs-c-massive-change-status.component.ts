import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CsvToArrayService } from 'src/app/common/services/csv-to-array.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

interface ExampleData {
  number: number;
  name: string;
  description: string;
  status: string;
}
@Component({
  selector: 'app-pa-mcs-c-massive-change-status',
  templateUrl: './pa-mcs-c-massive-change-status.component.html',
  styles: [],
})
export class PaMcsCMassiveChangeStatusComponent
  extends BasePage
  implements OnInit
{
  fileName: string = 'Seleccionar archivo';

  data: ExampleData[];

  form: FormGroup;

  get status() {
    return this.form.get('status');
  }
  get observation() {
    return this.form.get('observation');
  }

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private services_csv_to_array: CsvToArrayService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.buildForm();
    this.loandData();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      status: [null, [Validators.required]],
      observation: [null, [Validators.required]],
      csv: [null, [Validators.required]],
    });
  }

  async getFile() {
    this.loading = true;
    const csvFile = document.getElementById('csvFile') as HTMLInputElement;
    if (csvFile.files[0]) this.fileName = csvFile.files[0].name;
    this.services_csv_to_array
      .csvToArray(csvFile, ',')
      .then(data => {
        this.data = data;
        this.totalItems = data.length;
        this.loading = false;
      })
      .catch();
  }

  loandData() {
    this.data = [
      {
        number: 1,
        name: 'Nombre del status 1',
        description: 'Esta es la descripcion del estatus 1',
        status: 'Estatus 1',
      },
      {
        number: 2,
        name: 'Nombre del status 2',
        description: 'Esta es la descripcion del estatus 2',
        status: 'Estatus 2',
      },
      {
        number: 3,
        name: 'Nombre del status 3',
        description: 'Esta es la descripcion del estatus 3',
        status: 'Estatus 3',
      },
    ];
  }

  loadDescription() {
    console.log(this.status.value);
  }
}
