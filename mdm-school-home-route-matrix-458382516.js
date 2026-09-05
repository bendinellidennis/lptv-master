/* Malta Driving Master 45.8.38.25.2.16 — School Home route matrix
   Repairs School Home operational card routing without changing data/workflows.
   Language-independent: uses stable School Home layout positions, not translated labels. */
(function(){
'use strict';
if(window.MDM_SCHOOL_HOME_ROUTE_MATRIX_458382516)return;

const VERSION='45.8.38.25.2.16';

const KPI_ROUTES=[
  'schoolroster',        // Students
  'schooloperations',    // Requests
  'instructorportal',    // Lessons
  'instructorportal'     // Instructors
];

const MANAGEMENT_ROUTES=[
  'schoolroster',          // Students
  'schooloperations',      // Operations
  'instructorportal',      // Lessons
  'instructorportal',      // Instructors
  'schooldashboard',       // School Dashboard
  'instructorassignments', // Assignments
  null                     // Messages: keep existing route
];

const ADVANCED_ROUTES=[
  'instructorintelligence',
  'instructorstudio',
  'schoolcommandcenter'
];

function schoolHome(){return document.querySelector('.sch35')||null}

function setRoute(el,route){
  if(!el||!route)return false;
  el.setAttribute('data-go',route);
  el.dataset.mdmSchoolRouteMatrix=VERSION;
  return true;
}

function patch(){
  const root=schoolHome();
  if(!root)return false;

  const brand=root.querySelector('.sch35-brand-btn');
  setRoute(brand,'schoolprofile');

  const kpis=[...root.querySelectorAll('.sch35-kpis button')];
  KPI_ROUTES.forEach((route,i)=>setRoute(kpis[i],route));

  const grids=[...root.querySelectorAll('.sch35-grid')];
  const management=[...(grids[0]?.querySelectorAll('.sch35-card')||[])];
  MANAGEMENT_ROUTES.forEach((route,i)=>setRoute(management[i],route));

  const advanced=[...(grids[1]?.querySelectorAll('.sch35-card')||[])];
  ADVANCED_ROUTES.forEach((route,i)=>setRoute(advanced[i],route));

  return true;
}

/* Loaded before the privileged route guard.
   On the exact click, refresh the matrix first so SPA rerenders cannot restore stale targets. */
document.addEventListener('click',function(ev){
  if(!ev.target?.closest?.('.sch35'))return;
  patch();
},true);

function schedule(){
  [0,60,160,350,700,1200,2200].forEach(ms=>setTimeout(patch,ms));
}

window.addEventListener('pageshow',schedule);
window.addEventListener('popstate',schedule);
window.addEventListener('hashchange',schedule);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});

window.MDM_SCHOOL_HOME_ROUTE_MATRIX_458382516=Object.freeze({
  version:VERSION,patch,
  kpiRoutes:Object.freeze([...KPI_ROUTES]),
  managementRoutes:Object.freeze([...MANAGEMENT_ROUTES]),
  advancedRoutes:Object.freeze([...ADVANCED_ROUTES])
});
schedule();
})();