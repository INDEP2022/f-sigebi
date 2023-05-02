import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styles: [],
})
export class BulkUploadComponent implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Reactive Forms
  form: FormGroup;

  get numberGoodFather() {
    return this.form.get('numberGoodFather');
  }
  get numberDossier() {
    return this.form.get('numberDossier');
  }
  get fileLoad() {
    return this.form.get('fileLoad');
  }

  //Data Table
  settings = {
    //selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    noDataMessage: 'No se encontrarón registros',
    mode: 'external', // ventana externa
    columns: {
      clasif: {
        title: 'Clasif.',
        width: '10%',
      },
      description: {
        title: 'Descripcion',
        width: '20%',
      },
      amount: {
        title: 'Cantidad',
        width: '10%',
      },
      unit: {
        title: 'Unidad',
        width: '10%',
      },
      tipe: {
        title: 'Tipo',
        width: '10%',
      },
      material: {
        title: 'Material',
        width: '10%',
      },
      physicalEdo: {
        title: 'Edo. Fisico',
        width: '10%',
      },
    },
  };

  data = [
    {
      numberGood: '1',
      description: 'Descripción 1',
      amount: 'Cant. 1',
      act: 'Act 1',
    },
    {
      numberGood: '2',
      description: 'Descripción 2',
      amount: 'Cant. 2',
      act: 'Act 2',
    },
  ];

  //Data Table
  settings1 = {
    //selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    noDataMessage: 'No se encontrarón registros',
    mode: 'external', // ventana externa
    columns: {
      numberGood: {
        title: 'No. Renglon',
        width: '20%',
      },
      description: {
        title: 'Descripcion',
        width: '60%',
      },
    },
  };

  data1: any[] = [];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      numberGoodFather: [null, [Validators.required]],
      numberDossier: [null, [Validators.required]],
      fileLoad: [null, [Validators.required]],
    });
  }

  fileLoadBtn() {}

  enterGoods() {}

  exit() {
    this.router.navigate(['pages/administrative-processes/derivation-goods']);
  }
}
