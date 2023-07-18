DECLARE
   vc_pantalla                   VARCHAR2(100) := GET_APPLICATION_PROPERTY(CURRENT_FORM_NAME);
   v_cont                        NUMBER;
   v_contm                       NUMBER;
   v_item                        VARCHAR2(100);
   v_tipo                        VARCHAR2(50);
   v_ban                         BOOLEAN;
   v_banb                        NUMBER;
   v_bani                        NUMBER;
   v_banv                        NUMBER;
   v_bang                        BOOLEAN;
   v_dato                        NUMBER;
   v_colb                        NUMBER;
   v_coli                        NUMBER;
   v_colv                        NUMBER;
   v_colg                        VARCHAR2(200);
   v_colg1                       VARCHAR2(200);
   v_colgu                       NUMBER;
   vno_bien                      BIENES.NO_BIEN%TYPE;
   vdescripcion                  BIENES.DESCRIPCION%TYPE;
   vestatus                      BIENES.ESTATUS%TYPE;
   vno_exp_asociado              BIENES.NO_EXP_ASOCIADO%TYPE;
   vno_expediente                BIENES.NO_EXPEDIENTE%TYPE;
   vcantidad                     BIENES.CANTIDAD%TYPE;
   vno_delegacion                BIENES.NO_DELEGACION%TYPE;
   vno_subdelegacion             BIENES.NO_SUBDELEGACION%TYPE;
   videntificador                BIENES.IDENTIFICADOR%TYPE;
   vno_volante                   BIENES.NO_VOLANTE%TYPE;
   vno_bienn                     BIENES.NO_BIEN%TYPE;
   vestatusn                     BIENES.ESTATUS%TYPE;
   vno_bienc                     BIENES.NO_BIEN%TYPE;
   vno_clasif_bien               BIENES.NO_CLASIF_BIEN%TYPE;
   vdescripciong                 CONCEPTO_GASTO.DESCRIPCION%TYPE;
   vcve_proceso                  COMER_EVENTOS.CVE_PROCESO%TYPE;
   expidentificador              ESTATUS_X_PANTALLA.IDENTIFICADOR%TYPE;
   vno_clasif_bienn              CAT_SSSUBTIPO_BIEN.NO_CLASIF_BIEN%TYPE;
   vno_bien_padre_parcializacion BIENES.NO_BIEN_PADRE_PARCIALIZACION%TYPE;
   vingreso                      NUMBER;
   vgasto                        NUMBER;
   vdgasto                       NUMBER;
   vtotgasto                     NUMBER;
   viva                          NUMBER;
   valida_num                    NUMBER;
   v_ind_nume                    NUMBER;
   v_color                       varchar2(30);
   v_acta_ok                     BOOLEAN;
errtxt VARCHAR2(80);
BEGIN
   v_banb := 0;
   v_bani := 0;
   v_banv := 0;
   v_ban := FALSE;
   v_bang := FALSE;
   v_colb := 0;
   v_coli := 0;
   v_colv := 0;
   v_colg := NULL;
   FOR v_cont IN 1..28 LOOP
      v_item := ':TIP'||TO_CHAR(v_cont);
      v_tipo := name_in(v_item);
      IF v_tipo = 'B' THEN
         v_colb := v_cont;
         v_banb := v_banb+1;
      ELSIF v_tipo = 'I' THEN
         v_coli := v_cont;
         v_bani := v_bani+1;
      ELSIF v_tipo = 'G' THEN
         v_item := ':GAS'||TO_CHAR(v_cont);
         v_dato := name_in(v_item);
         IF v_dato IS NULL THEN
            v_bang := TRUE;
         ELSE
            v_colg := v_colg||TO_CHAR(v_cont)||',';
         END IF;
      ELSIF v_tipo = 'V' THEN
         v_colv := v_cont;
         v_banv := v_banv+1;
      END IF;
   END LOOP;
   IF v_banb = 0 THEN
      LIP_MENSAJE('Se debe especificar la columna del No. de Bien','A');
      v_ban := TRUE;
   ELSIF v_banb > 1 THEN
      LIP_MENSAJE('Se especificó más de una columna del No. de Bien','A');
      v_ban := TRUE;
   END IF;
   IF v_bani = 0 THEN
      LIP_MENSAJE('Se debe especificar la columna del Ingreso neto','A');
      v_ban := TRUE;
   ELSIF v_bani > 1 THEN
      LIP_MENSAJE('Se especificó más de una columna del Ingreso neto','A');
      v_ban := TRUE;
   END IF;
   IF v_bang THEN
      LIP_MENSAJE('No se especificó el Concepto de Gasto en al menos una columna','A');
      v_ban := TRUE;
   END IF;
   IF v_banv = 0 THEN
      LIP_MENSAJE('Se debe especificar la columna del IVA','A');
      v_ban := TRUE;
   ELSIF v_banv > 1 THEN
      LIP_MENSAJE('Se especificó más de una columna del IVA','A');
      v_ban := TRUE;
   END IF;
   IF v_ban THEN
      RAISE FORM_TRIGGER_FAILURE;
   END IF;
--   LIP_MENSAJE(v_colg,'A');
   GO_BLOCK('BLK_BIENES');
   CLEAR_BLOCK;
   GO_BLOCK('BLK_GASTOS');
   CLEAR_BLOCK;
   GO_BLOCK('BLK_PREVIEW');
   FIRST_RECORD;
   v_cont := 0;
   v_contm := 0;
   LOOP
      v_item := ':COL'||TO_CHAR(v_colb);
      v_tipo := name_in(v_item);
      IF v_tipo IS NOT NULL THEN
         BEGIN
            vno_bien := TO_NUMBER(REPLACE(v_tipo,',','.'),'99999999999999.9999999999');
--LIP_MENSAJE('-'||v_tipo||'-','A');
--lip_mensaje('antes:'||to_char(vno_bien),'A');
            BEGIN
               SELECT descripcion, estatus, no_exp_asociado, no_expediente, cantidad,
                      no_delegacion, no_subdelegacion, identificador, no_volante, no_clasif_bien, no_bien_padre_parcializacion
                 INTO vdescripcion, vestatus, vno_exp_asociado, vno_expediente, vcantidad,
                      vno_delegacion, vno_subdelegacion, videntificador, vno_volante, vno_clasif_bien, vno_bien_padre_parcializacion
                 FROM BIENES
                WHERE no_bien = vno_bien;
-- *** AQUI VOY *** FALTA MOVER TODO CUANDO NO TENGA ACTA ---
-- aqui voy a meter la validación de que no exista numerario --
-- modificación para presentar registro con numerario pero no se genera info 160407 JAC
--               valida_num := 0; ojo esto validaba
               vno_bienn := NULL;
               vcve_proceso := NULL;
               BEGIN
                  SELECT no_bien, estatus
                    INTO vno_bienn, vestatusn
                    FROM BIENES
                   WHERE no_bien_referencia = vno_bien
                     AND no_bien <> vno_bien;
                  IF vestatusn <> 'ADM' THEN
                     v_ind_nume := 0;
                     v_contm := v_contm+1;
                     vcve_proceso := 'Numerario <> ADM.';
                  ELSE
                     BEGIN
                        SELECT DISTINCT no_bien
                          INTO vno_bienc
                          FROM MOVIMIENTOS_CUENTAS
                         WHERE no_bien = vno_bienn;
                        v_ind_nume := 3;
                        v_contm := v_contm+1;
                        vcve_proceso := 'Numerario conciliado.';
                     EXCEPTION
                     		 WHEN OTHERS THEN
                           v_ind_nume := 2;
                     END;
                  END IF;
                  vcve_proceso := PUF_BUSCA_EVENTO(vno_bien);
               EXCEPTION
                  WHEN TOO_MANY_ROWS THEN
                     v_ind_nume := 0;
                     v_contm := v_contm+1;
                     vcve_proceso := 'Más de una ref.';
                  WHEN OTHERS THEN
-- Validación de transferente convertido a numerario -- 040408 JAC --
                     IF videntificador = 'TRANS' AND vestatus IN ('CNE','CBD','CDS','CNS','CNR') THEN
                        v_ind_nume := 2;
                        vcve_proceso := PUF_BUSCA_EVENTO(vno_bien);
                     ELSE
                        v_ind_nume := 1;
                        IF videntificador = 'TRANS' THEN
                           v_ind_nume := 4;
                        END IF;	
-- Validación para verificar que el bien esté en acta de entrega recepción -- 04-04-08 JAC --
                        v_acta_ok := PUF_VALIDA_ACTA_RECEP(vno_bien);
                        IF NOT v_acta_ok AND NVL(vno_bien_padre_parcializacion,0) > 0 THEN
                           v_acta_ok := PUF_VALIDA_ACTA_RECEP(vno_bien_padre_parcializacion);
                        END IF;
                        IF NOT v_acta_ok THEN
                           v_ind_nume := 5;
                           v_contm := v_contm+1;
                           vcve_proceso := 'Bien sin Acta.';
                        END IF;
                     END IF;
               END;
               v_item := ':COL'||TO_CHAR(v_coli);
               v_tipo := name_in(v_item);
               IF v_tipo IS NOT NULL THEN
                  BEGIN
                     vingreso := ROUND(TO_NUMBER(REPLACE(v_tipo,',','.'),'99999999999999.9999999999'),2);
                     v_item := ':COL'||TO_CHAR(v_colv);
                     v_tipo := name_in(v_item);
                     IF v_tipo IS NOT NULL THEN
                        BEGIN
                           viva := ROUND(TO_NUMBER(REPLACE(v_tipo,',','.'),'99999999999999.9999999999'),2);
                           v_colg1 := v_colg;
                           vtotgasto := 0;
                           WHILE v_colg1 IS NOT NULL LOOP
                              v_colgu := SUBSTR(v_colg1,1,INSTR(v_colg1,',',1)-1);
                              v_item := ':COL'||v_colgu;
                              v_tipo := name_in(v_item);
                              BEGIN
                                 vgasto := NVL(ROUND(TO_NUMBER(REPLACE(v_tipo,',','.'),'99999999999999.9999999999'),2),0);
                                 v_item := ':GAS'||v_colgu;
                                 vdgasto := name_in(v_item);
                                 vtotgasto := vtotgasto+vgasto;
                                 v_item := ':GAD'||v_colgu;
                                 vdescripciong := name_in(v_item);
                                 IF vdescripciong IS NULL THEN
                                    BEGIN
                                       SELECT descripcion
                                         INTO vdescripciong
                                         FROM CONCEPTO_GASTO
                                        WHERE no_concepto_gasto = vdgasto;
                                    EXCEPTION
                                       WHEN OTHERS THEN
                                          vdescripciong := 'Gasto: '||TO_CHAR(vdgasto);
                                    END;
                                 END IF;
                                 GO_BLOCK('BLK_GASTOS');
                                 IF NOT FORM_SUCCESS THEN
                                    RAISE Form_Trigger_Failure;
                                 END IF;
                                 IF :BLK_GASTOS.NO_BIEN IS NOT NULL THEN
                                    CREATE_RECORD;
                                 END IF;
                                 :BLK_GASTOS.NO_BIEN := vno_bien;
                                 :BLK_GASTOS.NO_CONCEPTO_GASTO := vdgasto;
                                 :BLK_GASTOS.IMPORTE := vgasto;
                                 :BLK_GASTOS.DESCRIPCION := vdescripciong;
                                 :BLK_GASTOS.ESTATUS := vestatus;
                                 :BLK_GASTOS.TIPO := 'E';
                                 GO_BLOCK('BLK_PREVIEW');
                              EXCEPTION
                                 WHEN OTHERS THEN
                                    NULL;
                              END;
                              v_colg1 := SUBSTR(v_colg1,INSTR(v_colg1,',',1)+1);
                           END LOOP;
                           GO_BLOCK('BLK_GASTOS');
                           IF :BLK_GASTOS.NO_BIEN IS NOT NULL THEN
                              CREATE_RECORD;
                           END IF;
                           :BLK_GASTOS.NO_BIEN := vno_bien;
                           :BLK_GASTOS.NO_CONCEPTO_GASTO := 0;
                           :BLK_GASTOS.IMPORTE := viva;
                           :BLK_GASTOS.DESCRIPCION := 'I.V.A.';
                           :BLK_GASTOS.ESTATUS := vestatus;
                           :BLK_GASTOS.TIPO := 'I';
                           GO_BLOCK('BLK_BIENES');
                           IF :BLK_BIENES.NO_BIEN IS NOT NULL THEN
                              CREATE_RECORD;
                           END IF;
                           :BLK_BIENES.NO_BIEN := vno_bien;
                           :BLK_BIENES.DESCRIPCION := vdescripcion;
                           :BLK_BIENES.ESTATUS := vestatus;
                           :BLK_BIENES.INGRESO := vingreso+vtotgasto-viva;
                           :BLK_BIENES.GASTO := vtotgasto;
                           :BLK_BIENES.IVA := viva;
                           :BLK_BIENES.VALOR_AVALUO := vingreso;
                           :BLK_BIENES.NO_EXP_ASOCIADO := vno_exp_asociado;
                           :BLK_BIENES.NO_EXPEDIENTE := vno_expediente;
                           :BLK_BIENES.CANTIDAD := vcantidad;
                           :BLK_BIENES.NO_DELEGACION := vno_delegacion;
                           :BLK_BIENES.NO_SUBDELEGACION := vno_subdelegacion;
                           :BLK_BIENES.IDENTIFICADOR := videntificador;
                           :BLK_BIENES.NO_VOLANTE := vno_volante;
                           :BLK_BIENES.IND_NUME := v_ind_nume;
--*** cambio atributos para v_ind_nume diferente de 1 
                           IF v_ind_nume <> 1 THEN
                              IF v_ind_nume = 0 THEN
                                 v_color := 'VA_ROJO';
                              ELSIF v_ind_nume = 2 THEN
                                 v_color := 'VA_VERDE';
                              ELSIF v_ind_nume = 4 THEN
                                 v_color := 'VA_CYAN';
                              ELSIF v_ind_nume = 5 THEN
                                 v_color := 'VA_NARANJA';
                              ELSE
                                 v_color := 'VA_AMARILLO';
                              END IF;
                              :BLK_BIENES.NO_BIEN_NUME := vno_bienn;
                              :BLK_BIENES.CVE_PROCESO := vcve_proceso;
                              Set_Item_Instance_Property( 'BLK_BIENES.NO_BIEN', CURRENT_RECORD,VISUAL_ATTRIBUTE,v_color);
                              Set_Item_Instance_Property( 'BLK_BIENES.NO_BIEN_NUME', CURRENT_RECORD,VISUAL_ATTRIBUTE,v_color);
                              Set_Item_Instance_Property( 'BLK_BIENES.DESCRIPCION', CURRENT_RECORD,VISUAL_ATTRIBUTE,v_color);
                              Set_Item_Instance_Property( 'BLK_BIENES.CVE_PROCESO', CURRENT_RECORD,VISUAL_ATTRIBUTE,v_color);
                              Set_Item_Instance_Property( 'BLK_BIENES.ESTATUS', CURRENT_RECORD,VISUAL_ATTRIBUTE,v_color);
                              Set_Item_Instance_Property( 'BLK_BIENES.INGRESO', CURRENT_RECORD,VISUAL_ATTRIBUTE,v_color);
                              Set_Item_Instance_Property( 'BLK_BIENES.GASTO', CURRENT_RECORD,VISUAL_ATTRIBUTE,v_color);
                              Set_Item_Instance_Property( 'BLK_BIENES.IVA', CURRENT_RECORD,VISUAL_ATTRIBUTE,v_color);
                              Set_Item_Instance_Property( 'BLK_BIENES.VALOR_AVALUO', CURRENT_RECORD,VISUAL_ATTRIBUTE,v_color);
                           END IF;
                           GO_BLOCK('BLK_PREVIEW');
                           v_cont := v_cont+1;
                        EXCEPTION
                           WHEN OTHERS THEN
                              v_contm := v_contm+1;
                        END;
                     ELSE
                        v_contm := v_contm+1;
                     END IF;
                  EXCEPTION
                     WHEN OTHERS THEN
                        v_contm := v_contm+1;
                  END;
               ELSE
                  v_contm := v_contm+1;
               END IF;
            EXCEPTION
               WHEN OTHERS THEN
                  v_contm := v_contm+1;
            END;
         EXCEPTION
            WHEN OTHERS THEN
               v_contm := v_contm+1;
         END;
      ELSE
         v_contm := v_contm+1;
      END IF;
      :T_REG_PROCESADOS := v_cont+v_contm;
      :T_REG_CORRECTOS := v_cont;
      :T_REG_ERRONEOS := v_contm;
      SYNCHRONIZE;
      EXIT WHEN :system.Last_record = 'TRUE';
      NEXT_RECORD; 
   END LOOP;	
   FIRST_RECORD;
   GO_BLOCK('BLK_GASTOS');
   FIRST_RECORD;   
   GO_BLOCK('BLK_BIENES');
   FIRST_RECORD;
EXCEPTION
   WHEN OTHERS THEN
      NULL;
END;