/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-system-access',
  templateUrl: './system-access.component.html',
  styleUrls: ['./system-access.component.scss'],
})
export class SystemAccessComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public optionsEspeciales = [
    { value: 'Permisos Especiales', label: 'Permisos Especiales' },
    { value: 'Genera/Elimina Dic/Ofic.', label: 'Genera/Elimina Dic/Ofic.' },
    { value: 'Firma Dictamen', label: 'Firma Dictamen' },
    { value: 'Grupo de Trabajo', label: 'Grupo de Trabajo' },
    { value: 'Comercializacion', label: 'Comercializacion' },
    { value: 'Ind/Prog./Com. Dom', label: 'Ind/Prog./Com. Dom' },
    { value: 'NO', label: 'NO' },
  ];

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
      pantalla: { title: 'PANTALLA' },
      permisos: { title: 'PERMISOS', type: 'html' },
    },
  };

  data = [
    {
      pantalla: 'PANTALLA',
      permisos:
        '<span class="badge bg-danger">LECTURA</span><span class="badge bg-primary">ESCRITURA</span>',
    },
  ];

  tableSettingsTablaDB = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      tablaBD: { title: 'Tabla BD' },
    },
  };

  dataTablaDB = [
    {
      tablaBD: 'Tabla BD',
    },
  ];

  tableSettingsDevolucionDecomiso = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      devolucionDecomiso: { title: 'Devolución Decomiso' },
      estatus: { title: 'Estatus' },
      descripcion: { title: 'Descripción' },
    },
  };

  dataDevolucionDecomiso = [
    {
      devolucionDecomiso: 'Devolución Decomiso',
      estatus: 'Estatus',
      descripcion: 'Descripción',
    },
  ];

  permisosEspecialesForm: FormGroup;
  nuevaPantallaForm: FormGroup;
  reglasForm: FormGroup;
  public devolucionDecomiso: boolean = false;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  prepareForm() {
    this.permisosEspecialesForm = this.fb.group({
      permisosEspeciales: [null],
    });

    this.nuevaPantallaForm = this.fb.group({
      pantalla: [null],
      descripcion: [null],
      disponibleMenu: [null],
      nombreMenu: [null],
    });

    this.reglasForm = this.fb.group({
      estatusInicial: [null],
      estatusFinal: [null],
      pantalla: [null],
      usuario: [null],
    });
  }

  btnAsignarFuncion() {
    console.log('btnAsignarFuncion');
  }
  btnCopiarFuncion() {
    console.log('btnCopiarFuncion');
  }
  btnEstatusDecoDevo() {
    console.log('btnEstatusDecoDevo');
    this.devolucionDecomiso = true;
  }
  btnRegeneraPermisos() {
    console.log('btnRegeneraPermisos');
  }
  btnVerOtroLienzo() {
    console.log('btnVerOtroLienzo');
    this.devolucionDecomiso = false;
  }
}
