/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-assignation-goods-protection',
  templateUrl: './assignation-goods-protection.component.html',
  styleUrls: ['./assignation-goods-protection.component.scss'],
})
export class AssignationGoodsProtectionComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: {
        title: 'No. Bien',
      }, //*
    },
  };
  // Data table
  dataTable = [
    {
      noBien: 'No. Bien',
      descripcion: 'Descripción',
    },
  ];

  tableSettings2 = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: {
        title: 'No. Bien',
      }, //*
    },
  };
  // Data table
  dataTable2 = [
    {
      noBien: 'No. Bien',
      descripcion: 'Descripción',
    },
  ];
  items = new DefaultSelect<Example>();

  public form: FormGroup;
  public formTipoSuspersion: FormGroup;
  public formAmparo: FormGroup;

  constructor(private fb: FormBuilder, private exampleService: ExampleService) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: ['', [Validators.required]], //*
      averiguacionPrevia: '',
      causaPenal: '',
    });
    this.formTipoSuspersion = this.fb.group({
      tipoSuspersion: '', // Provisional, Definitiva, De plano
      fechaInformePrevio: '',
      justificado: '',
      observaciones: '',
    });
    this.formAmparo = this.fb.group({
      amparo: ['', [Validators.required]],
      tipoAmparo: ['', [Validators.required]], //* Directo, Indirecto
      fechaOficio: '',
      minPub: '', // Detalle Min. Pub.
      noJuzgado: '', // Detalle No Juzgado
      responsable: '',
      delegacion: '', // 4 campos con el primero en id
      quejosos: '',
      actoReclamado: '',
    });
  }

  mostrarInfo(): any {
    console.log(this.form.value);
  }

  btnAgregar() {
    console.log('Agregar');
  }

  btnEliminar() {
    console.log('Eliminar');
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
}
