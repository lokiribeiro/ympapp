import _ from 'underscore';
import { Profiles } from '../imports/api/profiles';

import { Meteor } from 'meteor/meteor';
  
export function  upsertProfilePhoto(profileID, downloadUrl){
  var selector = {_id: profileID};
  var modifier = {$set: {
      profilePhoto: downloadUrl
    }};
    if (Meteor.isServer) {
  var fileUpsert = Profiles.upsert(selector, modifier);
    }
  return fileUpsert;
}
  

Meteor.methods({
    upsertProfilePhoto
});