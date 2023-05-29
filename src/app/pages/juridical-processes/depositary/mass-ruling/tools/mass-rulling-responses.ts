import { firstValueFrom } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { type DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { type DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { type MassiveDictationService } from 'src/app/core/services/ms-massivedictation/massivedictation.service';
import { BasePage } from 'src/app/core/shared/base-page';

export abstract class MassRullingResponses extends BasePage {
  protected abstract documentsService: DocumentsService;
  protected abstract dictationService: DictationService;
  protected abstract massiveDictationService: MassiveDictationService;

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
    params['filter.typeNumber'] = 'ELIMINAR';
    params['filter.user'] = toolbarUser;
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
}
