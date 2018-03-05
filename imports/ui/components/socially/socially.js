import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngFileUpload from 'ng-file-upload';
//import 'angularjs-datepicker';

import '../../../startup/accounts-config.js';
import '../../../startup/datepicker.js';
 
import template from './socially.html';
import Navigation from '../navigation/navigation';
import Dashboard from '../dashboard/dashboard';
import Login from '../login/login';
import Inventory from '../inventory/inventory';
import Jobdetails from '../jobdetails/jobdetails';
import Inventorydetails from '../inventorydetails/inventorydetails';
import Employees from '../employees/employees';
import Employeedetails from '../employeedetails/employeedetails';

 
class Socially {}
 
const name = 'socially';
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  Navigation.name,
  Dashboard.name,
  Inventory.name,
  Jobdetails.name,
  Inventorydetails.name,
  Employees.name,
  Login.name,
  Employeedetails.name,
  'accounts.ui',
  'date-picker',
  ngFileUpload
//  '720kb.datepicker'
]).component(name, {
  template,
  controllerAs: name,
  controller: Socially
})
.config(['$locationProvider', '$urlRouterProvider', '$qProvider', '$stateProvider',
function config($locationProvider, $urlRouterProvider, $qProvider, $stateProvider) {
  //'ngInject';
  
  $locationProvider.html5Mode(true);
  
  $urlRouterProvider.otherwise('/not-found');
  
  $qProvider.errorOnUnhandledRejections(false);
  }
])
.run(['$rootScope', '$state', '$stateParams',
function run($rootScope, $state, $stateParams) {
  //'ngInject';
  console.log('daan ditolabas');
  console.info('rootscope', $rootScope);
  console.info('rootscopeobn', $rootScope.$on.$stateChangeError);

  $state.defaultErrorHandler(function(error) {

    console.info('pasok', error);
    console.info('pasok', error.detail);
    // This is a naive example of how to silence the default error handler.
    if(error.detail == 'AUTH_REQUIRED'){
      $state.go('login', {}, {reload: 'login'});
    }
    if(error.detail == 'LOGGED_IN'){
      $state.go('dashboard', {}, {reload: 'dashboard'});
    }
  });
}
]);


 
