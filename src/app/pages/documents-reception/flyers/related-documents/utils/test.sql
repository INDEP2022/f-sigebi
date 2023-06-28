<<<<<<< HEAD
import { 
    Column, 
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn 
  } from 'typeorm';
import { DetailActEntRecepEntity } from './detail-act-ent-recep.entity';
import { HouseholdEntity } from './household.entity';
  
  @Entity('bien', { schema: 'sera' })
  export class GoodEntity {
  
    @PrimaryColumn({
      name: 'no_bien',
      precision: 10,
    })
    id: number;
  
    @Column('character varying', {
      name: 'no_inventario',
      nullable: true,
      length: 30,
    })
    inventoryNumber: string | null;

    @PrimaryColumn('numeric', {
      name: 'id_bien',
      precision: 10,
    })
    goodId: number;
  
    @Column('character varying', {
      name: 'descripcion',
      nullable: true,
      length: 1250,
    })
    description: string | null;
  
    @Column('numeric', {
      name: 'cantidad',
      nullable: true,
      precision: 19,
      scale: 3,
    })
    quantity: number | null;
  
    @Column({ type: 'date', name: 'fec_entrada', nullable: true })
    dateIn: Date | null;
  
    @Column({ type: 'date', name: 'fec_salida', nullable: true })
    dateOut: Date | null;
  
    @Column({ type: 'date', name: 'fec_vencim', nullable: true })
    expireDate: Date | null;
  
    @Column('character varying', {
      name: 'tipo_ubicacion',
      nullable: true,
      length: 1,
    })
    ubicationType: string | null;
  
    @Column('character varying', { name: 'estatus', nullable: true, length: 3 })
    status: string | null;
  
    @Column('character varying', {
      name: 'clasificacion_bien',
      nullable: true,
      length: 500,
    })
    goodCategory: string | null;
  
    @Column('character varying', {
      name: 'senalamientos_origen',
      nullable: true,
      length: 500,
    })
    originSignals: string | null;
  
    @Column('character varying', {
      name: 'sol_inscr_registro',
      nullable: true,
      length: 1,
    })
    registerInscrSol: string | null;
  
    @Column({ type: 'date', name: 'fec_dictamen', nullable: true })
    dateOpinion: Date | null;
  
    @Column('character varying', {
      name: 'perito_dictamen',
      nullable: true,
      length: 30,
    })
    proficientOpinion: string | null;
  
    @Column('character varying', {
      name: 'valuador_dictamen',
      nullable: true,
      length: 60,
    })
    valuerOpinion: string | null;
  
    @Column('character varying', {
      name: 'dictamen',
      nullable: true,
      length: 500,
    })
    opinion: string | null;
  
    @Column('numeric', {
      name: 'valor_avaluo',
      nullable: true,
      precision: 15,
      scale: 2,
    })
    appraisedValue: number | null;
  
    @Column('numeric', {
      name: 'no_gaveta',
      nullable: true,
      precision: 3,
      scale: 0,
    })
    drawerNumber: number | null;
  
    @Column('numeric', {
      name: 'no_boveda',
      nullable: true,
      precision: 5,
      scale: 0,
    })
    vaultNumber: number | null;
  
    @Column('numeric', {
      name: 'no_bien_referencia',
      nullable: true,
      precision: 10,
      scale: 0,
    })
    goodReferenceNumber: number | null;
  
    @Column('character varying', {
      name: 'cve_moneda_avaluo',
      nullable: true,
      length: 15,
    })
    appraisalCurrencyKey: string | null;
  
    @Column({ type: 'date', name: 'fec_avaluo_vig', nullable: true })
    appraisalVigDate: Date | null;
  
    @Column('character varying', {
      name: 'aprob_dest_legal',
      nullable: true,
      length: 1,
    })
    legalDestApprove: string | null;
  
    @Column('character varying', {
      name: 'usr_aprobo_dest_legal',
      nullable: true,
      length: 30,
    })
    legalDestApproveUsr: string | null;
  
    @Column({ type: 'date', name: 'fec_aprobo_dest_legal', nullable: true })
    legalDestApproveDate: Date | null;
  
    @Column({ type: 'date', name: 'fec_cumplimiento_abandono', nullable: true })
    complianceLeaveDate: Date | null;
  
    @Column({ type: 'date', name: 'fec_notificacion_abandono', nullable: true })
    complianceNotifyDate: Date | null;
  
    @Column('character varying', {
      name: 'observaciones_abandono',
      nullable: true,
      length: 1000,
    })
    leaveObservations: string | null;
  
    @Column({ type: 'date', name: 'fec_conf_abandono_judicial', nullable: true })
    judicialLeaveDate: Date | null;
  
    @Column({ type: 'date', name: 'fec_notificacion', nullable: true })
    notifyDate: Date | null;
  
    @Column('character varying', {
      name: 'notificado_a',
      nullable: true,
      length: 100,
    })
    notifyA: string | null;
  
    @Column('character varying', {
      name: 'lugar_notificacion',
      nullable: true,
      length: 300,
    })
    placeNotify: string | null;
  
    @Column({
      type: 'date',
      name: 'fec_res_desecha_desech_rec_rev',
      nullable: true,
    })
    discardRevRecDate: Date | null;
  
    @Column({
      type: 'date',
      name: 'fec_emision_resolucion_rec_rev',
      nullable: true,
    })
    resolutionEmissionRecRevDate: Date | null;
  
    @Column({ type: 'date', name: 'fec_acuerdo_admisorio_rec_rev', nullable: true })
    admissionAgreementDate: Date | null;
  
    @Column({ type: 'date', name: 'fec_audiencia_rec_rev', nullable: true })
    audienceRevRecDate: Date | null;
  
    @Column('character varying', {
      name: 'observaciones_rec_rev',
      nullable: true,
      length: 500,
    })
    revRecObservations: string | null;
  
    @Column('character varying', {
      name: 'motivo_abandono',
      nullable: true,
      length: 15,
    })
    leaveCause: string | null;
  
    @Column('character varying', {
      name: 'resolucion',
      nullable: true,
      length: 1000,
    })
    resolution: string | null;
  
    @Column({ type: 'date', name: 'fec_incosteabilidad', nullable: true })
    fecUnaffordability: Date | null;
  
    @Column('character varying', {
      name: 'criterio_incosteabilidad',
      nullable: true,
      length: 60,
    })
    unaffordabilityJudgment: string | null;
  
    @Column('character varying', {
      name: 'usr_aprobo_utilizacion',
      nullable: true,
      length: 30,
    })
    userApproveUse: string | null;
  
    @Column({ type: 'date', name: 'fec_aprobo_utilizacion', nullable: true })
    useApproveDate: Date | null;
  
    @Column('character varying', {
      name: 'observaciones_utilizacion',
      nullable: true,
      length: 500,
    })
    useObservations: string | null;
  
    @Column({ type: 'date', name: 'fec_solic_cambio_numerario', nullable: true })
    dateRequestChangeNumerary: Date | null;
  
    @Column('character varying', {
      name: 'usuario_solic_cambio_numerario',
      nullable: true,
      length: 30,
    })
    numberChangeRequestUser: string | null;
  
    @Column('character varying', {
      name: 'motivo_cambio_numerario',
      nullable: true,
      length: 1000,
    })
    causeNumberChange: string | null;
  
    @Column('character varying', {
      name: 'solicito_cambio_numerario',
      nullable: true,
      length: 1,
    })
    changeRequestNumber: string | null;
  
    @Column({ type: 'date', name: 'fec_autoriza_cambio_numerario', nullable: true })
    authNumberChangeDate: Date | null;
  
    @Column('character varying', {
      name: 'usuario_autoriza_cambio_numera',
      nullable: true,
      length: 30,
    })
    authChangeNumberUser: string | null;
  
    @Column('character varying', {
      name: 'autoriza_cambio_numerario',
      nullable: true,
      length: 1,
    })
    authChangeNumber: string | null;
  
    @Column({ type: 'date', name: 'fec_ratifica_cambio_numerario', nullable: true })
    numberChangeRatifiesDate: Date | null;
  
    @Column('character varying', {
      name: 'usuario_ratifica_cambio_numera',
      nullable: true,
      length: 30,
    })
    numberChangeRatifiesUser: string | null;
  
    @Column({ type: 'date', name: 'fec_notificacion_rec_rev', nullable: true })
    notifyRevRecDate: Date | null;
  
    @Column('character varying', {
      name: 'motivo_rec_rev',
      nullable: true,
      length: 1000,
    })
    revRecCause: string | null;
  
    @Column('character varying', {
      name: 'acuerdo_inicial',
      nullable: true,
      length: 1000,
    })
    initialAgreement: string | null;
  
    @Column('character varying', {
      name: 'observaciones',
      nullable: true,
      length: 600,
    })
    observations: string | null;
  
    @Column('numeric', {
      name: 'no_expediente',
      nullable: true,
      precision: 10,
      scale: 0,
    })
    fileNumber: number | null;
  
    @Column('numeric', {
      name: 'no_exp_asociado',
      nullable: true,
      precision: 10,
      scale: 0,
    })
    associatedFileNumber: number | null;
  
    @Column('numeric', {
      name: 'no_rack',
      nullable: true,
      precision: 2,
      scale: 0,
    })
    rackNumber: number | null;
  
    @Column('numeric', {
      name: 'no_almacen',
      nullable: true,
      precision: 5,
      scale: 0,
    })
    storeNumber: number | null;
  
    @Column('numeric', {
      name: 'no_lote',
      nullable: true,
      precision: 3,
      scale: 0,
    })
    lotNumber: number | null;
  
    @Column('numeric', { name: 'no_clasif_bien', precision: 5, scale: 0 })
    goodClassNumber: number;
  
    @Column('numeric', {
      name: 'no_subdelegacion',
      nullable: true,
      precision: 2,
      scale: 0,
    })
    subDelegationNumber: number | null;
  
    @Column('numeric', {
      name: 'no_delegacion',
      nullable: true,
      precision: 2,
      scale: 0,
    })
    delegationNumber: number | null;
  
    @Column({ type: 'date', name: 'fec_recepcion_fisica', nullable: true })
    physicalReceptionDate: Date | null;
  
    @Column('character varying', {
      name: 'estatus_recurso_revision',
      nullable: true,
      length: 45,
    })
    statusResourceReview: string | null;
  
    @Column({ type: 'date', name: 'fec_judicial', nullable: true })
    judicialDate: Date | null;
  
    @Column({ type: 'date', name: 'fec_vencimiento_abandono', nullable: true })
    abandonmentDueDate: Date | null;
  
    @Column({ type: 'date', name: 'fec_aprobo_destruccion', nullable: true })
    destructionApproveDate: Date | null;
  
    @Column('character varying', {
      name: 'usr_aprobo_destruccion',
      nullable: true,
      length: 30,
    })
    destructionApproveUser: string | null;
  
    @Column('character varying', {
      name: 'observaciones_destruccion',
      nullable: true,
      length: 500,
    })
    observationDestruction: string | null;
  
    @Column('numeric', {
      name: 'no_destino',
      nullable: true,
      precision: 10,
      scale: 0,
    })
    destinyNumber: number | null;
  
    @Column('numeric', { name: 'no_registro', nullable: true })
    registryNumber: number | null;
  
    @Column({ type: 'date', name: 'fec_acuerdo_aseg', nullable: true })
    agreementDate: Date | null;
  
    @Column('numeric', {
      name: 'estado',
      nullable: true,
      precision: 2
    })
    state: number | null;
  
    @Column('character varying', {
      name: 'tipo_dictamen',
      nullable: true,
      length: 3,
    })
    opinionType: string | null;
  
    @Column({ type: 'date', name: 'fec_presentacion', nullable: true })
    presentationDate: Date | null;
  
    @Column({ type: 'date', name: 'fec_subsana_rec_rev', nullable: true })
    revRecRemedyDate: Date | null;
  
    @Column('character varying', {
      name: 'estatus_recepcion',
      nullable: true,
      length: 1,
    })
    receptionStatus: string | null;
  
    @Column('character varying', {
      name: 'usuario_promovente_deco_devo',
      nullable: true,
      length: 30,
    })
    promoterUserDecoDevo: string | null;
  
    @Column({ type: 'date', name: 'fec_programada_x_deco_devo', nullable: true })
    scheduledDateDecoDev: Date | null;
  
    @Column('numeric', {
      name: 'no_bien_padre_parcializacion',
      nullable: true,
      precision: 10,
      scale: 0,
    })
    goodsPartializationFatherNumber: number | null;
  
    @Column('character varying', {
      name: 'declaracion_abn_sera',
      nullable: true,
      length: 1000,
    })
    seraAbnDeclaration: string | null;
  
    @Column('character varying', {
      name: 'identificador',
      nullable: true,
      length: 5,
    })
    identifier: string | null;
  
    @Column('character varying', {
      name: 'id_inventari_siabi',
      nullable: true,
      length: 30,
    })
    siabiInventoryId: string | null;
  
    @Column('character varying', {
      name: 'id_inmueble_cisi',
      nullable: true,
      length: 20,
    })
    cisiPropertyId: string | null;
  
    @Column('character varying', {
      name: 'id_invactual_siabi',
      nullable: true,
      length: 25,
    })
    siabiInvalidId: string | null;
  
    @Column({ type: 'date', name: 'fecha_tesofe', nullable: true })
    tesofeDate: Date | null;
  
    @Column('character varying', {
      name: 'folio_tesofe',
      nullable: true,
      length: 20,
    })
    tesofeFolio: string | null;
  
    @Column('numeric', {
      name: 'situacion',
      nullable: true,
      precision: 3,
      scale: 0,
    })
    situation: number | null;
  
    @Column('numeric', {
      name: 'no_etiqueta',
      nullable: true,
      precision: 2,
      scale: 0,
    })
    labelNumber: number | null;
  
    @Column('numeric', {
      name: 'no_volante',
      nullable: true,
      precision: 10,
      scale: 0,
    })
    flyerNumber: number | null;
  
    @Column({ type: 'date', name: 'fec_reg_insert', nullable: true })
    insertRegDate: Date | null;
  
    @Column('numeric', {
      name: 'visportal',
      nullable: true,
      precision: 2,
      scale: 0,
    })
    visportal: number | null;
  
    @Column('character varying', { name: 'unidad', nullable: true, length: 10 })
    unit: string | null;
  
    @Column('numeric', {
      name: 'valor_referencia',
      nullable: true,
      precision: 18,
      scale: 3,
    })
    referenceValue: number | null;
  
    @Column({ type: 'date', name: 'fec_reg_insert_hc', nullable: true })
    insertHcDate: Date | null;
  
    @Column('character varying', {
      name: 'proceso_ext_dom',
      nullable: true,
      length: 15,
    })
    extDomProcess: string | null;
  
    @Column('numeric', {
      name: 'id_solicitud',
      nullable: true
    })
    requestId: number | null;
  
    @Column('numeric', {
      name: 'id_tipo_bien',
      nullable: true
    })
    goodTypeId: number | null;
  
    @Column('numeric', {
      name: 'id_subtipo_bien',
      nullable: true
    })
    subTypeId: number | null;
  
    @Column('character varying', {
      name: 'estatus_bien',
      nullable: true,
      length: 30,
    })
    goodStatus: string | null;
  
    @Column('numeric', {
      name: 'id_bien_inmueble',
      nullable: true
    })
    idGoodProperty: number | null;
  
    @Column('character varying', {
      name: 'folio_solicitud',
      nullable: true,
      length: 30,
    })
    requestFolio: string | null;
  
    @Column('character varying', {
      name: 'tipo',
      nullable: true,
      length: 30,
    })
    type: string | null;
  
    @Column({ type: 'date', name: 'fecha_ingreso', nullable: true })
    admissionDate: Date | null;
  
    @Column('numeric', {
      name: 'id_ubicacion',
      nullable: true
    })
    locationId: number | null;
  
    @Column('character varying', {
      name: 'clave_unica',
      nullable: true,
      length: 30,
    })
    uniqueKey: string | null;
  
    @Column('character varying', {
      name: 'no_expedientee',
      nullable: true,
      length: 1250,
    })
    fileeNumber: string | null;
  
    @Column('character varying', {
      name: 'descripcion_bien',
      nullable: true,
      length: 4000,
    })
    goodDescription: string | null;

    @Column('numeric', {
      name: 'estado_fisico',
      nullable: true
    })
    physicalStatus: number | null;
  
    @Column('character varying', {
      name: 'unidad_medida',
      nullable: true,
      length: 30,
    })
    unitMeasure: string | null;
  
    @Column('character varying', {
      name: 'unidad_ligie',
      nullable: true,
      length: 30,
    })
    ligieUnit: string | null;
  
    @Column('numeric', {
      name: 'cantidadd',
      nullable: true
    })
    quantityy: number | null;
  
    @Column('numeric', {
      name: 'destino',
      nullable: true
    })
    destiny: number | null;
  
    @Column('character varying', {
      name: 'avaluo',
      nullable: true,
      length: 1,
    })
    appraisal: string | null;
  
    @Column('character varying', {
      name: 'notas_entidad_transferente',
      nullable: true,
      length: 1500,
    })
    notesTransferringEntity: string | null;
  
    @Column('numeric', {
      name: 'id_fraccion',
      nullable: true
    })
    fractionId: number | null;
  
    @Column('character varying', {
      name: 'entidad_federativa',
      nullable: true,
      length: 30,
    })
    federalEntity: string | null;
  
    @Column('numeric', {
      name: 'estado_conservacion',
      nullable: true
    })
    stateConservation: number | null;
  
    @Column('character varying', {
      name: 'blindaje',
      nullable: true,
      length: 30,
    })
    armor: string | null;
  
    @Column('character varying', {
      name: 'marca',
      nullable: true,
      length: 30,
    })
    brand: string | null;
  
    @Column('character varying', {
      name: 'submarca',
      nullable: true,
      length: 350,
    })
    subBrand: string | null;
  
    @Column('character varying', {
      name: 'modelo',
      nullable: true,
      length: 300,
    })
    model: string | null;
  
    @Column('character varying', {
      name: 'num_ejes',
      nullable: true,
      length: 30,
    })
    axesNumber: string | null;
  
    @Column('character varying', {
      name: 'num_motor',
      nullable: true,
      length: 30,
    })
    engineNumber: string | null;
  
    @Column('character varying', {
      name: 'matricula',
      nullable: true,
      length: 30,
    })
    tuition: string | null;
  
    @Column('character varying', {
      name: 'serie',
      nullable: true,
      length: 100,
    })
    serie: string | null;
  
    @Column('character varying', {
      name: 'chasis',
      nullable: true,
      length: 30,
    })
    chassis: string | null;
  
    @Column('character varying', {
      name: 'cabina',
      nullable: true,
      length: 30,
    })
    cabin: string | null;
  
    @Column('character varying', {
      name: 'volumen',
      nullable: true,
      length: 30,
    })
    volume: string | null;
  
    @Column('character varying', {
      name: 'procedencia',
      nullable: true,
      length: 30,
    })
    origin: string | null;
  
    @Column('character varying', {
      name: 'tipo_uso',
      nullable: true,
      length: 30,
    })
    useType: string | null;
  
    @Column('character varying', {
      name: 'anio_fabricacion',
      nullable: true,
      length: 30,
    })
    manufacturingYear: string | null;
  
    @Column('character varying', {
      name: 'capacidad',
      nullable: true,
      length: 30,
    })
    capacity: string | null;
  
    @Column('character varying', {
      name: 'estado_operativo',
      nullable: true,
      length: 30,
    })
    operationalState: string | null;
  
    @Column('character varying', {
      name: 'num_motores',
      nullable: true,
      length: 30,
    })
    enginesNumber: string | null;
  
    @Column('character varying', {
      name: 'registro_dgac',
      nullable: true,
      length: 30,
    })
    dgacRegistry: string | null;
  
    @Column('character varying', {
      name: 'tipo_avion',
      nullable: true,
      length: 30,
    })
    airplaneType: string | null;
  
    @Column('character varying', {
      name: 'bandera',
      nullable: true,
      length: 30,
    })
    flag: string | null;
  
    @Column('character varying', {
      name: 'calado',
      nullable: true,
      length: 30,
    })
    openwork: string | null;
  
    @Column('character varying', {
      name: 'eslora',
      nullable: true,
      length: 80,
    })
    length: string | null;
  
    @Column('character varying', {
      name: 'manga',
      nullable: true,
      length: 30,
    })
    sleeve: string | null;
    
    @Column('character varying', {
      name: 'nombre_embarcacion',
      nullable: true,
      length: 100,
    })
    shipName: string | null;
  
    @Column('character varying', {
      name: 'reg_publico',
      nullable: true,
      length: 30,
    })
    publicRegistry: string | null;
  
    @Column('character varying', {
      name: 'embarcaciones',
      nullable: true,
      length: 30,
    })
    ships: string | null;
  
    @Column('character varying', {
      name: 'kilataje',
      nullable: true,
      length: 80,
    })
    caratage: string | null;
  
    @Column('character varying', {
      name: 'material',
      nullable: true,
      length: 80,
    })
    material: string | null;
  
    @Column('character varying', {
      name: 'peso',
      nullable: true,
      length: 30,
    })
    weight: string | null;
  
    @Column('character varying', {
      name: 'sat_expediente',
      nullable: true,
      length: 1250,
    })
    satFile: string | null;
  
    @Column('numeric', {
      name: 'sat_id_clasificacion',
      nullable: true
    })
    satClassificationId: number | null;
  
    @Column('numeric', {
      name: 'sat_id_subclasificacion',
      nullable: true
    })
    satSubclassificationId: number | null;
  
    @Column("character varying", {
      name: "sat_guia_master",
      nullable: true,
      length: 50,
    })
    satGuideMaster: string | null;
  
    @Column("character varying", {
      name: "sat_guia_house",
      nullable: true,
      length: 60,
    })
    satGuideHouse: string | null;
  
    @Column("numeric", {
      name: "sat_no_partida",
      nullable: true,
    })
    satDepartureNumber: number | null;
  
    @Column("character varying", {
      name: "sat_alm_direccion",
      nullable: true,
      length: 30,
    })
    satAlmAddress: string | null;
  
    @Column("character varying", {
      name: "sat_alm_colonia",
      nullable: true,
      length: 30,
    })
    satAlmColony: string | null;
  
    @Column("character varying", {
      name: "sat_alm_ciudad_poblacion",
      nullable: true,
      length: 30,
    })
    satAlmCityPopulation: string | null;
  
    @Column("character varying", {
      name: "sat_alm_municipio_delegacion",
      nullable: true,
      length: 30,
    })
    satAlmMunicipalityDelegation: string | null;
  
    @Column("character varying", {
      name: "sat_alm_entidad_federativa",
      nullable: true,
      length: 30,
    })
    satAlmFederativeEntity: string | null;
  
    @Column("character varying", {
      name: "sat_direccion_entrega",
      nullable: true,
      length: 2000,
    })
    satAddressDelivery: string | null;
  
    @Column("numeric", {
      name: "sat_incumple",
      nullable: true,
    })
    satBreaches: number | null;
  
    @Column("character varying", {
      name: "usuario_creacion",
      nullable: true,
      length: 100,
    })
    userCreation: string | null;
  
    @Column({ type: 'date', name: 'fecha_creacion', nullable: true })
    creationDate: Date | null;
  
    @Column("character varying", {
      name: "usuario_modificacion",
      nullable: true,
      length: 100,
    })
    userModification: string | null;
  
    @Column({ type: 'date', name: 'fecha_modificacion', nullable: true })
    modificationDate: Date | null;
  
    @Column("numeric", {
      name: "ligie_seccion",
      nullable: true,
    })
    ligieSection: number | null;
  
    @Column("numeric", {
      name: "ligie_capitulo",
      nullable: true,
    })
    ligieChapter: number | null;
  
    @Column("numeric", {
      name: "ligie_nivel1",
      nullable: true,
    })
    ligieLevel1: number | null;
  
    @Column("numeric", {
      name: "ligie_nivel2",
      nullable: true,
    })
    ligieLevel2: number | null;
  
    @Column("numeric", {
      name: "ligie_nivel3",
      nullable: true,
    })
    ligieLevel3: number | null;
  
    @Column("numeric", {
      name: "ligie_nivel4",
      nullable: true,
    })
    ligieLevel4: number | null;

    @Column("character varying", {
      name: "sat_clave_unica",
      nullable: true,
      length: 60,
    })
    satUniqueKey: string | null;
  
    @Column("character varying", {
      name: "improcedente",
      nullable: true,
      length: 20,
    })
    unfair: string | null;
  
    @Column("character varying", {
      name: "num_placas",
      nullable: true,
      length: 30,
    })
    platesNumber: string | null;
  
    @Column("character varying", {
      name: "aclaracion",
      nullable: true,
      length: 20,
    })
    clarification: string | null;
  
    @Column("numeric", {
      name: "num_reprogramacion",
      nullable: true,
    })
    reprogrammationNumber: number | null;
  
    @Column("numeric", {
      name: "motivo_canc_reprog",
      nullable: true,
    })
    reasonCancReprog: number | null;
  
    @Column("numeric", {
      name: "id_almacen",
      nullable: true,
    })
    storeId: number | null;
  
    @Column("character varying", {
      name: "fecha_instancia",
      nullable: true,
      length: 30,
    })
    instanceDate: string | null;
  
    @Column("character varying", {
      name: "estatus_proceso",
      nullable: true,
      length: 30,
    })
    processStatus: string | null;
  
    @Column("numeric", {
      name: "version",
      nullable: true,
    })
    version: number | null;
  
    @Column("character varying", {
      name: "observacioness",
      nullable: true,
      length: 1500,
    })
    observationss: string | null;
  
    @Column("numeric", {
      name: "id_domicilio",
      nullable: true,
    })
    addressId: number | null;
  
    @Column("character varying", {
      name: "cumple_norma",
      nullable: true,
      length: 1,
    })
    compliesNorm: string | null;
  
    @Column("character varying", {
      name: "descripcion_bien_sae",
      nullable: true,
      length: 4000,
    })
    descriptionGoodSae: string | null;
  
    @Column("numeric", {
      name: "cantidad_sae",
      nullable: true,
    })
    quantitySae: number | null;
  
    @Column("character varying", {
      name: "unidad_medida_sae",
      nullable: true,
      length: 30,
    })
    saeMeasureUnit: string | null;
  
    @Column("numeric", {
      name: "estado_fisico_sae",
      nullable: true,
    })
    saePhysicalState: number | null;
  
    @Column("numeric", {
      name: "estado_conservacion_sae",
      nullable: true,
    })
    stateConservationSae: number | null;
  
    @Column("character varying", {
      name: "estatus_programacion",
      nullable: true,
      length: 30,
    })
    programmationStatus: string | null;
  
    @Column("character varying", {
      name: "estatus_ejecucion",
      nullable: true,
      length: 30,
    })
    executionStatus: string | null;
  
    @Column("character varying", {
      name: "duplicidad",
      nullable: true,
      length: 1,
    })
    duplicity: string | null;
  
    @Column("numeric", {
      name: "bien_duplicado",
      nullable: true,
    })
    duplicatedGood: number | null;
  
    @Column("character varying", {
      name: "resarcimiento",
      nullable: true,
      length: 1,
    })
    compensation: string | null;
  
    @Column("character varying", {
      name: "validar_bien",
      nullable: true,
      length: 30,
    })
    validateGood: string | null;
  
    @Column("character varying", {
      name: "estatus_ebs",
      nullable: true,
      length: 30,
    })
    ebsStatus: string | null;
  
    @Column("numeric", {
      name: "no_concurrente",
      nullable: true,
    })
    concurrentNumber: number | null;
  
    @Column("character varying", {
      name: "msg_concurrente",
      nullable: true,
      length: 4000,
    })
    concurrentMsg: string | null;
  
    @Column("character varying", {
      name: "apto_circular",
      nullable: true,
      length: 1,
    })
    fitCircular: string | null;
  
    @Column("character varying", {
      name: "reporte_robo",
      nullable: true,
      length: 1,
    })
    theftReport: string | null;
  
    @Column("numeric", {
      name: "destino_transferente",
      nullable: true,
    })
    transferentDestiny: number | null;
  
    @Column("numeric", {
      name: "destino_sae",
      nullable: true,
    })
    saeDestiny: number | null;
  
    @Column("numeric", {
      name: "rechazo_aclaracion",
      nullable: true,
    })
    rejectionClarification: number | null;
  
    @Column("numeric", {
      name: "id_bien_resdev",
      nullable: true,
    })
    goodResdevId: number | null;
  
    @Column("character varying", {
      name: "ind_aclaracion",
      nullable: true,
      length: 1,
    })
    indClarification: string | null;
  
    @Column("character varying", {
      name: "msg_sat_sae",
      nullable: true,
      length: 1000,
    })
    msgSatSae: string | null;
  
    @Column("character varying", {
      name: "color",
      nullable: true,
      length: 50,
    })
    color: string | null;
  
    @Column("numeric", {
      name: "num_puertas",
      nullable: true,
    })
    doorsNumber: number | null;
  
    @Column("numeric", {
      name: "destino_resarcimiento",
      nullable: true,
    })
    destinationRedress: number | null;
  
    @Column('character varying', { name: 'val1', nullable: true, length: 200 })
    val1: string | null;
  
    @Column('character varying', { name: 'val2', nullable: true, length: 200 })
    val2: string | null;
  
    @Column('character varying', { name: 'val3', nullable: true, length: 80 })
    val3: string | null;
  
    @Column('character varying', { name: 'val4', nullable: true, length: 80 })
    val4: string | null;
  
    @Column('character varying', { name: 'val5', nullable: true, length: 160 })
    val5: string | null;
  
    @Column('character varying', { name: 'val6', nullable: true, length: 80 })
    val6: string | null;
  
    @Column('character varying', { name: 'val7', nullable: true, length: 80 })
    val7: string | null;
  
    @Column('character varying', { name: 'val8', nullable: true, length: 80 })
    val8: string | null;
  
    @Column('character varying', { name: 'val9', nullable: true, length: 80 })
    val9: string | null;
  
    @Column('character varying', { name: 'val10', nullable: true, length: 80 })
    val10: string | null;
  
    @Column('character varying', { name: 'val11', nullable: true, length: 80 })
    val11: string | null;
  
    @Column('character varying', { name: 'val12', nullable: true, length: 80 })
    val12: string | null;
  
    @Column('character varying', { name: 'val13', nullable: true, length: 80 })
    val13: string | null;
  
    @Column('character varying', { name: 'val14', nullable: true, length: 80 })
    val14: string | null;
  
    @Column('character varying', { name: 'val15', nullable: true, length: 80 })
    val15: string | null;
  
    @Column('character varying', { name: 'val16', nullable: true, length: 80 })
    val16: string | null;
  
    @Column('character varying', { name: 'val17', nullable: true, length: 80 })
    val17: string | null;
  
    @Column('character varying', { name: 'val18', nullable: true, length: 80 })
    val18: string | null;
  
    @Column('character varying', { name: 'val19', nullable: true, length: 80 })
    val19: string | null;
  
    @Column('character varying', { name: 'val20', nullable: true, length: 80 })
    val20: string | null;
  
    @Column('character varying', { name: 'val21', nullable: true, length: 80 })
    val21: string | null;
  
    @Column('character varying', { name: 'val22', nullable: true, length: 80 })
    val22: string | null;
  
    @Column('character varying', { name: 'val23', nullable: true, length: 80 })
    val23: string | null;
  
    @Column('character varying', { name: 'val24', nullable: true, length: 80 })
    val24: string | null;
  
    @Column('character varying', { name: 'val25', nullable: true, length: 80 })
    val25: string | null;
  
    @Column('character varying', { name: 'val26', nullable: true, length: 80 })
    val26: string | null;
  
    @Column('character varying', { name: 'val27', nullable: true, length: 200 })
    val27: string | null;
  
    @Column('character varying', { name: 'val28', nullable: true, length: 200 })
    val28: string | null;
  
    @Column('character varying', { name: 'val29', nullable: true, length: 80 })
    val29: string | null;
  
    @Column('character varying', { name: 'val30', nullable: true, length: 80 })
    val30: string | null;
  
    @Column('character varying', { name: 'val31', nullable: true, length: 80 })
    val31: string | null;
  
    @Column('character varying', { name: 'val32', nullable: true, length: 80 })
    val32: string | null;
  
    @Column('character varying', { name: 'val33', nullable: true, length: 80 })
    val33: string | null;
  
    @Column('character varying', { name: 'val34', nullable: true, length: 500 })
    val34: string | null;
  
    @Column('character varying', { name: 'val35', nullable: true, length: 80 })
    val35: string | null;
  
    @Column('character varying', { name: 'val36', nullable: true, length: 80 })
    val36: string | null;
  
    @Column('character varying', { name: 'val37', nullable: true, length: 80 })
    val37: string | null;
  
    @Column('character varying', { name: 'val38', nullable: true, length: 80 })
    val38: string | null;
  
    @Column('character varying', { name: 'val39', nullable: true, length: 80 })
    val39: string | null;
  
    @Column('character varying', { name: 'val40', nullable: true, length: 80 })
    val40: string | null;
  
    @Column('character varying', { name: 'val41', nullable: true, length: 200 })
    val41: string | null;
  
    @Column('character varying', { name: 'val42', nullable: true, length: 200 })
    val42: string | null;
  
    @Column('character varying', { name: 'val43', nullable: true, length: 200 })
    val43: string | null;
  
    @Column('character varying', { name: 'val44', nullable: true, length: 200 })
    val44: string | null;
  
    @Column('character varying', { name: 'val45', nullable: true, length: 200 })
    val45: string | null;
  
    @Column('character varying', { name: 'val46', nullable: true, length: 200 })
    val46: string | null;
  
    @Column('character varying', { name: 'val47', nullable: true, length: 200 })
    val47: string | null;
  
    @Column('character varying', { name: 'val48', nullable: true, length: 200 })
    val48: string | null;
  
    @Column('character varying', { name: 'val49', nullable: true, length: 200 })
    val49: string | null;
  
    @Column('character varying', { name: 'val50', nullable: true, length: 200 })
    val50: string | null;
  
    @Column('character varying', { name: 'val51', nullable: true, length: 200 })
    val51: string | null;
  
    @Column('character varying', { name: 'val52', nullable: true, length: 200 })
    val52: string | null;
  
    @Column('character varying', { name: 'val53', nullable: true, length: 80 })
    val53: string | null;
  
    @Column('character varying', { name: 'val54', nullable: true, length: 80 })
    val54: string | null;
  
    @Column('character varying', { name: 'val55', nullable: true, length: 160 })
    val55: string | null;
  
    @Column('character varying', { name: 'val56', nullable: true, length: 80 })
    val56: string | null;
  
    @Column('character varying', { name: 'val57', nullable: true, length: 80 })
    val57: string | null;
  
    @Column('character varying', { name: 'val58', nullable: true, length: 80 })
    val58: string | null;
  
    @Column('character varying', { name: 'val59', nullable: true, length: 80 })
    val59: string | null;
  
    @Column('character varying', { name: 'val60', nullable: true, length: 80 })
    val60: string | null;
  
    @Column('character varying', { name: 'val61', nullable: true, length: 80 })
    val61: string | null;
  
    @Column('character varying', { name: 'val62', nullable: true, length: 80 })
    val62: string | null;
  
    @Column('character varying', { name: 'val63', nullable: true, length: 80 })
    val63: string | null;
  
    @Column('character varying', { name: 'val64', nullable: true, length: 80 })
    val64: string | null;
  
    @Column('character varying', { name: 'val65', nullable: true, length: 80 })
    val65: string | null;
  
    @Column('character varying', { name: 'val66', nullable: true, length: 80 })
    val66: string | null;
  
    @Column('character varying', { name: 'val67', nullable: true, length: 80 })
    val67: string | null;
  
    @Column('character varying', { name: 'val68', nullable: true, length: 80 })
    val68: string | null;
  
    @Column('character varying', { name: 'val69', nullable: true, length: 80 })
    val69: string | null;
  
    @Column('character varying', { name: 'val70', nullable: true, length: 80 })
    val70: string | null;
  
    @Column('character varying', { name: 'val71', nullable: true, length: 80 })
    val71: string | null;
  
    @Column('character varying', { name: 'val72', nullable: true, length: 80 })
    val72: string | null;
  
    @Column('character varying', { name: 'val73', nullable: true, length: 80 })
    val73: string | null;
  
    @Column('character varying', { name: 'val74', nullable: true, length: 80 })
    val74: string | null;
  
    @Column('character varying', { name: 'val75', nullable: true, length: 80 })
    val75: string | null;
  
    @Column('character varying', { name: 'val76', nullable: true, length: 80 })
    val76: string | null;
  
    @Column('character varying', { name: 'val77', nullable: true, length: 200 })
    val77: string | null;
  
    @Column('character varying', { name: 'val78', nullable: true, length: 200 })
    val78: string | null;
  
    @Column('character varying', { name: 'val79', nullable: true, length: 80 })
    val79: string | null;
  
    @Column('character varying', { name: 'val80', nullable: true, length: 80 })
    val80: string | null;
  
    @Column('character varying', { name: 'val81', nullable: true, length: 80 })
    val81: string | null;
  
    @Column('character varying', { name: 'val82', nullable: true, length: 80 })
    val82: string | null;
  
    @Column('character varying', { name: 'val83', nullable: true, length: 80 })
    val83: string | null;
  
    @Column('character varying', { name: 'val84', nullable: true, length: 500 })
    val84: string | null;
  
    @Column('character varying', { name: 'val85', nullable: true, length: 80 })
    val85: string | null;
  
    @Column('character varying', { name: 'val86', nullable: true, length: 80 })
    val86: string | null;
  
    @Column('character varying', { name: 'val87', nullable: true, length: 80 })
    val87: string | null;
  
    @Column('character varying', { name: 'val88', nullable: true, length: 80 })
    val88: string | null;
  
    @Column('character varying', { name: 'val89', nullable: true, length: 80 })
    val89: string | null;
  
    @Column('character varying', { name: 'val90', nullable: true, length: 80 })
    val90: string | null;
  
    @Column('character varying', { name: 'val91', nullable: true, length: 200 })
    val91: string | null;
  
    @Column('character varying', { name: 'val92', nullable: true, length: 200 })
    val92: string | null;
  
    @Column('character varying', { name: 'val93', nullable: true, length: 200 })
    val93: string | null;
  
    @Column('character varying', { name: 'val94', nullable: true, length: 200 })
    val94: string | null;
  
    @Column('character varying', { name: 'val95', nullable: true, length: 200 })
    val95: string | null;
  
    @Column('character varying', { name: 'val96', nullable: true, length: 200 })
    val96: string | null;
  
    @Column('character varying', { name: 'val97', nullable: true, length: 200 })
    val97: string | null;
  
    @Column('character varying', { name: 'val98', nullable: true, length: 200 })
    val98: string | null;
  
    @Column('character varying', { name: 'val99', nullable: true, length: 200 })
    val99: string | null;
  
    @Column('character varying', { name: 'val100', nullable: true, length: 200 })
    val100: string | null;
  
    @Column('character varying', { name: 'val101', nullable: true, length: 200 })
    val101: string | null;
  
    @Column('character varying', { name: 'val102', nullable: true, length: 200 })
    val102: string | null;
  
    @Column('character varying', { name: 'val103', nullable: true, length: 200 })
    val103: string | null;
  
    @Column('character varying', { name: 'val104', nullable: true, length: 200 })
    val104: string | null;
  
    @Column('character varying', { name: 'val105', nullable: true, length: 200 })
    val105: string | null;
  
    @Column('character varying', { name: 'val106', nullable: true, length: 200 })
    val106: string | null;
  
    @Column('character varying', { name: 'val107', nullable: true, length: 200 })
    val107: string | null;
  
    @Column('character varying', { name: 'val108', nullable: true, length: 200 })
    val108: string | null;
  
    @Column('character varying', { name: 'val109', nullable: true, length: 200 })
    val109: string | null;
  
    @Column('character varying', { name: 'val110', nullable: true, length: 200 })
    val110: string | null;
  
    @Column('character varying', { name: 'val111', nullable: true, length: 200 })
    val111: string | null;
  
    @Column('character varying', { name: 'val112', nullable: true, length: 200 })
    val112: string | null;
  
    @Column('character varying', { name: 'val113', nullable: true, length: 200 })
    val113: string | null;
  
    @Column('character varying', { name: 'val114', nullable: true, length: 200 })
    val114: string | null;
  
    @Column('character varying', { name: 'val115', nullable: true, length: 200 })
    val115: string | null;
  
    @Column('character varying', { name: 'val116', nullable: true, length: 200 })
    val116: string | null;
  
    @Column('character varying', { name: 'val117', nullable: true, length: 200 })
    val117: string | null;
  
    @Column('character varying', { name: 'val118', nullable: true, length: 200 })
    val118: string | null;
  
    @Column('character varying', { name: 'val119', nullable: true, length: 200 })
    val119: string | null;
  
    @Column('character varying', { name: 'val120', nullable: true, length: 200 })
    val120: string | null; 

    @OneToOne(() => DetailActEntRecepEntity)
    @JoinColumn([{ name: "no_bien", referencedColumnName: "goodNumber" }])
    detail: DetailActEntRecepEntity


    @OneToOne(() => HouseholdEntity)
    @JoinColumn({ name: 'no_bien', referencedColumnName: 'goodNumber' })
    menaje: HouseholdEntity;
}
  
=======
DECLARE
   VNO_OF_DICTA  DICTAMINACIONES.NO_OF_DICTA%TYPE;
   VIDENTI       VARCHAR2(2);
   VTIPO_VOLANTE NOTIFICACIONES.TIPO_VOLANTE%TYPE;
   PL_ID         PARAMLIST;
   PL_NAME       VARCHAR2(15) := 'Params_Reporte';
BEGIN
   LST_ARCHIVO_DESTINO := 'c:\IMTMPSIAB\'
      ||:GLOBAL.VG_DIRUSR
      ||'\CAREXPDESAHOGO.CSV';
   GO_BLOCK('TMP_ERRORES');
   CLEAR_BLOCK(NO_COMMIT);
   DELETE FROM TMP_ERRORES
   WHERE
      ID_PROCESO = 12345;
   GO_BLOCK('TMP_EXP_DESAHOGO');
   CLEAR_BLOCK(NO_COMMIT);
   DELETE FROM TMP_EXP_DESAHOGOB;
   LIP_COMMIT_SILENCIOSO;
   BEGIN
      LFIARCHIVO := TEXT_IO.FOPEN(LST_ARCHIVO_DESTINO, 'r');
      V_CONT := 0;
      LOOP
         TEXT_IO.GET_LINE(LFIARCHIVO, LST_CADENA);
         V_CONT := V_CONT+1;
         V_NO_BIEN := GETWORDCSV( LST_CADENA, 1);
         V_NO_EXPEDIENTE := GETWORDCSV( LST_CADENA, 2);
         V_VALID_BIEN := ISNUMBER (V_NO_BIEN);
         V_VALID_EXP := ISNUMBER (V_NO_EXPEDIENTE);
         IF V_VALID_BIEN = 1 AND V_VALID_EXP = 1 THEN
            GO_BLOCK('TMP_EXP_DESAHOGO');
            IF :TMP_EXP_DESAHOGO.NO_BIEN IS NOT NULL THEN
               CREATE_RECORD;
            END IF;
            :TMP_EXP_DESAHOGO.NO_BIEN := TO_NUMBER(V_NO_BIEN, '999999999.99');
            :TMP_EXP_DESAHOGO.NO_EXPEDIENTE := TO_NUMBER(V_NO_EXPEDIENTE, '999999999.99');
         ELSE
            GO_BLOCK('TMP_ERRORES');
            IF :TMP_ERRORES.ID_PROCESO IS NOT NULL THEN
               CREATE_RECORD;
            END IF;
            :TMP_ERRORES.ID_PROCESO := 12345;
            :TMP_ERRORES.DESCRIPCION := 'REGISTRO: '
               ||TO_CHAR(V_CONT)
               ||',CONTENIDO: '
               ||SUBSTR(LST_CADENA, 1, 1000);
         END IF;
      END LOOP;
   EXCEPTION
      WHEN NO_DATA_FOUND THEN
         TEXT_IO.FCLOSE(LFIARCHIVO);
   END;
   LIP_COMMIT_SILENCIOSO;
   GO_BLOCK('TMP_ERRORES');
   FIRST_RECORD;
   GO_BLOCK('TMP_EXP_DESAHOGO');
   FIRST_RECORD;
EXCEPTION
   WHEN OTHERS THEN
      LIP_MENSAJE('Error en proceso de inicialización.','S');
END;
>>>>>>> 7d8b6cfb7d6533836e91988fec9a465fd3bf6124
