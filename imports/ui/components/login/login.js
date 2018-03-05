import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './login.html';
 
class Login {
  constructor($scope, $reactive, $state) {
    //'ngInject';
 
    $reactive(this).attach($scope);

    this.login = {};

    this.subscribe('users');
 
    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      }
    });

    this.signin = function(){
        Meteor.loginWithPassword(this.login.username, this.login.password,
            this.$bindToContext((err) => {
              if (err) {
                $scope.loginerror = err.reason;
                    console.info('err: ' ,   $scope.loginerror );
                } else {
                    $state.go('dashboard', {}, {reload: 'dashboard'});
                }
              })
            );
      }
  }

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }

  
}
 
const name = 'login';

//Login.$inject = ['$scope', '$reactive', '$state'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Login]
})
.config(['$stateProvider',
function($stateProvider) {
    //'ngInject';
    $stateProvider
      .state('login', {
        url: '/',
        template: '<login></login>',
        resolve: {
            currentUser($q, $state) {
                if (!Meteor.userId()) {
                  return $q.resolve();
                } else {
                  return $q.reject('LOGGED_IN');
                };
            }
          }
      });
    }
]);

