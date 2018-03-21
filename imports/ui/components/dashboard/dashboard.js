import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Jobs } from '../../../api/jobs';
import { Parties } from '../../../api/parties';
import { Groups } from '../../../api/groups';
import template from './dashboard.html';
 
class Dashboard {
  constructor($scope, $reactive, $state) {
    //'ngInject';
    angular.element(document).ready(function () {
      var jobs =  Jobs.find({});
      console.info('jobs on load', jobs);
      var compareDate = new Date();
      $scope.compareDate = compareDate.getTime();
      console.info('$scope.compareDate', $scope.compareDate);

      
      jobs.forEach(function(job){
        if(job.dateTime <= $scope.compareDate){
          if(job.repeating){
            if(job.hours){
              job.dateNext = job.dateTime + (job.hours*60*60*1000);
              var newDate = job.dateNext;
              job.date = new Date(newDate);
              job.dateTime = job.date.getTime();
              var jobID = job._id;
              var date = job.date;
              var dateTime = job.dateTime;
              var dateNext = job.dateNext;

              Meteor.call('upsertNewJobTime', jobID, date, dateTime, dateNext, function(err, result) {
                console.log('success: ' + job.dateTime);
                if (err) {
                  console.info('err', err);
                } else {
                  console.info('uploaded', err);
               }
             });

            } else if(job.days){
              var hours = job.days * 24;
              job.dateNext = job.dateTime + (hours*60*60*1000);
              var newDate = job.dateNext;
              job.date = new Date(newDate);
              job.dateTime = job.date.getTime();
              var jobID = job._id;
              var date = job.date;
              var dateTime = job.dateTime;
              var dateNext = job.dateNext;

              Meteor.call('upsertNewJobTime', jobID, date, dateTime, dateNext, function(err, result) {
                console.log('success: ' + job.dateTime);
                if (err) {
                  console.info('err', err);
                } else {
                  console.info('uploaded', err);
               }
             });
            }
          }
        }
      });

    });
 
    $reactive(this).attach($scope);

    this.job = {};
    this.dateFrom = '';
    this.dateTo = '';
    this.dateFrom2 = '';
    this.dateTo2 = '';

    this.perPage = 10;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.sortDate = {
      date: -1
    };
    this.searchText = '';

    this.choices = [
      {name: 'Yes', value: true},
      {name: 'No', value: false},
    ];

    this.subscribe('parties', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }, this.getReactively('searchText')
    ]);

    this.subscribe('jobs', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sortDate')
    }, this.getReactively('searchText'), 
    this.getReactively('dateFrom2'),
    this.getReactively('dateTo2')
    ]);

    this.subscribe('users');

    this.subscribe('groups');
 
    this.helpers({
      parties() {
        var parties =  Parties.find({}, {
          sort : this.getReactively('sort')
        });
        console.info('parties', parties);
        return parties;
      },
      jobs() {
        var jobs =  Jobs.find({}, {
          sort : this.getReactively('sortDate')
        });
        console.info('parties', jobs);
        return jobs;
      },
      jobsCount() {
        return Counts.get('numberOfJobs');
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
      groups() {
        return Groups.find({}, {
          sort : this.getReactively('sort')
        });
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
    if(this.job.hours){
      this.job.dateNext = this.job.dateTime + (this.job.hours*60*60*1000);
      var newDate = this.job.dateNext;
      this.job.date = new Date(newDate);
      this.job.dateTime = this.job.date.getTime();
    } else if(this.job.days){
      var hours = this.job.days * 24;
      this.job.dateNext = this.job.dateTime + (hours*60*60*1000);
      var newDate = this.job.dateNext;
      this.job.date = new Date(newDate);
      this.job.dateTime = this.job.date.getTime();
    }
    var status = Jobs.insert(this.job);
    this.job = {};
  }

  reset() {
    this.searchText = '';
    this.dateFrom2 = '';
    this.dateTo2 = '';
    
  }

  filterNow() {
    console.info('searchText', this.searchText);
    this.dateFrom2 = this.dateFrom.getTime();
    this.dateTo2 = this.dateTo.getTime();
  }
}
 
const name = 'dashboard';

//Dashboard.$inject = ['$scope', '$reactive'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Dashboard]
})
.config(['$stateProvider', 
function($stateProvider) {
  //'ngInject';
  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      template: '<dashboard></dashboard>',
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

