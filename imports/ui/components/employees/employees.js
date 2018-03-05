import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

//import { Users } from '../../../api/users';
import { Profiles } from '../../../api/profiles';
import template from './employees.html';
 
class Employees {
  constructor($scope, $reactive, $state) {
    //'ngInject';
 
    $reactive(this).attach($scope);
    this.details = '';

    this.cancreate = false;

    this.employee = {};
    $scope.profile = {};

    this.perPage = 10;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = '';

    this.subscribe('users');

    this.subscribe('profiles', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }, this.getReactively('searchText')
    ]);
 
    this.helpers({
      users() {
          var users = Meteor.users.find();
          console.info('users', users);
        return Meteor.users.find({});
      },
      profiles() {
        return Profiles.find({}, {
          sort : this.getReactively('sort')
        });
      },
      usersCount() {
        return Counts.get('numberOfUsers');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      },
      currentUser() {
          var thisuser = Meteor.user();
          console.info('thisuser',thisuser);
        return Meteor.user();
      }
    });

    $scope.createProfile = function(details){
      console.info('employee details', $scope.profile)
      $scope.profile.userID = details
      var status = Profiles.insert($scope.profile);
      console.info('status', status);
    }

    this.submit = function() {
      this.employee.date = new Date();
      this.employee.password = 'Password123';
      $scope.profile = this.employee;
      console.info('username', this.employee.username);
      Meteor.call('createUsers', this.employee.username, this.employee.password, this.employee.email, function(err, detail) {
          console.info('detail', detail);
            if (err) {
                console.info('err', err);
           } else {
             this.userID = detail;
             console.info('success', this.userID);
             this.cancreate = true;
             console.info('cancreate', this.cancreate);
             $scope.createProfile(detail);
           }
        });
        this.employee = {};
    }

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

  isOwner(inventory) {
    return this.isLoggedIn && inventory.owner === this.currentUserId;
  }
   
  pageChanged(newPage) {
    this.page = newPage;
    console.info('new page', this.page);
  }

  sortChanged(sort) {
    this.sort = sort;
  }
}
 
const name = 'employees';

//Employees.$inject = ['$scope', '$reactive'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Employees]
})
.config(['$stateProvider',
function($stateProvider) {
    //'ngInject';
    $stateProvider
      .state('employees', {
        url: '/employees',
        template: '<employees></employees>',
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