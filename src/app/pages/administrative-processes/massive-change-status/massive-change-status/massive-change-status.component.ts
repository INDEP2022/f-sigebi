import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

interface ExampleData {
  number: number;
  name: string;
  description: string;
  status: string;
}
@Component({
  selector: 'app-massive-change-status',
  templateUrl: './massive-change-status.component.html',
  styles: [],
})
export class MassiveChangeStatusComponent extends BasePage implements OnInit {
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
    private excelService: ExcelService
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

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }
  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.data = this.excelService.getData(binaryExcel);
      console.log(this.data);
      this.onLoadToast('success', 'Archivo subido con Exito', 'Exitoso');
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }
  loadDescription() {
    console.log(this.status.value);
  }
}
