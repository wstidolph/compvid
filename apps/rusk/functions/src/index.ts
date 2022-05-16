"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
exports.logMetadata = exports.helloWorld = void 0;
// const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-var-requires */
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
// const functions = tslib_1.__importStar(require("firebase-functions"));
// The Firebase Admin SDK to access Firebase Features from within Cloud Functions.
// const admin = tslib_1.__importStar(require("firebase-admin"));

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const https = require("https");
const axios = require("axios");
const path = require('path');
const os = require('os');
const fs = require('fs');
// import * as https from 'https';
// import axios from 'axios';
// import * as path from 'path';
// import * as os from 'os';
// import * as fs from 'fs';
const got = require('got');
const FileType = require('file-type');
// const crypto = require('crypto');
// const spawn = require('child-process-promise').spawn;
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage();
// The Firebase Admin SDK to access Firebase Features from within Cloud Functions.
// import * as admin from 'firebase-admin';
admin.initializeApp();
// Set up extra settings. Since May 29, 2020, Firebase Firebase Added support for
// calling FirebaseFiresore.settings with { ignoreUndefinedProperties: true }.
// When this parameter is set, Cloud Firestore ignores undefined properties
// inside objects rather than rejecting the API call.
admin.firestore().settings({
    ignoreUndefinedProperties: true,
});
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from Firebase!');
});

exports.logMetadata = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  functions.logger.info('storage object created', object.name, object.contentType);
  // Create random filename with same extension as uploaded file.
  // const randomFileName = crypto.randomBytes(20).toString('hex') + path.extname(filePath);
  // const tempLocalFile = path.join(os.tmpdir(), randomFileName);
  // functions.logger.info('temp local filename is', tempLocalFile);
  // Exit if this is triggered on a file that is not an image.
  if (!object.contentType.startsWith('image/')) {
      functions.logger.log('This is not an image.');
      return null;
  }

  const bucket = gcs.bucket(object.bucket);
  const theFile = bucket.file(filePath);
  const [metadata] = await theFile.getMetadata();
  // functions.logger.info('metadata is ', metadata);
  functions.logger.debug('metadata mediaLink is ', metadata.mediaLink);
  return;
});

/**
 * @author Mahmud Ahsan
 * based on following:
 * https://gist.githubusercontent.com/mahmudahsan/0cbc1ba4bec7bed371ef48258e3143db/raw/32032d396c875c28b7eb29fd2ba23a09a6662070/firebase8.js
 * https://thinkdiff.net/how-to-upload-files-from-firebase-cloud-functions-to-firebase-cloud-storage-9d8b1a0f65e5
 */



// Collections
const collection = "picdocs"; // the firestore collection for the PicDocs
const imageBucket = "images/"; // on firebase Storage
/*
* when new item created in 'collection' this checks to see if it has
* a 'mediaUrl' and if so it captures that image in an 'images' bucket.
* The image 'name' is taken from the input doc's 'storageId' field
*/
exports.downloadPhotoOnCreatePicdoc = functions.firestore.document(`${collection}/{id}`).onCreate(async (snapshot,context) => {
    const data = snapshot.data();
    functions.logger.info('snapshot data', data);
    const mediaUrl = data.mediaUrl;
    const storageMediaId = data.storageId;
    let tmpDownloadedFile = null;
    // don't do anything if there's already a Cloud Storage URL assigned
    // or if there's no remote media define
    if (data.downloadURL) {
        return;
    }
    if (!mediaUrl) {
        functions.logger.warn(`downloadPhotoOnCreate function no remote mediaUrl, nothing downloaded, picdoc ${mediaUrl}`);
        return; // no existing file, and no info on what to load
    }
    if (!storageMediaId) {
        functions.logger.warn(`downloadPhotoOnCreate function no storageId provided, picdoc ${data}`);
        return; // must have a storageMediaId to name the file in the bucket
    }
    // TODO ensure storageMediaId is unique in the bucket
    functions.logger.log('incoming picdoc has storageMediaId ', storageMediaId);
    functions.logger.log('incoming picdoc has id ', context.params?.documentId);
    try {
        // Step 1: Download mediaUrl to temporary directory
        tmpDownloadedFile = await downloadRemoteUrlImage(mediaUrl, storageMediaId);
        functions.logger.log("Download Complete: File Path: " + tmpDownloadedFile.filePath + " - File Name: ", tmpDownloadedFile.fileName, "mime: " + tmpDownloadedFile.mime);
        // Step 2: Upload to Firestore Storage
        await uploadLocalFileToStorage(tmpDownloadedFile.filePath, tmpDownloadedFile.fileName, tmpDownloadedFile.mime);
        // Step 3: Update `collection`

        const bucket = admin.storage().bucket();
        const theFile = bucket.file(`${imageBucket}${tmpDownloadedFile.fileName}`);
        const [metadata] = await theFile.getMetadata();
        const mediaLink = metadata.mediaLink;
        functions.logger.info('adding mediaLink of ', mediaLink);

        return snapshot.ref.set({
            storageMediaId: storageMediaId,
            downloadURL: mediaLink
        }, { merge: true });
    }
    catch (error) {
        functions.logger.log("error on downloading and uploading remote media file to storage: " + error);
    }
});
/**
 *
 * @param {String} fileUrl
 * @param {String} fileName
 */
async function downloadRemoteUrlImage(fileUrl, fileName) {
    // Identify the remote file type
    let fileExt = "";
    let mime = "";
    const fileType = await retrieveStreamFileType(fileUrl);
    if (fileType) {
        fileExt = "." + fileType.ext;
        mime = fileType.mime;
    }
    const fileNameWithExt = fileName + fileExt;
    const tempFilePath = path.join(os.tmpdir(), (fileNameWithExt));
    // console.log("Temp File Path: " + tempFilePath);
    const writer = fs.createWriteStream(tempFilePath);
    return axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(response => {
        // Wait for another promise to write the file completely into disk
        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                throw new Error(err.message);
            });
            writer.on('close', () => {
                if (!error) {
                    resolve({
                        "filePath": tempFilePath,
                        "fileName": fileNameWithExt,
                        "mime": mime
                    });
                }
            });
        });
    });
}
/**
 * Retrieve the file type .jpg, .png, etc.
 * @param {String} fileUrl
 */
async function retrieveStreamFileType(fileUrl) {
    functions.logger.log('retrieveStreamFileType gets fileUrl', fileUrl);
    const stream = got.stream(fileUrl);
    functions.logger.log('retrieveStreamFileType stream is', stream);
    try {
        const fileType = await FileType.fromStream(stream);
        functions.logger.log('retrieveStreamFileType fileType is', fileType);
        return fileType;
    }
    catch (e) {
        console.error("error trying to identify remote file type: ", e);
        return null;
    }
}
/**
 * Upload the file in firestore storage
 * @param {String} filePath
 * @param {String} fileName
 */
async function uploadLocalFileToStorage(filePath, fileName, mimetype) {
    const bucket = admin.storage().bucket();
    const destination = `${imageBucket}${fileName}`;
    try {
        // Uploads a local file to the bucket
        await bucket.upload(filePath, {
            destination: destination,
            gzip: false, // if gzip then downloads blow up on gzip header check
            public: true, // so we will get a mediaLink can use as downloadURL
            metadata: {
                cacheControl: 'public, max-age=31534000',
                customMetadata: {
                    'family': 'magill'
                }
            },
        });
        functions.logger.log(`${fileName}  uploaded to /${imageBucket}${fileName}.`);
    }
    catch (e) {
        throw new Error("uploadLocalFileToStorage failed: " + e);
    }
}
const createPersistentDownloadUrl = (bucket, pathToFile, downloadToken) => {
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(pathToFile)}?alt=media&token=${downloadToken}`;
};
//# sourceMappingURL=index.js.map
