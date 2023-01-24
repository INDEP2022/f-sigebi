import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from './../../../../core/interfaces/model-form';

@Component({
  selector: 'app-general-data-goods',
  templateUrl: './general-data-goods.component.html',
  styles: [],
})
export class GeneralDataGoodsComponent implements OnInit {
  generalDataForm: ModelForm<any>;
  list: any[] = [
    {
      atributo: 'CALLE',
      valor: 'AV. DE LAS TORRES ESQ. INDUSTRIALES NAYARITAS S/N',
    },
    {
      atributo: 'COLONIA',
      valor: 'CIUDAD INDUSTRIAL',
    },
    {
      atributo: 'DELEGACION O MUNICIPIO',
      valor: 'TEPIC',
    },
    {
      atributo: 'ENTIDAD FEDERATIVA',
      valor: 'NAYARIT',
    },
    {
      atributo: 'SUPERFICIE DEL TERRENO',
      valor: '',
    },
    {
      atributo: 'SUPERFICIE CONSTRUIDA',
      valor: '',
    },
    {
      atributo: 'TIPO DE INMUEBLE',
      valor: '',
    },
    {
      atributo: 'CARACTERISTICAS DEL INMUEBLE',
      valor: '',
    },
    {
      atributo: 'VALOR DE REGISTRO CONTABLE',
      valor: '63173',
    },
    {
      atributo: 'FOLIO DE ESCRITURA',
      valor: '0',
    },
    {
      atributo: 'ESTADO FISICO MENAJE',
      valor: '4359,22',
    },
    {
      atributo: 'IMPORTE TOTAL DEL MENAJE',
      valor: '',
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.generalDataForm = this.fb.group({
      descripcion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cantidad: [null, [Validators.required]],
      fechaFe: [new Date(), [Validators.required]],
      observacion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}
