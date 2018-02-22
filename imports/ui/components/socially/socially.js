import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import template from './socially.html';
import PartiesList from '../partiesList/partiesList';
import PartyDetails from '../partyDetails/partyDetails';
import Navigation from '../navigation/navigation';
 
class Socially {}
 
const name = 'socially';
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  PartiesList.name,
  PartyDetails.name,
  Navigation.name,
  'accounts.ui'
]).component(name, {
  template,
  controllerAs: name,
  controller: Socially
})
.config(config)
.run(run);

function config($locationProvider, $urlRouterProvider, $qProvider) {
'ngInject';

$locationProvider.html5Mode(true);

$urlRouterProvider.otherwise('/parties');

$qProvider.errorOnUnhandledRejections(false);
}
 
function run($rootScope, $state) {
  'ngInject';
 
  $rootScope.$on('$stateChangeError',
    (event, toState, toParams, fromState, fromParams, error) => {
      if (error === 'AUTH_REQUIRED') {
        $state.go('parties');
      }
    }
  );
}