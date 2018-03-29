import _ from 'underscore';
import '../imports/api/users';

import { Meteor } from 'meteor/meteor';


   
   export function createUsers(username, password, email) {
    
     if (!this.userId) {
       throw new Meteor.Error(400, 'You have to be logged in!');
     }

     if (Meteor.isServer) {
        username = Accounts.createUser({username:username, password:password});
     }
     return username;
   }

   export function upsertNewRoleFromAdmin(userID, userRole, boatID, jobs){
    var selector = {_id: userID};
    var modifier = {$set: {
      role: userRole,
      boatID: boatID,
      jobs: jobs
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertJobsAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      jobs: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertInventoryAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      inventory: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertLogbookAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      logbook: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertEmployeesAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      employees: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertSettingsAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      settings: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function  upsertPhotoUser(profileID, downloadUrl){
    var selector = {_id: profileID};
    var modifier = {$set: {
        profilePhoto: downloadUrl
      }};
      if (Meteor.isServer) {
    var fileUpsert = Meteor.users.upsert(selector, modifier);
      }
    return fileUpsert;
  }

  export function changePasswordNow(userId, password) {
    
     if (!this.userId) {
       throw new Meteor.Error(400, 'You have to be logged in!');
     }

     if (Meteor.isServer) {
       var options = {logout : false};
        password = Accounts.setPassword(userId, password, options);
     }
     return password;
   }
    
   
   
   
   








   Meteor.methods({
       createUsers,
       upsertNewRoleFromAdmin,
       upsertJobsAccess,
       upsertInventoryAccess,
       upsertLogbookAccess,
       upsertEmployeesAccess,
       upsertSettingsAccess,
       upsertPhotoUser,
       changePasswordNow
   });