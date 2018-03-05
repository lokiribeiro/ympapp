import _ from 'underscore';
import { Docs } from '../imports/api/docs';

import { Meteor } from 'meteor/meteor';
  
export function  upsertDrawing(profileID, downloadUrl, jobID){
  var selector = {jobID: jobID,
    fileType:'drawings'};
  var modifier = {$set: {
      downloadurl: downloadUrl,
      fileType:'drawings',
      userID: profileID
    }};
    if (Meteor.isServer) {
  var fileUpsert = Docs.upsert(selector, modifier);
    }
  return fileUpsert;
}

export function  upsertManual(profileID, downloadUrl, jobID){
  var selector = {jobID: jobID,
    fileType:'manual'};
  var modifier = {$set: {
      downloadurl: downloadUrl,
      fileType:'manual',
      userID: profileID
    }};
    if (Meteor.isServer) {
  var fileUpsert = Docs.upsert(selector, modifier);
    }
  return fileUpsert;
}

export function  upsertSpecs(profileID, downloadUrl, jobID){
  var selector = {jobID: jobID,
    fileType:'specification'};
  var modifier = {$set: {
      downloadurl: downloadUrl,
      fileType:'specification',
      userID: profileID
    }};
    if (Meteor.isServer) {
  var fileUpsert = Docs.upsert(selector, modifier);
    }
  return fileUpsert;
}

export function  upsertPage(profileID, downloadUrl, jobID, page){
  var pages = {};
  pages.userID = profileID;
  pages.downloadurl = downloadUrl;
  pages.jobID = jobID;
  pages.page = page;
  pages.fileType = 'page';
 
    if (Meteor.isServer) {
  var fileUpsert = Docs.insert(pages);
    }
  return fileUpsert;
}
   

Meteor.methods({
  upsertDrawing,
  upsertManual,
  upsertSpecs,
  upsertPage
});