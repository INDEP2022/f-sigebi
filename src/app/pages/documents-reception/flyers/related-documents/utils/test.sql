DECLARE
	SIGLA   			VARCHAR2(30);
	ANIO    			VARCHAR2(4);
  AR_REMITENTE	VARCHAR2(30);
  OFICIO  			NUMBER;
	DATO 					VARCHAR2(1);
--CONTADOR NUMBER;
	CONTA 				NUMBER;
	contador 			NUMBER;
	
BEGIN
	go_block('DOCUM_OFICIO_GESTION');
	Clear_Block(No_Validate);

	IF :VARIABLES.DICTAMINACION IS NULL THEN 
		 	LIP_MENSAJE('Especifique el tipo de Dictaminación','S');
   		RAISE Form_Trigger_Failure;
	END IF;

	IF :VARIABLES.B = 'S' THEN
	   IF :CVE_OF_GESTION IS NULL THEN 
	 	   SELECT SEQ_OF_GESTION.nextval
         INTO :M_OFICIO_GESTION.NO_OF_GESTION
         FROM dual;
         -- LIP_COMMIT_SILENCIOSO;
      
         IF :SE_REFIERE_A = 'Se refiere a todos los bienes' THEN 
            PUP_AGREGA_BIENES;  
            LIP_COMMIT_SILENCIOSO;        
         END IF;

         IF :SE_REFIERE_A = 'Se refiere a algun (os) bien (es) del expediente' THEN
   	        PUP_AGREGA_ALGUNOS_BIENES;
   	        LIP_COMMIT_SILENCIOSO;
         END IF;     
         --   go_block('BIENES_OFICIO_GESTION');
         --   LIP_EXEQRY;   
         :variables.clasif := null;
         if :BIENES_OFICIO_GESTION.clasif is not null then
	          GO_BLOCK('BIENES_OFICIO_GESTION');
            FIRST_RECORD;
            LOOP
              IF :BIENES_OFICIO_GESTION.CLASIF IS NOT NULL THEN 
                 :VARIABLES.CLASIF := :VARIABLES.CLASIF||TO_CHAR(:BIENES_OFICIO_GESTION.CLASIF);    
              end if;
              GO_BLOCK('BIENES_OFICIO_GESTION');
              EXIT WHEN :system.last_record = 'TRUE';
              IF :BIENES_OFICIO_GESTION.CLASIF IS NOT NULL THEN 
    	           :VARIABLES.CLASIF := :VARIABLES.CLASIF||',';
              END IF;
              NEXT_RECORD;
            END LOOP;
 	          :VARIABLES.CLASIF2 := :VARIABLES.CLASIF;--,2,500);       
            GO_BLOCK('R_DICTAMINA_DOC');
         LIP_EXEQRY; 
         END IF;
	   END IF;
	 
      IF :CVE_OF_GESTION IS NOT NULL THEN 
	      SELECT COUNT(0) into contador
	      from BIENES_OFICIO_GESTION
	      where no_of_gestion = :M_OFICIO_GESTION.no_of_gestion;
   
	      IF :SE_REFIERE_A = 'Se refiere a todos los bienes' AND CONTADOR = 0 THEN 
	    	    PUP_AGREGA_BIENES;
	    	    LIP_COMMIT_SILENCIOSO;
	      END IF;
   
         IF :SE_REFIERE_A = 'Se refiere a algun (os) bien (es) del expediente' AND CONTADOR = 0 THEN 
         	  PUP_AGREGA_ALGUNOS_BIENES;
         	  LIP_COMMIT_SILENCIOSO;
         END IF;
         go_block('BIENES_OFICIO_GESTION');
         LIP_EXEQRY;
         
         :variables.clasif := null;
         -- :variables.clasif2 := null;
         if :BIENES_OFICIO_GESTION.clasif is not null then
	         GO_BLOCK('BIENES_OFICIO_GESTION');
            FIRST_RECORD;
            LOOP
              IF :BIENES_OFICIO_GESTION.CLASIF IS NOT NULL THEN 
                 :VARIABLES.CLASIF := :VARIABLES.CLASIF||TO_CHAR(:BIENES_OFICIO_GESTION.CLASIF);    
              end if;
              GO_BLOCK('BIENES_OFICIO_GESTION');
              EXIT WHEN :system.last_record = 'TRUE';
              IF :BIENES_OFICIO_GESTION.CLASIF IS NOT NULL THEN 
    	           :VARIABLES.CLASIF := :VARIABLES.CLASIF||',';
              END IF;
              NEXT_RECORD;
            END LOOP;
 	         :VARIABLES.CLASIF2 := :VARIABLES.CLASIF;--,2,500);
            GO_BLOCK('R_DICTAMINA_DOC');
            LIP_EXEQRY; 
         end if;
      END IF;

      IF :M_OFICIO_GESTION.CVE_OF_GESTION IS NOT NULL AND :SE_REFIERE_A = 'Se refiere a todos los bienes' THEN
	       Set_Radio_Button_Property('se_refiere_a','b',enabled,property_false);
	       Set_Radio_Button_Property('se_refiere_a','c',ENABLED,PROPERTY_FALSE);
      END IF;

      if :M_OFICIO_GESTION.CVE_OF_GESTION IS NOT NULL AND :SE_REFIERE_A = 'Se refiere a algun (os) bien (es) del expediente' THEN
          Set_Radio_Button_Property('se_refiere_a','a',enabled,property_false);
          Set_Radio_Button_Property('se_refiere_a','c',ENABLED,PROPERTY_FALSE);
      END IF;
      go_block('R_DICTAMINA_DOC');
      LIP_EXEQRY; 
   else
	go_block('DOCUMENTOS_PARA_DICTAMEN');
   LIP_EXEQRY; 
   end if;
end;