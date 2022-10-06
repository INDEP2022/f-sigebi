import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface ExampleActa {
  idConversion: number,
  numberAsset: number,
  numberDossier: number,
  numberDossierI: number,
  previousInvestigation: string,
  penalCause: string,
  act: number,
  state: string,
  actDescription: string,
  address: string,
  responsible: string,
  witness: string,
  witnessI: string,
  contractWitness: string
}

@Component({
  selector: 'app-conversion-act',
  templateUrl: './conversion-act.component.html',
  styles: [
  ]
})
export class ConversionActComponent implements OnInit {

  form: FormGroup;
  //Geters del Encabezado
  get idConversion() { return this.form.get('idConversion'); }
  get numberAsset() { return this.form.get('numberAsset'); }
  get numberDossier() { return this.form.get('numberDossier'); }
  get numberDossierI() { return this.form.get('numberDossierI'); }
  get previousInvestigation() { return this.form.get('previousInvestigation'); }
  get penalCause() { return this.form.get('penalCause'); }

  get act() { return this.form.get('act'); }
  get state() { return this.form.get('state'); }
  get actDescription() { return this.form.get('actDescription'); }
  get address() { return this.form.get('address'); }
  get responsible() { return this.form.get('responsible'); }
  get witness() { return this.form.get('witness'); }
  get witnessI() { return this.form.get('witnessI'); }
  get contractWitness() { return this.form.get('contractWitness'); }

  // Acta Example
  actsExample: ExampleActa[] = [
    {
      idConversion: 1,
      numberAsset: 12,
      numberDossier: 12,
      numberDossierI: 12,
      previousInvestigation: 'Averig 1',
      penalCause: 'Causa 1',
      act: 1,
      state: 'A',
      actDescription: 'Clave Act 1',
      address: 'Direccion 1',
      responsible: 'Responsbale 1',
      witness: 'Testigo 1',
      witnessI: 'Testigo 2',
      contractWitness: 'Testigo del contrato 1'
    }
  ]
  // Acta
  actExample: ExampleActa;
  //Data Table
  settings = {
    //selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    hideSubHeader: true,//oculta subheaader de filtro
    noDataMessage: "No se encontrarón registros",
    mode: 'external', // ventana externa
    columns: {
      numberGood: {
        title: 'No Bien',
        width: '10%'
      },
      description: {
        title: 'Descripcion',
        width: '20%'
      },
      amount: {
        title: 'Cantidad',
        width: '10%'
      },
      act: {
        title: 'Acta',
        width: '10%'
      }
    },
  };

  data = [
    {
      numberGood: '1',
      description: 'Descripción 1',
      amount: 'Cant. 1',
      act: 'Act 1'
    },
    {
      numberGood: '2',
      description: 'Descripción 2',
      amount: 'Cant. 2',
      act: 'Act 2'
    }
  ];

  //Data Table
  settings1 = {
    //selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    hideSubHeader: true,//oculta subheaader de filtro
    noDataMessage: "No se encontrarón registros",
    mode: 'external', // ventana externa
    columns: {
      numberGood: {
        title: 'No Bien',
        width: '10%'
      },
      description: {
        title: 'Descripcion',
        width: '30%'
      },
      amount: {
        title: 'Cantidad',
        width: '10%'
      }
    },
  };

  data1: any[] = [];

  constructor(private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.buildFormHeader();
  }

  /**
     * @method: metodo para iniciar el formulario de Encabezado
     * @author:  Alexander Alvarez
    * @since: 27/09/2022
     */
  private buildFormHeader() {
    this.form = this.fb.group({
      idConversion: [null, [Validators.required]],
      numberAsset: [null, [Validators.required]],
      numberDossier: [null, [Validators.required]],
      numberDossierI: [null, [Validators.required]],
      previousInvestigation: [null, [Validators.required]],
      penalCause: [null, [Validators.required]],
      act: [null, [Validators.required]],
      state: [null, [Validators.required]],
      actDescription: [null, [Validators.required]],
      address: [null, [Validators.required]],
      responsible: [null, [Validators.required]],
      witness: [null, [Validators.required]],
      witnessI: [null, [Validators.required]],
      contractWitness: [null, [Validators.required]]

    });
  }

  shearConversionById() {
    // buscar el bien
    const idConversion = Number(this.idConversion.value)
    this.actsExample.forEach(element => {
      if (element.idConversion === idConversion) {
        this.actExample = element;
      }
    });
    this.setValueGood(this.actExample);
  }

  setValueGood(act: ExampleActa) {
    this.numberAsset.setValue(act.numberAsset);
    this.numberDossier.setValue(act.numberDossier);
    this.numberDossierI.setValue(act.numberDossierI);
    this.previousInvestigation.setValue(act.previousInvestigation);
    this.penalCause.setValue(act.penalCause);
    this.state.setValue(`${act.state}`);
    this.actDescription.setValue(act.actDescription);
    this.address.setValue(act.address);
    this.responsible.setValue(act.responsible);
    this.witness.setValue(act.witness);
    this.witnessI.setValue(act.witnessI);
    this.contractWitness.setValue(act.contractWitness);
  }

  print() {

  }

  close() {

  }

  detail() {
    this.router.navigate(['pages/administrative-processes/conversion-act/act-detail']);
  }

  add() {
    this.data1 = this.data;
  }

}
