import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Logbooks } from '../../../api/logbooks';
import { Profiles } from '../../../api/profiles';
import template from './logbook.html';
 
class Logbook {
  constructor($scope, $reactive, $state) {
    //'ngInject';
 
    $reactive(this).attach($scope);

    this.job = {};
    this.dateFrom = '';
    this.dateTo = '';
    this.dateFrom2 = '';
    this.dateTo2 = '';

    this.perPage = 10;
    this.page = 1;
    this.sort = {
      date: -1
    };
    this.searchText = '';
    this.searchText2 = '';

    this.subscribe('profiles', () => [{
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText2')
      ]);

    this.subscribe('logbooks', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }, this.getReactively('dateFrom2'),
    this.getReactively('dateTo2'),
    this.getReactively('searchText')
    ]);

    this.subscribe('users');
 
    this.helpers({
      logbooks() {
        var logbooks =  Logbooks.find({}, {
          sort : this.getReactively('sort')
        });
        console.info('parties', logbooks);
        return logbooks;
      },
      logbooksCount() {
        return Counts.get('numberOfLogbooks');
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
      profiles() {
        return Profiles.find({});
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
    this.gotoNewLog = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      //window.setTimeout(function(){
        $state.go('newlog', {}, {reload: 'newlog'});
      //},2000);
      
    }
    this.gotoSeaLog = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      //window.setTimeout(function(){
        $state.go('sealog', {}, {reload: 'sealog'});
      //},2000);
      
    }
  }

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }
   
  pageChanged(newPage) {
    this.page = newPage;
    console.info('new page', this.page);
  }

  sortChanged(sort) {
    this.sort = sort;
  }

  submit() {
    this.job.owner = Meteor.userId();
    this.job.date = new Date();
    this.job.dateTime = this.job.date.getTime();
    var status = Jobs.insert(this.job);
    this.job = {};
  }

  reset() {
    this.searchText = '';
    this.dateFrom2 = '';
    this.dateTo2 = '';
    
  }

  filterNow() {
    this.dateFrom2 = this.dateFrom.getTime();
    this.dateTo2 = this.dateTo.getTime();
    console.info('searchText', typeof this.dateFrom2);
  }
}
 
const name = 'logbook';

//Dashboard.$inject = ['$scope', '$reactive'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Logbook]
})
.config(['$stateProvider', 
function($stateProvider) {
  //'ngInject';
  $stateProvider
    .state('logbook', {
      url: '/logbook',
      template: '<logbook></logbook>',
      resolve: {
        currentUser($q, $state) {
            if (!Meteor.userId()) {
                return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            };
        }
    }
    });
  } 
]);

