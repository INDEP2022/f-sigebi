import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pa-lg-c-tracker-goods',
  templateUrl: './pa-lg-c-tracker-goods.component.html',
  styles: [
  ]
})
export class PaLgCTrackerGoodsComponent implements OnInit {

     //Reactive Forms
     form: FormGroup;
 
     //Criterio por clasificación de bienes
     get tariffFraction() { return this.form.get('tariffFraction'); }
     get goodsClassificationNumber() { return this.form.get('goodsClassificationNumber')}
     get alternateClassificationGood() { return this.form.get('alternateClassificationGood'); }
     get search() { return this.form.get('search'); }

     //Reactive Forms
     formCriteria : FormGroup;
     //Criterios por Datos del Bien
     get numberGood() { return this.formCriteria.get('numberGood'); }
     get listGoods() { return this.formCriteria.get('listGoods'); }
     get inventorySAMI() { return this.formCriteria.get('inventorySAMI'); }
     get listInventory() { return this.formCriteria.get('listInventory'); }
     get process() { return this.formCriteria.get('process'); }
     //get newLocationVault() { return this.formCriteria.get('newLocationVault'); }
     //get newDescriptionVault() { return this.formCriteria.get('newDescriptionVault'); } 
     
   constructor(private fb: FormBuilder, private router: Router,private modalService: BsModalService) { }
 
   ngOnInit(): void {
     this.buildForm();
     this.buildFormCriteria();
   }
 
   /**
       * @method: metodo para iniciar el formulario
       * @author:  Alexander Alvarez
      * @since: 27/09/2022
   */
 
    private buildForm() {
     this.form = this.fb.group({
       tariffFraction: [null, [Validators.required]],
       goodsClassificationNumber: [null, [Validators.required]],
       alternateClassificationGood: [null, [Validators.required]],
       search: [null, [Validators.required]]
     });
    }

    private buildFormCriteria() {
      this.formCriteria = this.fb.group({
        numberGood: [null, [Validators.required]],
        listGoods: [null, [Validators.required]],
        inventorySAMI: [null, [Validators.required]],
        listInventory: [null, [Validators.required]],
        process: [null, [Validators.required]],
      });
     }
}
