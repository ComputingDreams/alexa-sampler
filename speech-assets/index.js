/* Copyright 2017 S & G Consulting - http://computingdreams.com/ */
/* This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* Version : 0.0.1 */

'use strict';

var fs = require( 'fs' );  // So we can write the files we want

var Alexa = require( 'alexa-app' );
var app = new Alexa.app( 'Quote_Ace' );

app.intent( 'AMAZON.CancelIntent',  {}, function( req, res ) {} );

app.intent( 'AMAZON.HelpIntent',    {}, function( req, res ) {} );

app.intent( 'AMAZON.StopIntent',    {}, function( req, res ) {} );

app.intent( 'ConfirmIntent',        { 'utterances' : [ 'do confirmation test',
                                                       'test confirmation',
                                                       'confirmations check'
                                                     ] }, function( req, res ) {} );

app.intent( 'FirstVisitIntent',     { 'utterances' : [ '{|when} {|did} {I|we} first {visit|chat|talk}'
                                                     ] }, function( req, res ) {} );

app.intent( 'LastVisitIntent',      { 'utterances' : [ '{|when} {|did} {I|we} last {visit|chat|talk}'
                                                     ] }, function( req, res ) {} );


app.intent( 'NameIntent',           { 'slots' : { 'Name' : 'AMAZON.US_FIRST_NAME' },
                                      'utterances' : [ "{my name is|I'm|call me} {-|Name}",
                                                       '{change|alter|update} {|my} name {|to} {-|Name}' ] }, function( req, res ) {} );

app.intent( 'SpaceCountIntent',     { 'utterances' : [ "how many {people|astronauts} are in {|outer} space",
                                                       "how many {people|astronauts} are on the I S S",
                                                       "how many {people|astronauts} are on the {|international} space station",
                                                       "{who's|who is} on the I S S",
                                                       "{who's|who is} on the {|international} space station"
                                                     ] }, function( req, res ) {} );

app.intent( 'SpaceWhenIntent',      { 'slots' : { 'City' : 'AMAZON.US_CITY' },
                                      'utterances' : [ "{when'll|when will} {|the} I S S {be|visit|fly over} {-|City}",
                                                       "{when'll|when will} {|the} {|international} space station {be|visit|fly over} {-|City}",
                                                     ] }, function( req, res ) {} );

app.intent( 'SpaceWhereIntent',     { 'utterances' : [ "{where's|where is} {|the} I S S",
                                                       "{where's|where is} {|the} {|international} space station",
                                                     ] }, function( req, res ) {} );

app.intent( 'VisitsIntent',         { 'utterances' : [ '{|how} {|many times|often} have {I|we} {visited|chatted|talked}',
                                                       '{|how} {|many|often} {|I} {visit|visits}'
                                                     ] }, function( req, res ) {} );


fs.writeFile( 'utterances-en_US.txt', app.utterances(), function( err ) { if ( err ) console.log( "Error : " + err ); } );
fs.writeFile( 'intent-schema-en_US.json', app.schema(), function( err ) { if ( err ) console.log( "Error : " + err ); } );

app.intent( 'NameIntent',           { 'slots' : { 'Name' : 'AMAZON.GB_FIRST_NAME' },
                                      'utterances' : [ "{my name is|I'm|call me} {-|Name}",
                                                       '{change|alter|update} {|my} name {|to} {-|Name}' ] }, function( req, res ) {} );

app.intent( 'SpaceWhenIntent',      { 'slots' : { 'City' : 'AMAZON.GB_CITY' },
                                      'utterances' : [ "{when'll|when will} {|the} I S S {be|visit|fly over} {-|City}",
                                                       "{when'll|when will} {|the} {|international} space station {be|visit|fly over} {-|City}",
                                                     ] }, function( req, res ) {} );

fs.writeFile( 'utterances-en_GB.txt', app.utterances(), function( err ) { if ( err ) console.log( "Error : " + err ); } );
fs.writeFile( 'intent-schema-en_GB.json', app.schema(), function( err ) { if ( err ) console.log( "Error : " + err ); } );
