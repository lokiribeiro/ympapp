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

    $scope.thisUser = Meteor.userId();
    console.info('userID', $scope.thisUser);

    this.types = [
      {name: 'Y1', value: 'Y1'},
      {name: 'Y2', value: 'Y2'},
      {name: 'Y3', value: 'Y3'},
      {name: 'Y4', value: 'Y4'}
    ];

    this.statuses = [
      {name: 'Available', value: 'Available'},
      {name: 'Employed', value: 'Employed'},
      {name: 'Onboard', value: 'Onboard'}
    ];

    this.mailings = [
      {name: 'Subscribed', value: 'Subscribed'},
      {name: 'Unsubscribed', value: 'Unsubscribed'}
    ];

    this.terms = [
      {name: 'Permanent', value: 'Permanent'},
      {name: 'Rotation', value: 'Rotation'},
      {name: 'Relief', value: 'Relief'},
      {name: 'All', value: 'All'}
    ];

    this.roles = [
      {name: 'admin', value: 'admin'},
      {name: 'user', value: 'user'}
    ];



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
        return Meteor.user();
      },
      boatuserID() {
        var boatUser = Meteor.users.find({
          _id: $scope.thisUser
        });
        console.info('boatUser', boatUser);
        boatUser.forEach(function(boat){
          $scope.boatID  = boat.boatID;
          console.info('boatID', boat);
        })
        console.info('boatID', $scope.boatID);
        return $scope.boatID;
      }
    });

    $scope.createProfile = function(details){
      console.info('employee details', $scope.profile)
      $scope.profile.userID = details;
      var boat = Meteor.user();
      console.info('boat', boat);
      var boatID = boat.boatID;
      $scope.profile.boatID = boatID;
      Meteor.call('upsertNewRoleFromAdmin', details, $scope.profile.role, boatID, function(err, detail) {
        console.info('detail', detail);
          if (err) {
              console.info('err', err);
         } else {
           console.info('success', detail);
         }
      });
      var downloadurl = '../assets/img/user.jpg';
      Meteor.call('upsertPhotoUser', $scope.profile.userID, downloadurl, function(err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
       }
      });
      var status = Profiles.insert($scope.profile);
      console.info('status', status);
    }

    this.submit = function() {
      this.employee.date = new Date();
      this.employee.password = 'Password123';
      this.employee.profilePhoto = '../assets/img/user.jpg';
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