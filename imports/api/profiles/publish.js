import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Profiles } from './collection';

if (Meteor.isServer) {
   Meteor.publish('profiles', function(options, searchString) {
   const selector = {};

   if (typeof searchString === 'string' && searchString.length) {
    selector.name = {
      $regex: `.*${searchString}.*`,
      $options : 'i'
    };
  }

   Counts.publish(this, 'numberOfProfiles', Profiles.find(selector), {
    noReady: true
  });

   return Profiles.find(selector, options);
 });
}