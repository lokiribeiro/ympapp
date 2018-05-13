import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import {pleaseWait} from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Watchkeeps } from '../../../api/watchkeeps';
import { Taskgroups } from '../../../api/taskgroups';
import { Watchkeepers } from '../../../api/watchkeepers';
import { Watchkeeplogs } from '../../../api/watchkeeplogs';
import { Profiles } from '../../../api/profiles';
import template from './watchkeep.html';
 
class Watchkeep {
  constructor($scope, $reactive, $state) {
    //'ngInject';
 
    $reactive(this).attach($scope);

    this.dateToday = new Date();
    this.dayToday = this.dateToday.getDay();
    $scope.dayToday2 = this.dateToday.getDay();
    this.hourToday = this.dateToday.getHours();
    console.info('hourToday', this.hourToday);

    this.watchkeep = {};
    this.taskgroup = {};
    this.logs = {};

    this.schedule = {};

    this.perPage = 10;
    this.page = 1;
    this.sort = {
      task: 1
    };
    this.sort2 = {
        name: 1
    };
    this.sortTime = {
        time: 1
    };

    this.searchText = '';
    this.showNotif = false;
    this.showError = false;
    $scope.showSwap = false;
    this.watchkeeperID = '';

    this.options = [
      {name: 'Yes', value: true},
      {name: 'No', value: false}
    ];

    this.subscribe('watchkeeps', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }, this.getReactively('searchText')
    ]);

    this.subscribe('users');
    this.subscribe('taskgroups');
    this.subscribe('watchkeepers');
    this.subscribe('watchkeeplogs');
    this.subscribe('profiles');
 
    this.helpers({
      watchkeeps() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        console.info('boats', boats);
        if(boats){
          $scope.userBoatID = boats.boatID;
          var boatID = $scope.userBoatID;
          var selector = {boatID: boatID};
        } else {
          var selector = {};
        } 
        var watchkeeps =  Watchkeeps.find(selector, {
          sort : this.getReactively('sort')
        });
        console.info('watchkeeps', watchkeeps);
        return watchkeeps;
      },
      watchkeepsCount() {
        return Counts.get('numberOfWatchkeeps');
      },
      watchkeepers() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        console.info('boats', boats);
        if(boats){
          $scope.userBoatID = boats.boatID;
          var boatID = $scope.userBoatID;
          var selector = {boatID: boatID};
        } else {
          var selector = {};
        } 
        var watchkeepers =  Watchkeepers.find(selector, {
            sort: this.getReactively('sortTime')
        });
        console.info('watchkeepers', watchkeepers);
        return watchkeepers;
      },
      taskgroups() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        if(boats){
            $scope.userBoatID = boats.boatID;
            var boatID = $scope.userBoatID;
            var selector = {boatID: boatID};
        } else {
            var selector = {};
        } 
        var taskgroups = Taskgroups.find(selector, {
            sort : this.getReactively('sort2')
        });
        console.info('docs', taskgroups);
        return taskgroups;
      },
      profiles() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        console.info('boats', boats);
        if(boats){
          $scope.userBoatID = boats.boatID;
          var boatID = $scope.userBoatID;
          var selector = {boatID: boatID};
        } else {
          var selector = {};
        } 
        return Profiles.find(selector);
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
      window.loading_screen = pleaseWait({
        logo: "../assets/global/images/logo/logo-white.png",
        backgroundColor: '#8c9093',
        loadingHtml: "<div class='sk-spinner sk-spinner-wave'><div class='sk-rect1'></div><div class='sk-rect2'></div><div class='sk-rect3'></div><div class='sk-rect4'></div><div class='sk-rect5'></div></div>"
      });
      Accounts.logout();
      window.setTimeout(function(){
        window.loading_screen.finish();
        $state.go('login', {}, {reload: 'login'});
      },2000);
    }

    this.gotoDashboard = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('dashboard', {}, {reload: 'dashboard'});
    }
    this.gotoInventory = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('inventory', {}, {reload: 'inventory'});
    }
    this.gotoLogbook = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('logbook', {}, {reload: 'logbook'});
    }
    this.gotoEmployees = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('employees', {}, {reload: 'employees'});
    }
    this.gotoWatchkeep = function() {
        angular.element("body").removeClass("modal-open");
        var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
        removeMe.remove();
        $state.go('watchkeep', {}, {reload: 'watchkeep'});
    }
    this.gotoWatchkeepLog = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('watchkeeplog', {}, {reload: 'watchkeeplog'});
    }
    this.gotoSettings = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('settings', {}, {reload: 'settings'});
    }
    this.gotoAdminPanel = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('adminpanel', {}, {reload: 'adminpanel'});
    }

    this.submit = function() {
      this.watchkeep.owner = Meteor.userId();
      console.info('inventory', this.watchkeep);
      this.watchkeep.date = new Date();
      this.watchkeep.boatID = $scope.userBoatID;
      this.watchkeep.status = 'true';
      var status = Watchkeeps.insert(this.watchkeep);
      console.info('status', status);
      this.watchkeep = {};
      //this.reset();
    }

    this.submitTaskgroup = function() {
        this.taskgroup.owner = Meteor.userId();
        console.info('inventory', this.inventory);
        this.taskgroup.date = new Date();
        this.taskgroup.boatID = $scope.userBoatID;
        var status = Taskgroups.insert(this.taskgroup);
        console.info('status', status);
        this.taskgroup = {};
        //this.reset();
    }

    this.markTask = function(watchkeeper) {
        console.info('watchkeeper', watchkeeper);
        this.showNotif = true;
        this.logs.logDate = new Date();
        this.logs.dateTime = this.logs.logDate.getTime();
        var dateNow = new Date();
        this.logs.date = dateNow.setHours(0,0,0,0);
        console.info('this.logs.Date', this.logs.date);
        this.logs.name = watchkeeper.name;
        this.logs.boatID = watchkeeper.boatID;
        this.logs.userID = watchkeeper.userID;
        var task = watchkeeper.task;
        var taskGroup = watchkeeper.taskGroup;

        var selector = {$and: [
          {date: this.logs.date},
          {userID: this.logs.userID}
        ]};
        var watchkeeplog = Watchkeeplogs.find(selector);
        console.info('watchkeeplog', watchkeeplog);
        var count = watchkeeplog.count();
        console.info('count', count);

        if(count == 0){
          var status = Watchkeeplogs.insert(this.logs);
          console.info('status', status);

          Meteor.call('upsertTasksLog', this.logs.userID, task, taskGroup, this.logs.logDate, this.logs.dateTime, this.logs.date, function(err, result) {
            if (err) {
              console.info('err', err);
            } else {
              console.info('uploaded', err);
            }
          });
        } else {
          Meteor.call('upsertTasksLog', this.logs.userID, task, taskGroup, this.logs.logDate, this.logs.dateTime, this.logs.date, function(err, result) {
            if (err) {
              console.info('err', err);
            } else {
              console.info('uploaded', err);
            }
          });
        }

        

        Watchkeepers.update({
            _id: watchkeeper._id
          }, {
            $set: {
              status: false
            }
          }, (error) => {
              if (error) {
                console.log('Oops, unable to update the job...');
              } else {
                console.log('Done!');
              }
          }); 
    }

    this.notification = function() {
        this.showNotif = false;
        this.showError = false;
        $scope.showSwap = false;
    }

    this.swapSchedule = function() {
      console.info('this.schedule', this.schedule);
      this.showError = false;
      var userID = this.schedule.userID;
      $scope.scheduleUserID = this.schedule.userID;
      $scope.scheduleName = this.schedule.firstName + ' ' + this.schedule.lastName;
      var boatID = this.schedule.boatID;
      var selector = {_id: userID};
      var user = Meteor.users.findOne(selector);
      var myId = Meteor.userId();
      console.info('myId', myId);
      console.info('user details', user);
      if(user.watchkeeper){
        selector = {userID: myId};
        var watchkeepers = Watchkeepers.find(selector);
        watchkeepers.forEach(function(watchkeeper){
          console.info('watchkeeper', watchkeeper);
          console.info('this.today', this.today);
          if($scope.dayToday2 == watchkeeper.daySunday) {
            var newUserID = $scope.scheduleUserID;
            var watchkeeperID = watchkeeper._id;
            $scope.showSwap = true;
            Meteor.call('upsertSundayUser', watchkeeperID, newUserID, $scope.scheduleName, function(err, result) {
              if (err) {
                console.info('err', err);
              } else {
                console.info('uploaded', err);
              }
            });
          } else if($scope.dayToday2 == watchkeeper.dayMonday) {
            var newUserID = $scope.scheduleUserID;
            var watchkeeperID = watchkeeper._id;
            $scope.showSwap = true;
            Meteor.call('upsertMondayUser', watchkeeperID, newUserID, $scope.scheduleName, function(err, result) {
              if (err) {
                console.info('err', err);
              } else {
                console.info('uploaded', err);
              }
            });
          } else if($scope.dayToday2 == watchkeeper.dayTuesday) {
            var newUserID = $scope.scheduleUserID;
            var watchkeeperID = watchkeeper._id;
            $scope.showSwap = true;
            Meteor.call('upsertTuesdayUser', watchkeeperID, newUserID, $scope.scheduleName, function(err, result) {
              if (err) {
                console.info('err', err);
              } else {
                console.info('uploaded', err);
              }
            });
          } else if($scope.dayToday2 == watchkeeper.dayWednesday) {
            var newUserID = $scope.scheduleUserID;
            var watchkeeperID = watchkeeper._id;
            $scope.showSwap = true;
            Meteor.call('upsertWednesdayUser', watchkeeperID, newUserID, $scope.scheduleName, function(err, result) {
              if (err) {
                console.info('err', err);
              } else {
                console.info('uploaded', err);
              }
            });
          } else if($scope.dayToday2 == watchkeeper.dayThursday) {
            var newUserID = $scope.scheduleUserID;
            var watchkeeperID = watchkeeper._id;
            $scope.showSwap = true;
            Meteor.call('upsertThursdayUser', watchkeeperID, newUserID, $scope.scheduleName, function(err, result) {
              if (err) {
                console.info('err', err);
              } else {
                console.info('uploaded', err);
              }
            });
          } else if($scope.dayToday2 == watchkeeper.dayFriday) {
            var newUserID = $scope.scheduleUserID;
            var watchkeeperID = watchkeeper._id;
            $scope.showSwap = true;
            Meteor.call('upsertFridayUser', watchkeeperID, newUserID, $scope.scheduleName, function(err, result) {
              if (err) {
                console.info('err', err);
              } else {
                console.info('uploaded', err);
              }
            });
          } else if($scope.dayToday2 == watchkeeper.daySaturday) {
            var newUserID = $scope.scheduleUserID;
            var watchkeeperID = watchkeeper._id;
            $scope.showSwap = true;
            Meteor.call('upsertSaturdayUser', watchkeeperID, newUserID, $scope.scheduleName, function(err, result) {
              if (err) {
                console.info('err', err);
              } else {
                console.info('uploaded', err);
              }
            });
          }
        });
      } else {
        this.showError = true;
      }
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
 
const name = 'watchkeep';

//Inventory.$inject = ['$scope', '$reactive'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Watchkeep]
})
.config(['$stateProvider',
function($stateProvider) {
  //'ngInject';
  $stateProvider
    .state('watchkeep', {
      url: '/watchkeep',
      template: '<watchkeep></watchkeep>',
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

