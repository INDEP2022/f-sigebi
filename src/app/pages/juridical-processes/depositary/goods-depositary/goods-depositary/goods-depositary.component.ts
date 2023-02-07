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
  selector: 'app-goods-depositary',
  templateUrl: './goods-depositary.component.html',
  styleUrls: ['./goods-depositary.component.scss'],
})
export class GoodsDepositaryComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  items = new DefaultSelect<Example>();
  public form: FormGroup;

  constructor(private fb: FormBuilder, private exampleService: ExampleService) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      delegacion: ['', [Validators.required]], //* Delegación Detalle
      subdelegacion: ['', [Validators.required]], //* Subdelegación Detalle
      depositaria: ['', [Validators.required]], //*  Depositaria Detalle
      entidadFederativa: ['', [Validators.required]], //* Entidad Federativa Detalle
      tipoBien: ['', [Validators.required]], //* Tipo Bien Detalle
      subTipoBien: ['', [Validators.required]], //* Subtipo Bien Detalle
      tipo: ['', [Validators.required]], //* "Administrador, Depositaría, Interventor, Todos"
      fechaNombramientoProvicional: ['', [Validators.required]], //*
      fechaRemocion: ['', [Validators.required]], //*
      fechaNombramientoDefinitivo: ['', [Validators.required]], //*
      todasFechas: ['', [Validators.required]], //*
      desdeFecha: ['', [Validators.required]], //*
      hastaFecha: ['', [Validators.required]], //*
    });
  }

  btnImprimir(): any {
    console.log(this.form.value);
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
}
