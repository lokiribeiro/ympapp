import { Mongo } from 'meteor/mongo';

export const Jobs = new Mongo.Collection('jobs');

Jobs.allow({
 insert(userId, job) {
   return userId && job.owner === userId;
 },
 update(userId, job, fields, modifier) {
   return userId && job.owner === userId;
 },
 remove(userId, job) {
   return userId && job.owner === userId;
 }
});