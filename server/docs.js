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

export function  upsertCvs(profileID, downloadUrl){
  var selector = {userID: profileID,
    fileType:'cv'};
  var modifier = {$set: {
      downloadurl: downloadUrl,
      fileType:'cv'
    }};
    if (Meteor.isServer) {
  var fileUpsert = Docs.upsert(selector, modifier);
    }
  return fileUpsert;
}

export function  upsertPassports(profileID, downloadUrl){
  var selector = {userID: profileID,
    fileType:'passport'};
  var modifier = {$set: {
      downloadurl: downloadUrl,
      fileType:'passport'
    }};
    if (Meteor.isServer) {
  var fileUpsert = Docs.upsert(selector, modifier);
    }
  return fileUpsert;
}

export function  upsertPhoto(profileID, downloadUrl){
  var selector = {userID: profileID,
    fileType:'photo'};
  var modifier = {$set: {
      downloadurl: downloadUrl,
      fileType:'photo'
    }};
    if (Meteor.isServer) {
  var fileUpsert = Docs.upsert(selector, modifier);
    }
  return fileUpsert;
}

export function  upsertLicenses(profileID, downloadUrl, certType, expDate){
  var certs = {};
  certs.userID = profileID;
  certs.downloadurl = downloadUrl;
  certs.certType = certType;
  certs.expDate = expDate;
  certs.fileType = 'license';
 
    if (Meteor.isServer) {
  var fileUpsert = Docs.insert(certs);
    }
  return fileUpsert;
}

export function  upsertMisc(profileID, downloadUrl, fileName, desc){
  var miscs = {};
  miscs.userID = profileID;
  miscs.downloadurl = downloadUrl;
  miscs.fileName = fileName;
  miscs.desc = desc;
  miscs.fileType = 'misc';
 
    if (Meteor.isServer) {
  var fileUpsert = Docs.insert(miscs);
    }
  return fileUpsert;
}
   

Meteor.methods({
  upsertDrawing,
  upsertManual,
  upsertSpecs,
  upsertPage,
  upsertCvs,
  upsertPassports,
  upsertPhoto,
  upsertLicenses,
  upsertMisc
});