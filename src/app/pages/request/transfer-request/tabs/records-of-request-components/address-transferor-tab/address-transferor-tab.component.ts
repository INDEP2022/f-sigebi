import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-address-transferor-tab',
  templateUrl: './address-transferor-tab.component.html',
  styles: [],
})
export class AddressTransferorTabComponent implements OnInit {
  @ViewChild('myTemplate', { static: true }) template: TemplateRef<any>;
  @ViewChild('myTemplate', { static: true, read: ViewContainerRef })
  container: ViewContainerRef;
  addressForm: ModelForm<any>;

  selectState = new DefaultSelect<any>();
  selectMunicipe = new DefaultSelect<any>();
  selectSuburb = new DefaultSelect<any>();
  selectCP = new DefaultSelect<any>();

  isNewAddress: boolean = false;

  constructor(private fb: FormBuilder, private modelRef: BsModalRef) {}

  ngOnInit(): void {
    if (this.isNewAddress != true) {
      this.container.createEmbeddedView(this.template);
    }
    this.initForm();
  }

  initForm() {
    this.addressForm = this.fb.group({
      aliasWarehouse: [null, [Validators.pattern(STRING_PATTERN)]],
      referenceVia2: [null, [Validators.pattern(STRING_PATTERN)]],
      state: [null],
      referenceVia3: [null, [Validators.pattern(STRING_PATTERN)]],
      municipe: [null],
      suburb: [null],
      cp: [null],
      longitud: [null, [Validators.pattern(STRING_PATTERN)]],
      latitud: [null, [Validators.pattern(STRING_PATTERN)]],
      nameRoute: [null, [Validators.pattern(STRING_PATTERN)]],
      numExt: [null],
      originRoute: [null, [Validators.pattern(STRING_PATTERN)]],
      numInt: [null],
      routeDestination: [null, [Validators.pattern(STRING_PATTERN)]],
      referenceVia1: [null, [Validators.pattern(STRING_PATTERN)]],
      kilometerRoute: [null],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    if (this.isNewAddress != true) {
      this.addressForm.controls['aliasWarehouse'].disable();
      this.addressForm
        .get('aliasWarehouse')
        .patchValue('DOMICILIO TRANSFERENTE');
      //set la ciudad actual
      this.addressForm.get('state').patchValue('');
      this.addressForm.controls['state'].disable();
    }
  }

  getState(event: any) {}

  getMunicipe(event: any) {}

  getSuburb(event: any) {}

  getCP(event: any) {}

  saveAddres() {
    //guardar el formulario para que se carge en el modal anterior
    console.log(this.addressForm.value);
  }

  close() {
    this.modelRef.hide();
  }
}
