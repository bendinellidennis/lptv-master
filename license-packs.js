(function(global){
 'use strict';
 const packs=new Map();
 const SCHEMA='mdm-license-pack-v1';
 function normalise(pack){
  const p=Object.assign({},pack||{});
  p.schema=p.schema||SCHEMA;
  p.status=p.status||'planned';
  p.sharedQuestionIds=Array.isArray(p.sharedQuestionIds)?p.sharedQuestionIds.slice():[];
  p.specificQuestionIds=Array.isArray(p.specificQuestionIds)?p.specificQuestionIds.slice():[];
  p.replayMappings=Array.isArray(p.replayMappings)?p.replayMappings.slice():[];
  p.twinTaxonomy=Array.isArray(p.twinTaxonomy)?p.twinTaxonomy.slice():[];
  p.evidenceGates=Array.isArray(p.evidenceGates)?p.evidenceGates.slice():[];
  p.missionTypes=Array.isArray(p.missionTypes)?p.missionTypes.slice():[];
  return p;
 }
 function register(pack){
  const p=normalise(pack);
  if(!p.id)throw new Error('License pack id missing');
  if(!p.countryPackId)throw new Error('License pack countryPackId missing');
  if(!p.licenceType)throw new Error('License pack licenceType missing');
  if(packs.has(p.id))throw new Error('Duplicate license pack '+p.id);
  packs.set(p.id,Object.freeze(p));
  return p;
 }
 function get(id){return packs.get(id)||null;}
 function list(filter){
  const all=Array.from(packs.values());
  if(!filter)return all;
  return all.filter(p=>Object.keys(filter).every(k=>p[k]===filter[k]));
 }
 function activatable(pack){
  const p=typeof pack==='string'?get(pack):pack;
  return !!(p&&p.status==='verified'&&p.payloadInstalled===true&&p.examRules&&p.questionBank&&p.questionBank.installed===true);
 }
 global.LicensePacks=Object.freeze({SCHEMA,register,get,list,activatable});

 register({
  id:'MT-LPTV',countryPackId:'MT-LPTV-TAG',countryCode:'MT',licenceType:'LPTV',programme:'LPTV TAG',status:'verified',payloadInstalled:true,
  questionBank:{source:'current-mdm-bank',installed:true,expectedCount:250},examRules:{source:'country-pack',installed:true},
  replayPolicy:'shared-when-semantically-relevant',twinPolicy:'license-aware',evidencePolicy:'license-aware',missionPolicy:'license-aware'
 });
 register({id:'MT-B',countryPackId:'MT-LPTV-TAG',countryCode:'MT',licenceType:'B',programme:'Patente B · Auto',status:'audit-complete',payloadInstalled:false,questionBank:{installed:false,officialSource:'Transport Malta · Cars · Version 4',officialSourceI18n:{it:'Transport Malta · Auto · Versione 4',en:'Transport Malta · Cars · Version 4',mt:'Transport Malta · Karozzi · Verżjoni 4'},officialCount:444,currentCanonicalMatches:184,currentActiveLptvMatches:182,currentExcludedLptvMatches:2,answerKeysVerified:184,missingOfficial:260,verifiedCanonicalIds:["CARS1.2","CARS1.3","CARS1.7","CARS1.9","CARS1.10","CARS1.12","CARS1.13","CARS1.18","CARS1.24","CARS1.25","CARS2.4","CARS2.6","CARS2.9","CARS2.14","CARS2.17","CARS2.19","CARS2.20","CARS2.22","CARS2.30","CARS2.31","CARS2.32","CARS2.34","CARS3.4","CARS3.8","CARS3.18","CARS3.23","CARS3.27","CARS3.28","CARS3.38","CARS4.7","CARS4.14","CARS4.20","CARS4.30","CARS5.6","CARS5.10","CARS1.14","CARS1.15","CARS1.19","CARS1.23","CARS1.26","CARS2.1","CARS2.2","CARS2.3","CARS2.5","CARS2.7","CARS2.8","CARS2.12","CARS2.26","CARS2.33","CARS2.36","CARS2.37","CARS2.41","CARS3.1","CARS3.7","CARS3.9","CARS3.29","CARS3.30","CARS3.31","CARS3.33","CARS3.45","CARS3.46","CARS3.47","CARS4.5","CARS4.6","CARS4.10","CARS4.11","CARS4.16","CARS4.21","CARS4.22","CARS4.25","CARS4.27","CARS4.28","CARS4.29","CARS5.3","CARS5.4","CARS5.5","CARS5.7","CARS5.8","CARS5.9","CARS5.11","CARS6.55","CARS6.56","CARS6.57","CARS6.58","CARS6.60","CARS6.61","CARS7.4","CARS9.7","CARS9.8","CARS9.9","CARS9.10","CARS9.11","CARS10.1","CARS10.3","CARS10.6","CARS12.8","CARS12.11","CARS13.1","CARS13.2","CARS13.3","CARS13.4","CARS13.5","CARS13.6","CARS13.7","CARS13.8","CARS13.9","CARS13.11","CARS6.19","CARS6.22","CARS6.23","CARS6.24","CARS6.27","CARS6.28","CARS6.29","CARS6.30","CARS10.5","CARS11.7","CARS11.8","CARS11.9","CARS11.10","CARS10.21","CARS10.22","CARS10.23","CARS10.24","CARS10.25","CARS10.26","CARS10.27","CARS12.9","CARS12.10","CARS5.12","CARS5.13","CARS5.14","CARS5.15","CARS5.16","CARS5.17","CARS5.18","CARS6.2","CARS6.4","CARS6.5","CARS6.10","CARS6.11","CARS6.13","CARS6.14","CARS6.15","CARS6.16","CARS6.18","CARS6.26","CARS6.33","CARS6.34","CARS6.35","CARS6.36","CARS6.37","CARS6.43","CARS6.47","CARS6.49","CARS6.59","CARS6.63","CARS6.64","CARS7.1","CARS11.70","CARS11.73","CARS12.3","CARS12.4","CARS12.7","CARS11.30","CARS11.34","CARS11.55","CARS11.56","CARS11.57","CARS11.58","CARS4.1","CARS4.2","CARS4.3","CARS4.4","CARS4.12","CARS4.13","CARS4.15","CARS8.36","CARS9.1","CARS9.2","CARS9.3","CARS9.4","CARS9.5","CARS9.6"],auditDate:'2026-08-20',sourceFidelity:'IDs and answer keys verified; existing MDM wording may be adapted'},audit:{classification:'canonical-id + answer-key + duplicate audit',noteI18n:{it:'Audit approfondito: tutti i 184 ID CARS già presenti in MDM esistono nella banca ufficiale Transport Malta Auto Versione 4. Le relative chiavi di risposta corretta sono state controllate sulla fonte ufficiale: 163 verifiche automatiche ad alta confidenza e 21 verifiche manuali. Di questi, 182 sono attivi in LPTV; CARS12.9 e CARS12.10 restano intenzionalmente esclusi da LPTV. Il testo già presente in MDM non viene considerato una trascrizione letterale della fonte ufficiale. I nuovi contenuti della Patente B dovranno essere importati dalla banca ufficiale e canonizzati senza creare alias o doppioni.',en:'Deep audit: all 184 CARS IDs already stored in MDM exist in the official Transport Malta Cars Version 4 bank. Their correct-answer keys were checked against the official source: 163 automated high-confidence checks and 21 manual checks. Of these, 182 are active in LPTV; CARS12.9 and CARS12.10 remain intentionally excluded from LPTV. Existing MDM wording is not treated as verbatim official text. New Category B content must be imported from the official bank and canonicalised without duplicate aliases.',mt:'Verifika approfondita: il-184 ID CARS kollha li diġà jinsabu f’MDM jeżistu fil-bank uffiċjali Transport Malta Karozzi Verżjoni 4. Iċ-ċwievet tat-tweġibiet korretti tagħhom ġew ivverifikati mas-sors uffiċjali: 163 verifika awtomatika b’livell għoli ta’ kunfidenza u 21 verifika manwali. Minn dawn, 182 huma attivi f’LPTV; CARS12.9 u CARS12.10 jibqgħu intenzjonalment esklużi minn LPTV. Il-formulazzjoni diġà preżenti f’MDM ma titqiesx bħala traskrizzjoni kelma b’kelma tas-sors uffiċjali. Kontenut ġdid tal-Kategorija B għandu jiġi importat mill-bank uffiċjali u kanonizzat mingħajr ma jinħolqu alias jew duplikati.'}},examRules:{questions:35,durationMinutes:45,passCorrect:30,source:'Transport Malta theory-test page'}});
 register({id:'MT-A',countryPackId:'MT-LPTV-TAG',countryCode:'MT',licenceType:'A',programme:'Moto',status:'audit-complete',payloadInstalled:false,questionBank:{installed:false,officialSource:'Transport Malta · Motorcycles · Version 3',officialSourceI18n:{it:'Transport Malta · Moto · Versione 3',en:'Transport Malta · Motorcycles · Version 3',mt:'Transport Malta · Muturi · Verżjoni 3'},officialCount:391,currentCanonicalMatches:0,missingOfficial:391,auditDate:'2026-08-20',sourceFidelity:'BIKEH canonical IDs required'},audit:{classification:'canonical-id audit; semantic reuse blocked until explicit mapping',noteI18n:{it:'Audit approfondito: la banca ufficiale Moto contiene 391 ID BIKEH univoci. Attualmente in MDM non è installato alcun ID canonico BIKEH. Le eventuali sovrapposizioni generali sulla sicurezza stradale non vengono conteggiate come riuso finché ogni singola voce BIKEH non viene mappata esplicitamente e verificata per domanda, risposte e chiave corretta. In questo modo si evita qualsiasi condivisione impropria tra Auto e Moto.',en:'Deep audit: the official motorcycle bank contains 391 unique BIKEH IDs. No BIKEH canonical ID is currently installed in MDM. General road-safety overlap is not counted as reuse until each BIKEH item is explicitly mapped and checked for question, answers and correct key. This prevents false sharing between Car and Motorcycle.',mt:'Verifika approfondita: il-bank uffiċjali tal-muturi fih 391 ID BIKEH uniku. Bħalissa l-ebda ID kanoniku BIKEH mhu installat f’MDM. Kull sovrapożizzjoni ġenerali dwar is-sigurtà fit-triq ma tingħaddx bħala użu mill-ġdid sakemm kull entrata BIKEH tiġi mmappjata b’mod espliċitu u vverifikata għall-mistoqsija, għat-tweġibiet u għaċ-ċavetta korretta. B’dan il-mod jiġi evitat qsim mhux xieraq bejn il-kontenut tal-Karozza u tal-Mutur.'}},examRules:{questions:35,durationMinutes:45,passCorrect:30,source:'Transport Malta theory-test page'}});
 register({id:'MT-C-CE',countryPackId:'MT-LPTV-TAG',countryCode:'MT',licenceType:'C/CE',programme:'Camion C/CE',status:'planned',payloadInstalled:false,questionBank:{installed:false},examRules:null});
 register({id:'MT-D',countryPackId:'MT-LPTV-TAG',countryCode:'MT',licenceType:'D',programme:'Bus D',status:'planned',payloadInstalled:false,questionBank:{installed:false},examRules:null});
})(window);
