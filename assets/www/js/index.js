/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        var self = this;
        document.addEventListener('deviceready', function() { self.onDeviceReady(); }, false);
        // document.addEventListener('DOMContentLoaded', function() { self.onDocumentLoad(); }, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        var self = this;
        //Device is ready
        console.log("OFFLINEMAP : deviceReady");

        var localFileName = 'test.mbtiles';
        var remoteFile = 'http://dl.dropbox.com/u/14814828/OSMBrightSLValley.mbtiles';

        self.downloadMbTiles(localFileName, remoteFile, self.buildMap);
    },

    onDocumentLoad : function() {
        var map = L.mapbox.map('map')
        .setView([40.6681, -111.9364], 11);

        var layer = L.mapbox.tileLayer("examples.map-20v6611k");

        map.addLayer(layer);
    },

    downloadMbTiles: function(localFileName, remoteFile, callBack) {
        var fs;             // file system object
        var ft;             // TileTransfer object
        var self = this;
        
        console.log('OFFLINEMAP: requesting file system...');
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            console.log('OFFLINEMAP: file system retrieved.');
            fs = fileSystem;

            // check to see if files already exists
            var file = fs.root.getFile(localFileName, {create: false}, function () {
                // file exists
                console.log('OFFLINEMAP: exists');
                console.log("OFFLINEMAP: DB" +fs.root.fullPath + '/' + localFileName);

                console.log('OFFLINEMAP: File already exists on device. Building map...');

                callBack(localFileName);
            }, function () {
                // file does not exist
                console.log('OFFLINEMAP: does not exist');

                console.log('OFFLINEMAP :Downloading file ...'+remoteFile);

                console.log('OFFLINEMAP : downloading sqlite file...');
                ft = new FileTransfer();
                ft.download(remoteFile, fs.root.fullPath + '/' + localFileName, function (entry) {
                    console.log('OFFLINEMAP : download complete: ' + entry.fullPath);

                    callBack(localFileName);

                }, function (error) {
                    console.log('OFFLINEMAP : error with download', error);
                });
            });
        });
    },

    buildMap : function(localFileName) {
        console.log("OFFLINEMAP : openDatabase :" + localFileName);

        var db = new sqlitePlugin.openDatabase({name:localFileName});

        console.log("OFFLINEMAP : set map");

        var map = L.mapbox.map('map')
        .setView([40.6681, -111.9364], 11);

        var layer = new L.TileLayer.MBTiles({maxZoom: 14, tms: true}, db);

        map.addLayer(layer);
    }

};
