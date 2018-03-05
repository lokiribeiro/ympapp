import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Jobs } from '../../../api/jobs';
import { Docs } from '../../../api/docs';
import { Photos } from '../../../api/photos';
import template from './jobdetails.html';
 
class Jobdetails {
  constructor($scope, $reactive, $stateParams, $state, Upload) {
    //'ngInject';
 
    $reactive(this).attach($scope);

    this.jobId = $stateParams.jobId;
    this.stateHolder = $stateParams.stateHolder;

    console.info('jobId', this.jobId);
    console.info('state', this.stateHolder);

    this.job = {};

    this.uploader = new Slingshot.Upload('myFileUploads');

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = '';
    this.pageNum  = null;
    $scope.doneSearching = false;
    $scope.uploadSuccess = false;

    this.subscribe('jobs');

    this.subscribe('docs');

    this.subscribe('photos');

    this.subscribe('users');
 
    this.helpers({
      job() {
        return Jobs.findOne({
            _id: $stateParams.jobId
          });
      },
      docs() {
        var docs = Docs.find({
            jobID: $stateParams.jobId
          });
          console.info('docs', docs);
          return docs;
      },
      photos() {
        var photos = Photos.find({
            jobID: $stateParams.jobId
          });
          console.info('photos', photos);
          return photos;
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

    this.uploadFiles = function(file, errFiles) {
      console.info('pasok', file);
      this.progress = 0;
      this.uploadingNow = true;
      this.f = file;
      this.errFile = errFiles && errFiles[0];
      this.fileHere = file.name;
      this.profileID = Meteor.userId();
      $scope.doneSearching = true;
      $scope.uploadSuccess = false;
      if (file) {
        console.log(file);
  
  
        this.uploader.send(file, function (error, downloadUrl) {
          if (error) {
            // Log service detailed response.
            console.error('Error uploading', this.uploader);
            alert (error);
          }
          else {
            var filename = this.fileHere;
            var profileID = Meteor.userId();
  
            Meteor.call('upsertDrawing', profileID, downloadUrl, $stateParams.jobId, function(err, result) {
                  console.log(downloadUrl);
            console.log('success: ' + downloadUrl);
                  if (err) {
                    console.info('err', err);
                    $scope.doneSearching = false;
                    window.setTimeout(function(){
                      $scope.$apply();
                      //this.doneSearching = false;
                    },2000);

                 } else {
                   var toasted = 'New file uploaded.';
                   console.info('uploaded', err);
                   $scope.doneSearching = false;
                   console.info('doneSearching', $scope.doneSearching);
                   $scope.uploadSuccess = true;
                   window.setTimeout(function(){
                    $scope.$apply();
                    //this.doneSearching = false;
                  },2000);
                 }
               });
          }
          });
          file.upload = Upload.upload({
              url: '/uploads',
              data: {file: file}
          });
          var filename = file.name;
          var path = '/uploads';
          var type = file.type;
          switch (type) {
            case 'text':
            //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
            var method = 'readAsText';
            var encoding = 'utf8';
            break;
            case 'binary':
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
            default:
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
          }
          /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log('success maybe?');
            }
          });*/
  
  
          file.upload.then(function (response) {
              $timeout(function () {
                console.log(response);
                  file.result = response.data;
                  this.Fresult = response.config.data.file;
  
                  var errs = 0;
                  var Fresult = this.Fresult;
                  console.info('this', Fresult);
              });
          }, function (response) {
              if (response.status > 0)
                  this.errorMsg = response.status + ': ' + response.data;
              else {
                console.log('else pa');
              }
          }, function (event) {
              file.progress = Math.min(100, parseInt(100.0 *
                                       event.loaded / event.total));
              this.progress = file.progress;
              if (this.progress == 100) {
                this.uploadingNow = false;
              }
              console.log(this.progress);
          });
  
      }
  };


  this.uploadManual = function(file, errFiles) {
    console.info('pasok', file);
    this.progress = 0;
    this.uploadingNow = true;
    this.f = file;
    this.errFile = errFiles && errFiles[0];
    this.fileHere = file.name;
    this.profileID = Meteor.userId();
    $scope.doneSearching = true;
    $scope.uploadSuccess = false;
    if (file) {
      console.log(file);


      this.uploader.send(file, function (error, downloadUrl) {
        if (error) {
          // Log service detailed response.
          console.error('Error uploading', this.uploader);
          alert (error);
        }
        else {
          var filename = this.fileHere;
          var profileID = Meteor.userId();

          Meteor.call('upsertManual', profileID, downloadUrl, $stateParams.jobId, function(err, result) {
                console.log(downloadUrl);
          console.log('success: ' + downloadUrl);
                if (err) {
                  console.info('err', err);
                  $scope.doneSearching = false;
                  window.setTimeout(function(){
                    $scope.$apply();
                    //this.doneSearching = false;
                  },2000);

               } else {
                 var toasted = 'New file uploaded.';
                 console.info('uploaded', err);
                 $scope.doneSearching = false;
                 console.info('doneSearching', $scope.doneSearching);
                 $scope.uploadSuccess = true;
                 window.setTimeout(function(){
                  $scope.$apply();
                  //this.doneSearching = false;
                },2000);
               }
             });
        }
        });
        file.upload = Upload.upload({
            url: '/uploads',
            data: {file: file}
        });
        var filename = file.name;
        var path = '/uploads';
        var type = file.type;
        switch (type) {
          case 'text':
          //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
          var method = 'readAsText';
          var encoding = 'utf8';
          break;
          case 'binary':
          var method = 'readAsBinaryString';
          var encoding = 'binary';
          break;
          default:
          var method = 'readAsBinaryString';
          var encoding = 'binary';
          break;
        }
        /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('success maybe?');
          }
        });*/


        file.upload.then(function (response) {
            $timeout(function () {
              console.log(response);
                file.result = response.data;
                this.Fresult = response.config.data.file;

                var errs = 0;
                var Fresult = this.Fresult;
                console.info('this', Fresult);
            });
        }, function (response) {
            if (response.status > 0)
                this.errorMsg = response.status + ': ' + response.data;
            else {
              console.log('else pa');
            }
        }, function (event) {
            file.progress = Math.min(100, parseInt(100.0 *
                                     event.loaded / event.total));
            this.progress = file.progress;
            if (this.progress == 100) {
              this.uploadingNow = false;
            }
            console.log(this.progress);
        });

    }
};

this.uploadSpecs = function(file, errFiles) {
  console.info('pasok', file);
  this.progress = 0;
  this.uploadingNow = true;
  this.f = file;
  this.errFile = errFiles && errFiles[0];
  this.fileHere = file.name;
  this.profileID = Meteor.userId();
  $scope.doneSearching = true;
  $scope.uploadSuccess = false;
  if (file) {
    console.log(file);


    this.uploader.send(file, function (error, downloadUrl) {
      if (error) {
        // Log service detailed response.
        console.error('Error uploading', this.uploader);
        alert (error);
      }
      else {
        var filename = this.fileHere;
        var profileID = Meteor.userId();

        Meteor.call('upsertSpecs', profileID, downloadUrl, $stateParams.jobId, function(err, result) {
              console.log(downloadUrl);
        console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
                $scope.doneSearching = false;
                window.setTimeout(function(){
                  $scope.$apply();
                  //this.doneSearching = false;
                },2000);

             } else {
               var toasted = 'New file uploaded.';
               console.info('uploaded', err);
               $scope.doneSearching = false;
               console.info('doneSearching', $scope.doneSearching);
               $scope.uploadSuccess = true;
               window.setTimeout(function(){
                $scope.$apply();
                //this.doneSearching = false;
              },2000);
             }
           });
      }
      });
      file.upload = Upload.upload({
          url: '/uploads',
          data: {file: file}
      });
      var filename = file.name;
      var path = '/uploads';
      var type = file.type;
      switch (type) {
        case 'text':
        //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
        var method = 'readAsText';
        var encoding = 'utf8';
        break;
        case 'binary':
        var method = 'readAsBinaryString';
        var encoding = 'binary';
        break;
        default:
        var method = 'readAsBinaryString';
        var encoding = 'binary';
        break;
      }
      /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('success maybe?');
        }
      });*/


      file.upload.then(function (response) {
          $timeout(function () {
            console.log(response);
              file.result = response.data;
              this.Fresult = response.config.data.file;

              var errs = 0;
              var Fresult = this.Fresult;
              console.info('this', Fresult);
          });
      }, function (response) {
          if (response.status > 0)
              this.errorMsg = response.status + ': ' + response.data;
          else {
            console.log('else pa');
          }
      }, function (event) {
          file.progress = Math.min(100, parseInt(100.0 *
                                   event.loaded / event.total));
          this.progress = file.progress;
          if (this.progress == 100) {
            this.uploadingNow = false;
          }
          console.log(this.progress);
      });

  }
};

this.uploadPage = function(file, errFiles) {
  console.info('pasok', file);
  $scope.pageNum = this.pageNum;
  this.progress = 0;
  this.uploadingNow = true;
  this.f = file;
  this.errFile = errFiles && errFiles[0];
  this.fileHere = file.name;
  this.profileID = Meteor.userId();
  $scope.doneSearching = true;
  $scope.uploadSuccess = false;
  if (file) {
    console.log(file);


    this.uploader.send(file, function (error, downloadUrl) {
      if (error) {
        // Log service detailed response.
        console.error('Error uploading', this.uploader);
        alert (error);
      }
      else {
        var filename = this.fileHere;
        var profileID = Meteor.userId();
        

        Meteor.call('upsertPage', profileID, downloadUrl, $stateParams.jobId, $scope.pageNum, function(err, result) {
              console.log(downloadUrl);
        console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
                $scope.doneSearching = false;
                window.setTimeout(function(){
                  $scope.$apply();
                  //this.doneSearching = false;
                },2000);

             } else {
               var toasted = 'New file uploaded.';
               console.info('uploaded', err);
               $scope.doneSearching = false;
               console.info('doneSearching', $scope.doneSearching);
               $scope.uploadSuccess = true;
               window.setTimeout(function(){
                $scope.$apply();
                //this.doneSearching = false;
              },2000);
             }
           });
      }
      });
      file.upload = Upload.upload({
          url: '/uploads',
          data: {file: file}
      });
      var filename = file.name;
      var path = '/uploads';
      var type = file.type;
      switch (type) {
        case 'text':
        //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
        var method = 'readAsText';
        var encoding = 'utf8';
        break;
        case 'binary':
        var method = 'readAsBinaryString';
        var encoding = 'binary';
        break;
        default:
        var method = 'readAsBinaryString';
        var encoding = 'binary';
        break;
      }
      /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('success maybe?');
        }
      });*/


      file.upload.then(function (response) {
          $timeout(function () {
            console.log(response);
              file.result = response.data;
              this.Fresult = response.config.data.file;

              var errs = 0;
              var Fresult = this.Fresult;
              console.info('this', Fresult);
          });
      }, function (response) {
          if (response.status > 0)
              this.errorMsg = response.status + ': ' + response.data;
          else {
            console.log('else pa');
          }
      }, function (event) {
          file.progress = Math.min(100, parseInt(100.0 *
                                   event.loaded / event.total));
          this.progress = file.progress;
          if (this.progress == 100) {
            this.uploadingNow = false;
          }
          console.log(this.progress);
      });

  }
};


this.uploadImage = function(file, errFiles) {
  console.info('pasok', file);
  this.progress = 0;
  this.uploadingNow = true;
  this.f = file;
  this.errFile = errFiles && errFiles[0];
  this.fileHere = file.name;
  this.profileID = Meteor.userId();
  $scope.doneSearching = true;
  $scope.uploadSuccess = false;
  if (file) {
    console.log(file);


    this.uploader.send(file, function (error, downloadUrl) {
      if (error) {
        // Log service detailed response.
        console.error('Error uploading', this.uploader);
        alert (error);
      }
      else {
        var filename = this.fileHere;
        var profileID = Meteor.userId();

        Meteor.call('upsertPhotos', profileID, downloadUrl, $stateParams.jobId, function(err, result) {
              console.log(downloadUrl);
        console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
                $scope.doneSearching = false;
                window.setTimeout(function(){
                  $scope.$apply();
                  //this.doneSearching = false;
                },2000);

             } else {
               var toasted = 'New file uploaded.';
               console.info('uploaded', err);
               $scope.doneSearching = false;
               console.info('doneSearching', $scope.doneSearching);
               $scope.uploadSuccess = true;
               window.setTimeout(function(){
                $scope.$apply();
                //this.doneSearching = false;
              },2000);
             }
           });
      }
      });
      file.upload = Upload.upload({
          url: '/uploads',
          data: {file: file}
      });
      var filename = file.name;
      var path = '/uploads';
      var type = file.type;
      switch (type) {
        case 'text':
        //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
        var method = 'readAsText';
        var encoding = 'utf8';
        break;
        case 'binary':
        var method = 'readAsBinaryString';
        var encoding = 'binary';
        break;
        default:
        var method = 'readAsBinaryString';
        var encoding = 'binary';
        break;
      }
      /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('success maybe?');
        }
      });*/


      file.upload.then(function (response) {
          $timeout(function () {
            console.log(response);
              file.result = response.data;
              this.Fresult = response.config.data.file;

              var errs = 0;
              var Fresult = this.Fresult;
              console.info('this', Fresult);
          });
      }, function (response) {
          if (response.status > 0)
              this.errorMsg = response.status + ': ' + response.data;
          else {
            console.log('else pa');
          }
      }, function (event) {
          file.progress = Math.min(100, parseInt(100.0 *
                                   event.loaded / event.total));
          this.progress = file.progress;
          if (this.progress == 100) {
            this.uploadingNow = false;
          }
          console.log(this.progress);
      });

  }
};

  }

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }
   
  save() {
    Jobs.update({
      _id: this.job._id
    }, {
      $set: {
        title: this.job.title,
        description: this.job.description,
        location: this.job.location,
        hours: this.job.hours,
        years: this.job.years,
        group: this.job.group,
        support: this.job.support,
        status: this.job.status
      }
    }, (error) => {
        if (error) {
          console.log('Oops, unable to update the job...');
        } else {
          console.log('Done!');
        }
    });
  }
}
 
const name = 'jobdetails';

//Jobdetails.$inject = ['$scope', '$reactive', '$stateParams'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$stateParams', '$state', 'Upload', Jobdetails]
})
.config(['$stateProvider',
function($stateProvider) {
    //'ngInject';
    $stateProvider
      .state('jobdetails', {
        url: '/jobdetails/:stateHolder/:jobId',
        template: '<jobdetails></jobdetails>',
    
        resolve: {
            currentUser($q, $state) {
                if (Meteor.userId() === null) {
                    return $q.reject('AUTH_REQUIRED');
                } else {
                  return $q.resolve();
                };
            }
        },
        onEnter: ['$rootScope', '$stateParams', '$state', function ($rootScope, $stateParams, $state) {
          $rootScope.stateHolder = $stateParams.stateHolder;
      }]
      });
    }
]);

