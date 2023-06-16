DECLARE 
   v_no_of_gestion M_OFICIO_GESTION.NO_OF_GESTION%TYPE;
   v_no_volante    M_OFICIO_GESTION.NO_VOLANTE%TYPE;
   vc_pantalla   VARCHAR2(100) := GET_APPLICATION_PROPERTY(CURRENT_FORM_NAME);
   EST_ANTERIOR    VARCHAR2(5);
   FECHA_CAMBIO	   VARCHAR2(10);
   FECHA_INSERTO   VARCHAR2(10);
   v_verestatus    number;
   vc_forma_actual VARCHAR2(60);
   VVAL1					 NUMBER(5);
   ATJR						 NUMBER(1);
   PREXDO_ANTERIOR BIENES.PROCESO_EXT_DOM%TYPE;
BEGIN
	 vc_forma_actual := GET_APPLICATION_PROPERTY(CURRENT_FORM_NAME);
   IF :M_OFICIO_GESTION.NO_OF_GESTION IS NULL THEN
      LIP_MENSAJE('No se tiene oficio','S');
      RAISE Form_Trigger_Failure;
   END IF;
   IF :M_OFICIO_GESTION.ESTATUS_OF = 'ENVIADO' THEN 
      LIP_MENSAJE('El oficio ya está enviado, no se puede borrar','S');
      RAISE Form_Trigger_Failure;
   END IF;
   IF :M_OFICIO_GESTION.USUARO_INSERT <> :global.toolbar_usuario THEN
   
      BEGIN
         SELECT COUNT(0)
           INTO ATJR
           FROM SEG_ACCESO_X_AREAS SA,
          			 SEG_USUARIOS SU,
          			 TVALTABLA1 TVL
	   		 WHERE SA.USUARIO = SU.USUARIO
      			 AND NO_DELEGACION = :BLK_TOOLBAR.TOOLBAR_NO_DELEGACION
      			 AND SU.CVE_CARGO = TVL.OTCLAVE
      			 AND TVL.OTCLAVE LIKE 'ATJR%'
      			 AND SA.USUARIO = :global.toolbar_usuario;
      EXCEPTION
      	WHEN OTHERS THEN
      		 ATJR := 0;
      	   LIP_MENSAJE('VERIFICAR PERMISOS','A');
      END;

         IF	ATJR = 0 THEN
      	      LIP_MENSAJE('El Usuario no está autorizado para eliminar el Oficio','A');
             RAISE FORM_TRIGGER_FAILURE;   	 
         END IF;      
	END IF;

   IF INSTR(:M_OFICIO_GESTION.CVE_OF_GESTION,'?') = 0 THEN
   	LIP_MENSAJE('La clave está armada, no puede borrar oficio','S');
      RAISE Form_Trigger_Failure;
   END IF;

   v_no_of_gestion := :M_OFICIO_GESTION.NO_OF_GESTION;
   v_no_volante    := :M_OFICIO_GESTION.NO_VOLANTE;
   IF PUF_MENSAJE_SI_NO('Se borra oficio (Exp.: '||TO_CHAR(:NOTIFICACIONES.NO_EXPEDIENTE)||' No.oficio: '||TO_CHAR(v_no_of_gestion)||')?') = 'N' THEN
      GO_ITEM('NOTIFICACIONES.NO_EXPEDIENTE');
      RAISE FORM_TRIGGER_FAILURE;
   ELSE
      GO_BLOCK('BIENES_OFICIO_GESTION');
      FIRST_RECORD;
      LOOP        
      	IF :PARAMETER.P_DICTAMEN in (25) THEN
      	 	BEGIN      
               SELECT PROCESO_EXT_DOM
                 INTO PREXDO_ANTERIOR
                 FROM HISTORICO_ESTATUS_BIEN
                WHERE NO_REGISTRO = (SELECT MAX(NO_REGISTRO)
                                       FROM HISTORICO_ESTATUS_BIEN
                                      WHERE NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN
                                        AND PROCESO_EXT_DOM != (SELECT PROCESO_EXT_DOM 
                                                          FROM BIENES 
                                                                   WHERE NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN))
               AND NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN;
            EXCEPTION
            WHEN OTHERS THEN
               NULL;               
            END;
            BEGIN
               SELECT TO_DATE(FEC_CAMBIO)
               INTO FECHA_CAMBIO 
               FROM HISTORICO_ESTATUS_BIEN
               WHERE NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN
               AND NO_REGISTRO = (SELECT MAX(NO_REGISTRO)
                                   FROM HISTORICO_ESTATUS_BIEN
                                  WHERE NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN);
            EXCEPTION
               WHEN OTHERS THEN
                NULL;                        
            END;    

            FECHA_INSERTO := TO_DATE(:M_OFICIO_GESTION.FECHA_INSERTO);

            IF FECHA_CAMBIO = FECHA_INSERTO THEN                      	
               :BIENES.PROCESO_EXT_DOM  := PREXDO_ANTERIOR;            
            ELSE 
               :BIENES.PROCESO_EXT_DOM  := :BIENES.PROCESO_EXT_DOM;                   
            END IF;

            EXIT WHEN :system.last_record = 'TRUE';
            NEXT_RECORD;    
      	ELSE
            BEGIN      
              SELECT ESTATUS
                INTO EST_ANTERIOR
                FROM HISTORICO_ESTATUS_BIEN
               WHERE NO_REGISTRO = (SELECT MAX(NO_REGISTRO)
                                      FROM HISTORICO_ESTATUS_BIEN
                                     WHERE NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN
                                       AND ESTATUS != (SELECT ESTATUS 
                                                         FROM BIENES 
                                                         WHERE NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN
                                                         ))
                 AND NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN
                  AND ESTATUS IN (SELECT DISTINCT ESTATUS 
                  											 FROM ESTATUS_X_PANTALLA
                 									WHERE CVE_PANTALLA = vc_pantalla 
                 										AND ESTATUS_FINAL = :BIENES_OFICIO_GESTION.ESTATUS
                 										AND ESTATUS <> ESTATUS_FINAL);
            EXCEPTION
             WHEN OTHERS THEN
                NULL;               
            END; 
            IF EST_ANTERIOR IS NULL THEN
               BEGIN      
                  SELECT ESTATUS
                    INTO EST_ANTERIOR
                    FROM HISTORICO_ESTATUS_BIEN
                   WHERE NO_REGISTRO = (SELECT MAX(NO_REGISTRO)
                                          FROM HISTORICO_ESTATUS_BIEN
                                         WHERE NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN
                                           AND ESTATUS != (SELECT ESTATUS 
                                                             FROM BIENES 
                                                                      WHERE NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN))
                     AND NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN
                      AND ESTATUS IN (SELECT DISTINCT ESTATUS 
                      											 FROM ESTATUS_X_PANTALLA
                          									WHERE CVE_PANTALLA = vc_pantalla 
                          										AND ESTATUS_FINAL = :BIENES_OFICIO_GESTION.ESTATUS
                          										AND ESTATUS = ESTATUS_FINAL);
               EXCEPTION
       	      WHEN NO_DATA_FOUND THEN
      			   EST_ANTERIOR := :BIENES_OFICIO_GESTION.ESTATUS;
               WHEN OTHERS THEN
                  NULL;               
               END; 
            END IF;
            BEGIN
               SELECT TO_DATE(FEC_CAMBIO)
               INTO FECHA_CAMBIO 
               FROM HISTORICO_ESTATUS_BIEN
               WHERE NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN
               AND NO_REGISTRO = (SELECT MAX(NO_REGISTRO)
                                   FROM HISTORICO_ESTATUS_BIEN
                                  WHERE NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN);
            EXCEPTION
             WHEN OTHERS THEN
                NULL;                        
            END;    

            FECHA_INSERTO := TO_DATE(:M_OFICIO_GESTION.FECHA_INSERTO);

            IF FECHA_CAMBIO = FECHA_INSERTO THEN                      	
               BEGIN
                  UPDATE BIENES
                  SET ESTATUS = EST_ANTERIOR
                  WHERE NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN;
               EXCEPTION
               	WHEN OTHERS THEN 
               	NULL;
               END;
            ELSE 
               BEGIN
               UPDATE BIENES
               SET ESTATUS = :BIENES_OFICIO_GESTION.ESTATUS
               WHERE NO_BIEN = :BIENES_OFICIO_GESTION.NO_BIEN;
               EXCEPTION
               	WHEN OTHERS THEN 
               	NULL;
               	END;
            END IF;

            EXIT WHEN :system.last_record = 'TRUE';
            NEXT_RECORD;
         END IF;    ---Agregado a neo
      END LOOP;
      LIP_COMMIT_SILENCIOSO;
      GO_BLOCK('BIENES');
      EXECUTE_QUERY;
      BEGIN
         DELETE FROM BIENES_OFICIO_GESTION
          WHERE NO_OF_GESTION  = v_no_of_gestion;
         LIP_COMMIT_SILENCIOSO;
         GO_BLOCK('BIENES_OFICIO_GESTION');
         Clear_Block(No_Validate);
      EXCEPTION
         WHEN OTHERS THEN
            NULL;
      END;
-- Borr  COPIAS_OFICIO_GESTION
      BEGIN
         DELETE FROM COPIAS_OFICIO_GESTION
          WHERE NO_OF_GESTION  = v_no_of_gestion;
         LIP_COMMIT_SILENCIOSO;
         GO_BLOCK('COPIAS_OFICIO_GESTION');
         Clear_Block(No_Validate);
      EXCEPTION
         WHEN OTHERS THEN
            NULL;
      END;
-- Borr  DOCUM_OFICIO_GESTION
      BEGIN
         DELETE FROM DOCUM_OFICIO_GESTION
          WHERE NO_OF_GESTION  = v_no_of_gestion;
         LIP_COMMIT_SILENCIOSO;
         GO_BLOCK('DOCUM_OFICIO_GESTION');
         Clear_Block(No_Validate);
      EXCEPTION
         WHEN OTHERS THEN
            NULL;
      END;
      BEGIN
         DELETE FROM M_OFICIO_GESTION
          WHERE NO_OF_GESTION  = v_no_of_gestion
            AND NO_VOLANTE = v_no_volante;
            LIP_COMMIT_SILENCIOSO;
           BEGIN      
              SELECT COUNT(0)
                INTO VVAL1
                FROM DICTAMINACIONES
               WHERE NO_VOLANTE = v_no_volante;
           EXCEPTION
              WHEN NO_DATA_FOUND THEN
                   VVAL1 := 0;
           END;      
              IF VVAL1 = 0 THEN
                 UPDATE NOTIFICACIONES
                    SET CVE_DICTAMEN = NULL
                  WHERE NO_VOLANTE = v_no_volante;
              LIP_COMMIT_SILENCIOSO;
              END IF;
         /*
         -- Actualiza cve_dcitamen en volante 080307 JAM
         BEGIN
            UPDATE NOTIFICACIONES
               SET CVE_DICTAMEN = NULL
             WHERE NO_VOLANTE = v_no_volante;
             LIP_COMMIT_SILENCIOSO;
         EXCEPTION
            WHEN OTHERS THEN
               NULL;
         END;*/
         --LIP_COMMIT_SILENCIOSO;
         GO_BLOCK('M_OFICIO_GESTION');
         Clear_Block(No_Validate);
         :se_refiere_a := 'D';
      EXCEPTION
         WHEN OTHERS THEN
            NULL;
      END;
-- actu  izo bienes con estatus ROP -- 140607 JAC --
           GO_BLOCK('BIENES');
      FIRST_RECORD;
      LOOP
         :BIENES.ESTATUS  := 'ROP';
         EXIT WHEN :system.last_record = 'TRUE';
         NEXT_RECORD;			
      END LOOP;
      LIP_COMMIT_SILENCIOSO;*/      

      Set_Radio_Button_Property('se_refiere_a','a',ENABLED,PROPERTY_TRUE);
      Set_Radio_Button_Property('se_refiere_a','b',ENABLED,PROPERTY_TRUE);
      IF :PARAMETER.SALE = 'D' THEN 
         Set_Radio_Button_Property('se_refiere_a','c',ENABLED,PROPERTY_TRUE);
      ELSE
         Set_Radio_Button_Property('se_refiere_a','c',ENABLED,PROPERTY_FALSE);
      END IF;

      END IF;
--   END IF;
  -- LIP_COMMIT_SILENCIOSO;
   GO_ITEM('NOTIFICACIONES.NO_EXPEDIENTE');
   --LIP_EXEQRY;
END;

