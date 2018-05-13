import _ from 'underscore';
import { Watchkeepers } from '../imports/api/watchkeepers';

import { Meteor } from 'meteor/meteor';
  
export function  upsertMonday(watchkeeperID, monday, dayMonday){
  var selector = {_id: watchkeeperID};
  var modifier = {$set: {
      monday: monday,
      dayMonday: dayMonday
    }};
    if (Meteor.isServer) {
        var watchUpsert = Watchkeepers.upsert(selector, modifier);
    }
  return watchUpsert;
}

export function  upsertTuesday(watchkeeperID, tuesday, dayTuesday){
    var selector = {_id: watchkeeperID};
    var modifier = {$set: {
        tuesday: tuesday,
        dayTuesday: dayTuesday
      }};
      if (Meteor.isServer) {
          var watchUpsert = Watchkeepers.upsert(selector, modifier);
      }
    return watchUpsert;
  }

  export function  upsertWednesday(watchkeeperID, wednesday, dayWednesday){
    var selector = {_id: watchkeeperID};
    var modifier = {$set: {
        wednesday: wednesday,
        dayWednesday: dayWednesday
      }};
      if (Meteor.isServer) {
          var watchUpsert = Watchkeepers.upsert(selector, modifier);
      }
    return watchUpsert;
  }

  export function  upsertThursday(watchkeeperID, thursday, dayThursday){
    var selector = {_id: watchkeeperID};
    var modifier = {$set: {
        thursday: thursday,
        dayThursday: dayThursday
      }};
      if (Meteor.isServer) {
          var watchUpsert = Watchkeepers.upsert(selector, modifier);
      }
    return watchUpsert;
  }

  export function  upsertFriday(watchkeeperID, friday, dayFriday){
    var selector = {_id: watchkeeperID};
    var modifier = {$set: {
        friday: friday,
        dayFriday: dayFriday
      }};
      if (Meteor.isServer) {
          var watchUpsert = Watchkeepers.upsert(selector, modifier);
      }
    return watchUpsert;
  }

  export function  upsertSaturday(watchkeeperID, saturday, daySaturday){
    var selector = {_id: watchkeeperID};
    var modifier = {$set: {
        saturday: saturday,
        daySaturday: daySaturday
      }};
      if (Meteor.isServer) {
          var watchUpsert = Watchkeepers.upsert(selector, modifier);
      }
    return watchUpsert;
  }

  export function  upsertSunday(watchkeeperID, sunday, daySunday){
    var selector = {_id: watchkeeperID};
    var modifier = {$set: {
        sunday: sunday,
        daySunday: daySunday
      }};
      if (Meteor.isServer) {
          var watchUpsert = Watchkeepers.upsert(selector, modifier);
      }
    return watchUpsert;
  }

  export function  upsertMondayUser(watchkeeperID, newUserID, name){
    var selector = {_id: watchkeeperID};
    var modifier = {$set: {
        userID: newUserID,
        name: name
      }};
      if (Meteor.isServer) {
          var watchUpsert = Watchkeepers.upsert(selector, modifier);
      }
    return watchUpsert;
  }
  
  export function  upsertTuesdayUser(watchkeeperID, newUserID, name){
      var selector = {_id: watchkeeperID};
      var modifier = {$set: {
        userID: newUserID,
        name: name
      }};
        if (Meteor.isServer) {
            var watchUpsert = Watchkeepers.upsert(selector, modifier);
        }
      return watchUpsert;
    }
  
    export function  upsertWednesdayUser(watchkeeperID, newUserID, name){
      var selector = {_id: watchkeeperID};
      var modifier = {$set: {
        userID: newUserID,
        name: name
      }};
        if (Meteor.isServer) {
            var watchUpsert = Watchkeepers.upsert(selector, modifier);
        }
      return watchUpsert;
    }
  
    export function  upsertThursdayUser(watchkeeperID, newUserID, name){
      var selector = {_id: watchkeeperID};
      var modifier = {$set: {
        userID: newUserID,
        name: name
      }};
        if (Meteor.isServer) {
            var watchUpsert = Watchkeepers.upsert(selector, modifier);
        }
      return watchUpsert;
    }
  
    export function  upsertFridayUser(watchkeeperID, newUserID, name){
      var selector = {_id: watchkeeperID};
      var modifier = {$set: {
        userID: newUserID,
        name: name
      }};
        if (Meteor.isServer) {
            var watchUpsert = Watchkeepers.upsert(selector, modifier);
        }
      return watchUpsert;
    }
  
    export function  upsertSaturdayUser(watchkeeperID, newUserID, name){
      var selector = {_id: watchkeeperID};
      var modifier = {$set: {
        userID: newUserID,
        name: name
      }};
        if (Meteor.isServer) {
            var watchUpsert = Watchkeepers.upsert(selector, modifier);
        }
      return watchUpsert;
    }
  
    export function  upsertSundayUser(watchkeeperID, newUserID, name){
      var selector = {_id: watchkeeperID};
      var modifier = {$set: {
        userID: newUserID,
        name: name
      }};
        if (Meteor.isServer) {
            var watchUpsert = Watchkeepers.upsert(selector, modifier);
        }
      return watchUpsert;
    }
  

Meteor.methods({
    upsertMonday,
    upsertTuesday,
    upsertWednesday,
    upsertThursday,
    upsertFriday,
    upsertSaturday,
    upsertSunday,
    upsertMondayUser,
    upsertTuesdayUser,
    upsertWednesdayUser,
    upsertThursdayUser,
    upsertFridayUser,
    upsertSaturdayUser,
    upsertSundayUser
});