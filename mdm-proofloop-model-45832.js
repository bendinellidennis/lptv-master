/* Malta Driving Master 45.8.32 — ProofLoop Model */
(function(){
'use strict';
if(window.MDM_PROOFLOOP_MODEL)return;
const VERSION='45.8.32';
const SOURCE_IDS=Object.freeze(['theory','replay','road','telemetry','instructor']);
const STATUS=Object.freeze({INSUFFICIENT:'insufficient',EVIDENCE:'evidence',CONTRADICTORY:'contradictory'});
const QUALITY=Object.freeze({LOW:'low',MEDIUM:'medium',HIGH:'high'});
function qualityFor(n,c){n=Math.max(0,Number(n)||0);c=Math.max(0,Number(c)||0);if(c)return n>=3?QUALITY.MEDIUM:QUALITY.LOW;if(n>=4)return QUALITY.HIGH;if(n>=2)return QUALITY.MEDIUM;return QUALITY.LOW;}
function stateFor(n,c){n=Math.max(0,Number(n)||0);c=Math.max(0,Number(c)||0);if(c)return STATUS.CONTRADICTORY;return n>=2?STATUS.EVIDENCE:STATUS.INSUFFICIENT;}
window.MDM_PROOFLOOP_MODEL=Object.freeze({version:VERSION,SOURCE_IDS,STATUS,QUALITY,qualityFor,stateFor});
})();