IF :blk_toolbar.toolbar_escritura != 'S' THEN
	 LIP_MENSAJE('No tiene permiso de escritura para ejecutar el cambio de numerario','C');
	 RAISE FORM_TRIGGER_FAILURE;
END IF;		


/*IF :blk_bie.no_bien IS NULL AND :MASIVO = 'N' THEN
   LIP_MENSAJE('Debe especificar el bien que se quiere cambiar a numerario','S');
	 RAISE FORM_TRIGGER_FAILURE;
END IF;*/--VALIDA MASIVO LIRH

IF :blk_bie.no_bien IS NULL AND :MASIVO = 'N' THEN --VALIDA MASIVO LIRH

	 LIP_MENSAJE('Debe especificar el bien que se quiere cambiar a numerario','S');
	 RAISE FORM_TRIGGER_FAILURE;

ELSIF :BLK_BIE_NUM_MASIV.no_bien IS NULL AND :MASIVO = 'S' THEN --VALIDA MASIVO LIRH
--IF :blk_bie.no_bien IS NULL AND :MASIVO = 'N' THEN
	 LIP_MENSAJE('Debe cargar los bienes que desea cambiar a numerario','S');
	 RAISE FORM_TRIGGER_FAILURE;
ELSIF :blk_bie.no_bien IS NULL AND :BLK_BIE_NUM_MASIV.no_bien IS NULL THEN
	LIP_MENSAJE('No hay bienes para cambiar a numerario','S');
	 RAISE FORM_TRIGGER_FAILURE;
END IF;
/*IF :importevta IS NULL THEN
	LIP_MENSAJE('Debe especificar el importe para el numerario','S');
	GO_ITEM('ti_importe_new');
	RAISE FORM_TRIGGER_FAILURE;
END IF;*/
--***** 
IF :BLK_CONTROL.CHK_MOVBAN = 'SI' THEN
   IF :ti_banco_new IS NULL THEN
      LIP_MENSAJE('Debe especificar el banco','S');
      GO_ITEM('ti_banco_new');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;
   -- este dato se rellena con la columna NO_MOVIMIENTO con el select
--    SELECT FEC_MOVIMIENTO, DEPOSITO, FOLIO_FICHA, NO_MOVIMIENTO, NO_CUENTA, CATEGORIA FROM MOVIMIENTOS_CUENTAS
-- WHERE ES_FICHA_DEPOSITO = 'S'
-- AND NO_BIEN IS NULL
-- AND NO_CUENTA = :BLK_CONTROL.DI_NO_CUENTA_DEPOSITO
-- al llamar a lovDepositos el cual se carga cuando da click en fecha en la seccion de depositos

   IF :di_no_movimiento IS NULL THEN
      LIP_MENSAJE('No ha seleccionado debidamente del deposito que ampara el cambio a numerario','S');
      GO_ITEM('ti_importe_new');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;
/*ELSE
   :TI_BANCO_NEW := NULL;
   :DI_BANCO_NEW := NULL;
   :DI_CUENTA_NEW := NULL;
   :DI_MONEDA_NEW := 'MN';
   :TI_FECHA_NEW := NULL;
   :TI_FICHA_NEW := NULL;*/
END IF;
--*****
IF :BLK_CONTROL.TIPO_CONV IS NULL THEN
	LIP_MENSAJE('No ha seleccionado el tipo de conversión','S');
	GO_ITEM('BLK_CONTROL.TIPO_CONV');
	RAISE FORM_TRIGGER_FAILURE;
END IF;

---H---
/*IF :BLK_CONTROL.TIPO_CONV = 'CNE1' THEN 
	LIP_MENSAJE('Debe especificar el IVA','S');
	GO_ITEM('BLK_CONTROL.PORC1')
END IF;*/

IF :MASIVO = 'S' THEN --- NUMERARIO MASIVO LIRH 16012012
   GO_BLOCK('BLK_BIEN_GEN_MASIV');
   CLEAR_BLOCK(NO_VALIDATE);	 
   PUP_VALIDA_MASIV;
ELSE 
   IF :DI_MONEDA_NEW IS NULL AND PUP_VALIDANUME(:blk_bie.no_bien)= 'S' THEN
      LIP_MENSAJE('Debe especificar el tipo de moneda','S');									
      GO_ITEM('DI_MONEDA_NEW');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;																																		---CAMBIO DIVISAS

   IF (PUP_VALIDANUME(:blk_bie.no_bien)= 'S' AND :BLK_CONTROL.TIPO_CONV not in ('CNE','BBB')) OR 
      (PUP_VALIDANUME(:blk_bie.no_bien)= 'N' AND :BLK_CONTROL.TIPO_CONV = 'CNE') THEN
	    LIP_MENSAJE('El tipo de conversión seleccionado no es permitido para este bien.','S');
	    GO_ITEM('TIPO_CONV');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;																																			---CAMBIO DIVISAS

   IF :importevta IS NULL OR :importevta=0 THEN 
	    IF LIF_MENSAJE_SI_NO('El nuevo bien se generara con un precio de venta de 1. ¿Desea continuar?') = 'S' THEN
		     IF LIF_MENSAJE_SI_NO('¿Seguro que desea cambiar el bien a numerario?') = 'S' THEN
	  --:importevta:=1;
   		      PUP_CREA_BIEN;
		     END IF;
	     ELSE
		     NULL;
	     END IF;
   ELSE
	   	IF LIF_MENSAJE_SI_NO('¿Seguro que desea cambiar el bien a numerario?') = 'S' THEN
		   PUP_CREA_BIEN;
		   END IF;
   END IF;

END IF;

----------

/*
IF LIF_MENSAJE_SI_NO('¿Seguro que desea cambiar el bien a numerario?') = 'S' THEN
	PUP_CREA_BIEN;
END IF;*/






PROCEDURE PUP_CREA_BIEN IS
  vn_bien_new 			bienes.no_bien%TYPE;
  vc_pantalla 			VARCHAR2(100) := GET_APPLICATION_PROPERTY(CURRENT_FORM_NAME);
  v_clasif_bien			NUMBER;
	v_sumagasto				NUMBER := 0;
	vNO_MOVIMIENTO_n	MOVIMIENTOS_CUENTAS.NO_MOVIMIENTO%TYPE;
  v_importen        NUMBER := 0;
  v_importe         NUMBER := 0;
	v_importec        VARCHAR2(20);
	v_importenc       VARCHAR2(20);
  v_etiqueta_num    ETIQXCLASIF.NO_ETIQUETA%TYPE;
  v_impor						NUMBER :=0;
  v_tot_gasto			  NUMBER := 0;
  V_CMOVI						MOVIMIENTOS_CUENTAS.NO_MOVIMIENTO%TYPE;
  CONCIL						VARCHAR2(15);
  V_CREGI						MOVIMIENTOS_CUENTAS.NO_REGISTRO%TYPE;
  V_COMENTARIO			BIENES.DESCRIPCION%TYPE;
BEGIN
	--H--
	IF :blk_bie.importevta IS NULL or :blk_bie.importevta<=0 THEN
		:blk_bie.importevta:=1;
	END IF;
	
	IF :BLK_CONTROL.TIPO_CONV = 'CNE1' THEN
		:BLK_CONTROL.TIPO_CONV:='CNE';
	END IF;
	---------
	GO_BLOCK('BLK_CTR');
	FIRST_RECORD;
	IF :BLK_CTR.ID_GASTO IS NOT NULL THEN
		LOOP
			BEGIN
				v_sumagasto := NVL(v_sumagasto,0) + NVL(:BLK_CTR.IMPORTE,0);
			EXCEPTION	WHEN OTHERS THEN
                			NULL;
			END;
		  EXIT WHEN :system.Last_record = 'TRUE';
    	NEXT_RECORD; 
		END LOOP;	
	END IF;
	FOR reg IN (SELECT	estatus_final, estatus_nuevo_bien, accion, est.proceso_ext_dom
  	            FROM	estatus_x_pantalla est
  	           WHERE	est.cve_pantalla = vc_pantalla
  	             AND	est.estatus      = :blk_bie.estatus
  	             AND  est.identificador = :blk_bie.identificador
  	             AND  est.proceso_ext_dom  = :blk_bie.proceso_ext_dom) --AKCO 17/09/2009
  	             
	LOOP
--      IF :BLK_CONTROL.TIPO_CONV <> 'BBB' THEN
         /*v_importe := NVL(:blk_bie.importevta,0)+NVL(:blk_bie.ivavta,0);
         v_importen := NVL(v_importe,0)-(NVL(:blk_bie.comision,0)+NVL(:blk_bie.ivacom,0))-NVL(v_sumagasto,0);*/
         v_importe := NVL(:blk_bie.importevta,0)+NVL(:blk_bie.ivavta,0);
      	 --v_tot_gasto := NVL(v_sumagasto,0)+(NVL(:blk_bie.comision,0)+NVL(:blk_bie.ivacom,0));
      	 v_tot_gasto := NVL(v_sumagasto,0)+(NVL(:blk_bie.comision,0)+NVL(:blk_bie.ivacom,0)+NVL(:blk_bie.ivavta,0));--H--
         v_impor := :blk_bie.importevta;
         v_importen := NVL(v_importe,0)-(NVL(:blk_bie.comision,0)+NVL(:blk_bie.ivacom,0))-NVL(v_sumagasto,0);
         
         IF TRUNC(v_importe) <> v_importe THEN
            v_importec := RTRIM(LTRIM(TO_CHAR(v_importe,'999999999.99')));
         ELSE
            v_importec := RTRIM(LTRIM(TO_CHAR(v_importe,'999999999')));
         END IF;
         IF TRUNC(v_importen) <> v_importen THEN
            v_importenc := RTRIM(LTRIM(TO_CHAR(v_importen,'999999999.99')));
         ELSE
            v_importenc := RTRIM(LTRIM(TO_CHAR(v_importen,'999999999')));
         END IF;
         
         --LIP_MENSAJE (V_IMPOR||'    '||v_tot_gasto,'A');
     IF :BLK_BIE.IDENTIFICADOR!='TRANS' THEN
         begin
             SELECT seq_bienes.nextval
              INTO vn_bien_new
              FROM dual;
          end;
       END IF; 

IF :BLK_CONTROL.TIPO_CONV = 'BBB' THEN -- ALEDESMA SOLICITADO X GMURIAS
V_COMENTARIO := SUBSTR('PAGO PARCIAL POR SINIESTRO GENERANDO EL BIEN HIJO NO. '||TO_CHAR(vn_bien_new)||' CON ESTATUS '||:BLK_BIE.ESTATUS||', '||:BLK_CONTROL.COMENTARIO||' , '||:BLK_BIE.DESCRIPCION,1,1200);
         UPDATE BIENES													-- Actualizacion del bien en su estatus al mismo
            SET ESTATUS = :BLK_BIE.ESTATUS,
                DESCRIPCION = V_COMENTARIO,
                val40 = :BLK_CONTROL.di_moneda_new,
                val41 = v_importec,
                val42 = v_importenc,
                val43 = :ti_banco_new,
                val44 = TO_CHAR(:ti_fecha_new,'dd-mm-yyyy'),
                val45 = :BLK_CONTROL.di_cuenta_new,
                val46 = :blk_bie.importevta,
                val47 = :blk_bie.ivavta,
                val48 = :blk_bie.comision,
                val49 = :blk_bie.ivacom,
                val50 = v_sumagasto,
                proceso_ext_dom = reg.proceso_ext_dom --AKCO 17/09/09
          WHERE NO_BIEN = :blk_bie.no_bien;
         INSERT INTO historico_estatus_bien 			-- Insertar en el historico el cambio de estatus de este bien
         (no_bien, estatus, fec_cambio, usuario_cambio, motivo_cambio, programa_cambio_estatus, proceso_ext_dom)--AKCO 17/09/09
         VALUES          			
         (:blk_bie.no_bien,:BLK_BIE.ESTATUS,sysdate,:toolbar_usuario,'Cambio numerario', vc_pantalla, reg.proceso_ext_dom); --AKCO 17/09/09


ELSIF :BLK_CONTROL.TIPO_CONV = 'CNR' THEN
	
	 V_COMENTARIO :=  SUBSTR(:BLK_BIE.DESCRIPCION,1,1250);    
     begin
         UPDATE BIENES                                                    -- Actualizacion del bien A CNR
            SET ESTATUS = :BLK_CONTROL.TIPO_CONV,
                DESCRIPCION = V_COMENTARIO,
                val40 = :BLK_CONTROL.di_moneda_new,
                val41 = v_importec,
                val42 = v_importenc,
                val43 = :ti_banco_new,
                val44 = TO_CHAR(:ti_fecha_new,'dd-mm-yyyy'),
                val45 = :BLK_CONTROL.di_cuenta_new,
                val46 = :blk_bie.importevta,
                val47 = :blk_bie.ivavta,
                val48 = :blk_bie.comision,
                val49 = :blk_bie.ivacom,
                val50 = v_sumagasto,
                proceso_ext_dom = reg.proceso_ext_dom --AKCO 17/09/09
          WHERE NO_BIEN = :blk_bie.no_bien;
           INSERT INTO historico_estatus_bien             -- Insertar en el historico el cambio de estatus de este bien
         --(no_bien, estatus, fec_cambio, usuario_cambio, motivo_cambio, programa_cambio_estatus)
         (no_bien, estatus, fec_cambio, usuario_cambio, motivo_cambio, programa_cambio_estatus, proceso_ext_dom)--AKCO 17/09/09
         VALUES                      
         --(:blk_bie.no_bien,:BLK_CONTROL.TIPO_CONV,sysdate,:toolbar_usuario,'Cambio numerario', vc_pantalla);
         (:blk_bie.no_bien,:BLK_CONTROL.TIPO_CONV,sysdate,:toolbar_usuario,'Cambio numerario', vc_pantalla, reg.proceso_ext_dom); --AKCO 17/09/09
     lip_commit_silencioso;
     LIP_MENSAJE('Proceso Terminado, no se generó numerario por ser un bien Transferente','A');
      exception when others then
         LIP_MENSAJE('sqlerrm','A');
          raise form_trigger_failure;
        end;  


ELSE

	V_COMENTARIO := SUBSTR('CONV. A NUM. GENERANDO EL BIEN HIJO NO. '||TO_CHAR(vn_bien_new)||' '||:blk_bie.descripcion,1,1250);	
         UPDATE BIENES													-- Actualizacion del bien anterior a el estatus CNE
            SET ESTATUS = :BLK_CONTROL.TIPO_CONV,
                DESCRIPCION = V_COMENTARIO,
                val40 = :BLK_CONTROL.di_moneda_new,
                val41 = v_importec,
                val42 = v_importenc,
                val43 = :ti_banco_new,
                val44 = TO_CHAR(:ti_fecha_new,'dd-mm-yyyy'),
                val45 = :BLK_CONTROL.di_cuenta_new,
                val46 = :blk_bie.importevta,
                val47 = :blk_bie.ivavta,
                val48 = :blk_bie.comision,
                val49 = :blk_bie.ivacom,
                val50 = v_sumagasto,
                proceso_ext_dom = reg.proceso_ext_dom --AKCO 17/09/09
          WHERE NO_BIEN = :blk_bie.no_bien;
          
         INSERT INTO historico_estatus_bien 			-- Insertar en el historico el cambio de estatus de este bien
         --(no_bien, estatus, fec_cambio, usuario_cambio, motivo_cambio, programa_cambio_estatus)
         (no_bien, estatus, fec_cambio, usuario_cambio, motivo_cambio, programa_cambio_estatus, proceso_ext_dom)--AKCO 17/09/09
         VALUES          			
         --(:blk_bie.no_bien,:BLK_CONTROL.TIPO_CONV,sysdate,:toolbar_usuario,'Cambio numerario', vc_pantalla);
         (:blk_bie.no_bien,:BLK_CONTROL.TIPO_CONV,sysdate,:toolbar_usuario,'Cambio numerario', vc_pantalla, reg.proceso_ext_dom); --AKCO 17/09/09





END IF;     
         IF :blk_bie.identificador <> 'TRANS' THEN
            :blk_bie.cantidad :=1;
            
            --IF :BLK_BIE.DI_MONEDA_NEW = 'MN' THEN
            IF :BLK_CONTROL.DI_MONEDA_NEW = 'MN' AND PUP_VALIDANUME(:blk_bie.no_bien)= 'N' THEN
               v_clasif_bien := 1424;
            ELSE
               v_clasif_bien := 1426;
            END IF;
            
            IF :BLK_CONTROL.TIPO_CONV= 'CNE' THEN --H--
               v_clasif_bien := 1427;
            END IF;
            
begin
            SELECT MIN(NO_ETIQUETA)
              INTO v_etiqueta_num
              FROM ETIQXCLASIF
             WHERE no_clasif_bien = v_clasif_bien;
end;             
            INSERT INTO bienes 	-- Insertar el nuevo bien, el bien numerario
            (no_bien,					descripcion,					   no_exp_asociado,						
            val1,							val2,									   val3, 							no_clasif_bien,
            no_expediente,     no_bien_referencia,		   valor_avaluo, 			estatus,            	
            cantidad,					val4,									   val5,              val6,									
            no_delegacion,  		no_subdelegacion,   	   identificador,			val9,
            val10,							val11,								   val12,							val13,
            cve_moneda_avaluo, no_etiqueta,             no_volante,        unidad,
            proceso_ext_dom-- AKCO 17/09/09
            )      
            VALUES 
            (vn_bien_new,SUBSTR('CONV. A NUM. DEL BIEN '||TO_CHAR(:blk_bie.no_bien)||' '||:blk_bie.descripcion,1,1250), :blk_bie.no_exp_asociado,	
            :BLK_CONTROL.di_moneda_new, v_impor,	              :BLK_CONTROL.ti_ficha_new,	             v_clasif_bien,
            :blk_bie.no_expediente, :blk_bie.no_bien,          v_importec,                          reg.estatus_nuevo_bien,
            1 ,	     :ti_banco_new,				     TO_CHAR(:ti_fecha_new,'dd-mm-yyyy'), :BLK_CONTROL.di_cuenta_new,
            :blk_bie.no_delegacion, :blk_bie.no_subdelegacion, :blk_bie.identificador,              :blk_bie.importevta,
            :blk_bie.ivavta,		     :blk_bie.comision,		      :blk_bie.ivacom,			               v_tot_gasto,
            :BLK_CONTROL.di_moneda_new, v_etiqueta_num,            :blk_bie.no_volante,                 'PIEZA',
            reg.proceso_ext_dom -- AKCO 17/09/09
            );
            
          ----H---  
           BEGIN 
           IF 		:ti_fecha_new 	IS NOT NULL 
           		AND	:ti_banco_new IS NOT NULL 
           		AND	:BLK_CONTROL.di_cuenta_new IS NOT NULL 
           		AND	:BLK_CONTROL.di_moneda_new  IS NOT NULL 	
           THEN
           		BEGIN
            		SELECT  MOV.NO_MOVIMIENTO, MOV.NO_REGISTRO
         								INTO		V_CMOVI,V_CREGI
												FROM    movimientos_cuentas mov, cuentas_bancarias   cta 
												WHERE   MOV.fec_movimiento = :ti_fecha_new
												AND     MOV.DEPOSITO = :blk_bie.importevta
												AND     cta.cve_banco = :ti_banco_new
												AND     cta.cve_cuenta = :BLK_CONTROL.di_cuenta_new
												AND     cta.cve_moneda = :BLK_CONTROL.di_moneda_new
												AND     MOV.NO_BIEN IS NULL;
								EXCEPTION
  									WHEN NO_DATA_FOUND THEN
  										V_CMOVI:=NULL;						
								END;						
							
							IF V_CMOVI IS NOT NULL THEN
								  UPDATE	MOVIMIENTOS_CUENTAS 
									SET			NO_BIEN =vn_bien_new, NO_EXPEDIENTE=:blk_bie.no_expediente
									WHERE		NO_MOVIMIENTO = V_CMOVI
									AND			NO_REGISTRO = V_CREGI;
									CONCIL:='CONCILIADO';
							END IF;
           END IF;
           END;
					----------------		

            INSERT INTO historico_estatus_bien -- inserta en el historico el nuevo bien
            --(no_bien,			estatus,	fec_cambio, usuario_cambio, 	motivo_cambio,			programa_cambio_estatus)
            (no_bien, estatus, fec_cambio, usuario_cambio, motivo_cambio, programa_cambio_estatus, proceso_ext_dom)--AKCO 17/09/09
            VALUES 
            --(vn_bien_new, reg.estatus_nuevo_bien,		sysdate,	:toolbar_usuario, 'Cambio numerario', vc_pantalla);
            (vn_bien_new, reg.estatus_nuevo_bien,		sysdate,	:toolbar_usuario, 'Cambio numerario', vc_pantalla, reg.proceso_ext_dom); --AKCO 17/09/09

            INSERT INTO cambio_numerario
            (no_bien_original, 	no_bien_numerario, 	usuario, 					fec_cambio, 	estatus_final, 		estatus_nuevo_bien) 
            VALUES 
            (:blk_bie.no_bien,	vn_bien_new,				:toolbar_usuario,	SYSDATE,:BLK_CONTROL.TIPO_CONV,reg.estatus_nuevo_bien);
           
--
            -- copia registro de relación de documentos -- JAC 231208 --

            INSERT INTO BIENES_REL_DOCUMS (NO_BIEN,ACTA_ACIRDES,ACTA_ACIRDEV,ACTA_ACIRVEN,
                                           ACTA_ACTCIRCU,ACTA_CONSENTR,ACTA_CONSVEN,ACTA_CONVERSION,
                                           ACTA_DECOMISO,ACTA_DESTINO,ACTA_DESTRUCCION,ACTA_DEVOLUCION,
                                           ACTA_DONACION,ACTA_ENTREGA,ACTA_EVENCOMER,ACTA_EVENDEST,
                                           ACTA_EVENDEV,ACTA_EVENDON,ACTA_EVENTREC,ACTA_POSESION_3R,
                                           ACTA_RECEPCAN,ACTA_SUSPENSION,COMER_LOTE,OFIC_DESAHOGO,
                                           DICTA_ABANDONO,DICTA_DECOMISO,DICTA_DESTINO,DICTA_DESTRUCCION,
                                           DICTA_DEVOLUCION,DICTA_DONACION,DICTA_PROCEDENCIA,DICTA_RESARCIMIENTO,
                                           DON_SOLICITUD)
            SELECT vn_bien_new,ACTA_ACIRDES,ACTA_ACIRDEV,ACTA_ACIRVEN,
                   ACTA_ACTCIRCU,ACTA_CONSENTR,ACTA_CONSVEN,ACTA_CONVERSION,
                   ACTA_DECOMISO,ACTA_DESTINO,ACTA_DESTRUCCION,ACTA_DEVOLUCION,
                   ACTA_DONACION,ACTA_ENTREGA,ACTA_EVENCOMER,ACTA_EVENDEST,
                   ACTA_EVENDEV,ACTA_EVENDON,ACTA_EVENTREC,ACTA_POSESION_3R,
                   ACTA_RECEPCAN,ACTA_SUSPENSION,COMER_LOTE,OFIC_DESAHOGO,
                   DICTA_ABANDONO,DICTA_DECOMISO,DICTA_DESTINO,DICTA_DESTRUCCION,
                   DICTA_DEVOLUCION,DICTA_DONACION,DICTA_PROCEDENCIA,DICTA_RESARCIMIENTO,
                   DON_SOLICITUD
              FROM BIENES_REL_DOCUMS
             WHERE NO_BIEN = :blk_bie.no_bien;                         
            
             -----
            LIP_COMMIT_SILENCIOSO;
         IF :blk_bie.identificador <> 'TRANS' THEN
            LIP_MENSAJE('Proceso Terminado, No. de Bien Generado: '||vn_bien_new||' '||CONCIL,'A');      
         ELSE
            LIP_MENSAJE('Proceso Terminado, no se generó numerario por ser un bien Transferente','A');
         END IF;
 	END IF;
 	END LOOP;
--exit_form;
 		EXCEPTION
         	WHEN OTHERS THEN
         	LIP_MENSAJE(SQLERRM,'A');
END;