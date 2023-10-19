import { type FormGroup } from '@angular/forms';
import { firstValueFrom, type BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { type DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { type DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { IncidentMaintenanceService } from 'src/app/core/services/ms-generalproc/incident-maintenance.service';
import { type MassiveDictationService } from 'src/app/core/services/ms-massivedictation/massivedictation.service';
import { BasePage } from 'src/app/core/shared/base-page';

export abstract class MassRullingResponses extends BasePage {
  protected abstract documentsService: DocumentsService;
  protected abstract dictationService: DictationService;
  protected abstract massiveDictationService: MassiveDictationService;
  protected abstract incidentMaintenanceService: IncidentMaintenanceService;

  abstract dataTable: any[];
  abstract totalItems: number;
  abstract params: BehaviorSubject<ListParams>;
  abstract dataTableErrors: { processId: any; description: string }[];
  abstract totalItemsErrors: number;
  abstract paramsErrors: BehaviorSubject<ListParams>;
  abstract form: FormGroup;
  abstract isDisableCreateDictation: boolean;

  async CountDictationGoodFile(armyOfficeKey: any) {
    const result = await firstValueFrom(
      this.documentsService.postCountDictationGoodFile(armyOfficeKey)
    );
    if (result.data.length > 0) {
      return result.data[0].count;
    }
    throw new Error('No se encontraron registros');
  }

  async getRtdictaAarusr(toolbarUser: string) {
    // select USUARIO
    // 		INTO USUAR
    // 		from R_TDICTA_AARUSR
    // 	 WHERE nO_TIPO ='ELIMINAR'
    // 		 AND USUARIO   =:TOOLBAR_USUARIO;
    const params = new ListParams();
    params['filter.typeNumber'] = '$eq:ELIMINAR';
    params['filter.user'] = `$eq:${toolbarUser}`;
    params.limit = 1;
    const result = await firstValueFrom(
      this.dictationService.getRTdictaAarusr(params)
    );
    if (result.data.length > 0) {
      return result.data[0];
    }
    throw new Error('No se encontraron registros');
  }

  async procedureDeleteDictationMoreTax(passOfficeArmy: string) {
    const result = await firstValueFrom(
      this.massiveDictationService.deleteDictationMoreTax(passOfficeArmy)
    );
    return result;
  }

  pupPreviousData(body: {
    bienes: { goodNumber: number; fileNumber: number }[];
  }) {
    this.dictationService.postApplicationPupPreviousData(body).subscribe({
      next: result => {
        this.onLoadToast(
          'success',
          '',
          'Se ha realizado la operación con éxito'
        );
        // this.getTmpExpDesahogoB(new ListParams());
        // this.form.get('id').setValue(null);
        this.form.get('delete').enable();
        this.form.get('delete').setValue(false);
        this.isDisableCreateDictation = false;
        this.params.next(new ListParams());
        this.paramsErrors.next(new ListParams());
      },
      error: err => {
        this.onLoadToast(
          'error',
          '',
          'Ocurrió un error al realizar la operación, inténtelo nuevamente'
        );
      },
    });
  }

  getTmpExpDesahogoB(listParams: ListParams) {
    this.dictationService.getTmpExpDesahogoB(listParams).subscribe({
      next: result => {
        const data = result.data;
        this.dataTable = data.map(item => {
          return {
            goodNumber: item.goodNumber,
            fileNumber: item.numberProceedings,
          };
        });
        this.totalItems = result.count;
      },
    });
  }

  getTmpErrores(listParams: ListParams) {
    listParams['filter.processId'] = '12345';
    this.incidentMaintenanceService.getTmpErrores(listParams).subscribe({
      next: result => {
        // const data = result.data;

        // this.dataTable = data.map(item => {
        //   return {
        //     goodNumber: item.goodNumber,
        //     fileNumber: item.numberProceedings,
        //   };
        // });
        this.totalItemsErrors = result.count;
      },
    });
  }
}
