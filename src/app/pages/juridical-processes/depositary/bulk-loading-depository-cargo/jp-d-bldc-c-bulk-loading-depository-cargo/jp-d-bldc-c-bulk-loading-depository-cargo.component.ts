import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
interface ExampleData {
  numberGood: string;
  datePayment: string;
  importe: number;
  paymentConcept: string;
  observation: string;
  legal: string;
  administrative: string;
}
@Component({
  selector: 'app-jp-d-bldc-c-bulk-loading-depository-cargo',
  templateUrl: './jp-d-bldc-c-bulk-loading-depository-cargo.component.html',
  styles: [],
})
export class JpDBldcCBulkLoadingDepositoryCargoComponent
  extends BasePage
  implements OnInit
{
  fileName: string = 'Seleccionar archivo';
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: ExampleData[];

  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private excelService: ExcelService) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.buildForm();
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
    /*     this.data = [
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
    ]; */
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
  loadDescription() {}
  loadData() {}
}
