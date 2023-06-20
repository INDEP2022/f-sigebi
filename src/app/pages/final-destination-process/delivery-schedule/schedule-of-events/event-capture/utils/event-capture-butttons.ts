export class EventCaptureButtons {
  sendSise = new EventCaptureButton('Enviar SISE', false);
  closeProg = new EventCaptureButton('Cerrar Programación');
  expExcel = new EventCaptureButton('Exportar Excel');
  signOffice = new EventCaptureButton('Firmar Oficio');
  printOffice = new EventCaptureButton('Impr. Oficio');
  notificationDest = new EventCaptureButton('Destinatario Notificación', false);
  loadGoods = new EventCaptureButton('Carga Bienes');
  goodsTracker = new EventCaptureButton('Rastreador');
  convPack = new EventCaptureButton('Paq. Conv', true, false);
  apply = new EventCaptureButton('Guardar Fechas');
  deletePack = new EventCaptureButton('Borrar Paq.', false);
  xml = new EventCaptureButton('XML', false);
  generateStrategy = new EventCaptureButton('Generar Estrategia');
}

class EventCaptureButton {
  enabled: boolean = true;
  visible: boolean = true;

  constructor(public label: string, visible = true, enabled = true) {
    this.visible = visible;
    this.enabled = enabled;
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  setText(text: string) {
    this.label = text;
  }
}
