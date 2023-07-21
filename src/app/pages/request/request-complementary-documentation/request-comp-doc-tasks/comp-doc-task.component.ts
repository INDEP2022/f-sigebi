import { BasePage } from 'src/app/core/shared';

export abstract class CompDocTasksComponent extends BasePage {
  protected abstract regDocForm: boolean;
  protected abstract regDocView: boolean;
  protected abstract searchRequestSimGoods: boolean;
  protected abstract selectGoods: boolean;
  protected abstract guidelines: boolean;
  protected abstract docRequest: boolean;
  protected abstract expRequest: boolean;
  protected abstract viewSelectedGoods: boolean;
  protected abstract dictumValidate: boolean;
  protected abstract notifyReport: boolean;
  protected abstract saveRequest: boolean;
  protected abstract turnReq: boolean;
  protected abstract createReport: boolean;
  protected abstract rejectReq: boolean;

  constructor() {
    super();
  }

  mapTask(process: string, affair?: number) {
    switch (process) {
      case 'similar-good-register-documentation':
        this.regDocForm = true;
        this.regDocView = false;
        this.searchRequestSimGoods = true;
        this.selectGoods = true;
        this.viewSelectedGoods = false;
        this.guidelines = false;
        this.docRequest = false;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = false;
        this.notifyReport = false;

        this.turnReq = true;
        this.createReport = false;
        this.rejectReq = false;
        break;
      case 'similar-good-notify-transferor':
        this.regDocForm = false;
        this.regDocView = true;
        this.searchRequestSimGoods = false;
        this.selectGoods = false;
        this.viewSelectedGoods = true;
        this.guidelines = false;
        this.docRequest = true;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = false;
        this.notifyReport = true;

        this.turnReq = true;
        this.createReport = false;
        this.rejectReq = false;
        break;

      default:
        break;
    }
  }
}
