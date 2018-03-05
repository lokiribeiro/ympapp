import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Profiles } from '../../../api/profiles';
import template from './employeedetails.html';
 
class Employeedetails {
  constructor($scope, $reactive, $stateParams, $state) {
    //'ngInject';

    //this.profile = {};
 
    $reactive(this).attach($scope);

    this.employeeId = $stateParams.employeeId;

    this.profile = {};

    console.info('employeeId', this.employeeId);

    this.subscribe('profiles');

    this.subscribe('users');
 
    this.helpers({
      profile() {
        return Profiles.findOne({
            _id: $stateParams.employeeId
          });
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      }
    });

    this.logout = function() {
      Accounts.logout();
      window.setTimeout(function(){
        $state.go('login', {}, {reload: 'login'});
      },2000);
    }

    this.gotoDashboard = function() {
      $state.go('dashboard', {}, {reload: 'dashboard'});
    }
    this.gotoInventory = function() {
      $state.go('inventory', {}, {reload: 'inventory'});
    }
    this.gotoLogbook = function() {
      $state.go('logbook', {}, {reload: 'logbook'});
    }
    this.gotoEmployees = function() {
      $state.go('employees', {}, {reload: 'employees'});
    }
    this.gotoSettings = function() {
      $state.go('settings', {}, {reload: 'settings'});
    }
  }
   
  save() {
    Profiles.update({
      _id: this.profile._id
    }, {
      $set: {
        name: this.profile.name,
        employeeNum: this.profile.employeeNum,
        jobTitle: this.profile.jobTitle,
        phone: this.profile.phone,
        ssn: this.profile.ssn,
        salary: this.profile.salary,
        email: this.profile.email
      }
    }, (error) => {
        if (error) {
          console.log('Oops, unable to update the inventory...');
        } else {
          console.log('Done!');
        }
    });
  }
}
 
const name = 'employeedetails';

//Inventorydetails.$inject = ['$scope', '$reactive', '$stateParams'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$stateParams', '$state', Employeedetails]
})
.config(['$stateProvider',
function($stateProvider) {
    //'ngInject';
    $stateProvider
      .state('employeedetails', {
        url: '/employeedetails/:employeeId',
        template: '<employeedetails></employeedetails>',
    
        resolve: {
            currentUser($q, $state) {
                if (Meteor.userId() === null) {
                    return $q.reject('AUTH_REQUIRED');
                } else {
                  return $q.resolve();
                };
            }
        }
      });
    }
]);

