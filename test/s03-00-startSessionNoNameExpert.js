/* Copyright 2017 S & G Consulting - http://computingdreams.com/ */
/* This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* Version : 0.0.1 */

process.env.AWS_REGION = 'us-east-1';

var expect = require( 'chai' ).expect,
    lambda = require( '../src/index.js' )

const context = require( 'aws-lambda-mock-context' );
const ctx = context();

describe( 'S3 - 00 - When Starting a Session - Returning no name user >= 30 min, Expert', function() {  
    var speechResponse = null
    var speechError = null

    // Fires once for the group of tests, done is mocha's callback to 
    // let it know that an   async operation has completed before running the rest 
    // of the tests, 2000ms is the default timeout though
    before( function( done ) {
        //This fires the event as if a Lambda call was being sent in
        lambda.handler( {
           "session": {
              "new": true,
              "sessionId": "session1234",
              "attributes": {
                 "sessionCount": 6,
                 "firstSession": new Date().toUTCString(),
                 "lastSession": ( new Date( new Date() - ( 30 * 60 * 1000 ) ) ).toUTCString()
              },
              "user": {
                 "userId": "testUser"
              },
              "application": {
                 "applicationId": "amzn1.ask.skill.94faefe4-49dd-4ec2-8bf9-2a18fa4b8024"
              }
           },
           "version": "1.0",
           "request": {
              "locale": "en-US",
              "type": "LaunchRequest",
              "requestId": "request5678"
           }
       },ctx )

       //Captures the response and/or errors
       ctx.Promise
           .then( resp => { speechResponse = resp; done(); } )
           .catch( err => { speechError = err; done();} )
    } )


    describe( 'The response is structurally correct for Alexa Speech Services', function() {
        it( 'should not have errored',function() { expect ( speechError ).to.be.null } )

        it( 'should have a version', function() { expect( speechResponse.version ).not.to.be.null } )

        it( 'should have a speechlet response', function() { expect( speechResponse.response ).not.to.be.null } )

        it( 'should have session attributes', function() { expect( speechResponse.sessionAttributes ).not.to.be.null } )

        it( 'should leave the Alexa session open', function() {
            expect( speechResponse.response.shouldEndSession ).not.to.be.null
            expect( speechResponse.response.shouldEndSession ).to.be.false
        } )
    } )

    describe( 'Attributes are completely defined', function() {
        it( 'sessionCount is 6', function() {
            expect( speechResponse.sessionAttributes.sessionCount ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.sessionCount ).to.equal( 6 )
        } )

        it( 'lastSession has value', function() {
            expect( speechResponse.sessionAttributes.lastSession ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.lastSession ).not.to.be.null
        } )

        it( 'firstSession has value', function() {
            expect( speechResponse.sessionAttributes.firstSession ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.firstSession ).not.to.be.null
        } )

        it( 'name is blank', function() {
            expect( speechResponse.sessionAttributes.name ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.name ).to.equal( ' ' )
        } )

        it( 'nextState exists', function() {
            expect( speechResponse.sessionAttributes.nextState ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.nextState ).to.equal( ' ' )
        } )
    } )

    describe( 'Directives response is not defined', function() {
        it( 'directives does not exists', function() {
            expect( speechResponse.response.directives ).to.be.undefined
        } )
    } )

    describe( 'Speech response is as expected', function() {
        it( 'output speech exists', function() {
            expect( speechResponse.response.outputSpeech ).not.to.be.undefined
            expect( speechResponse.response.outputSpeech ).not.to.be.null
        } )

        it( 'output speech is ssml', function() {
            expect( speechResponse.response.outputSpeech.type ).not.to.be.undefined
            expect( speechResponse.response.outputSpeech.type ).to.equal( 'SSML' )
        } )


        it( 'output ssml contains intro', function() {
            expect( speechResponse.response.outputSpeech.ssml ).not.to.be.undefined
            expect( speechResponse.response.outputSpeech.ssml ).not.to.be.null
            expect( speechResponse.response.outputSpeech.ssml ).to.equal( "<speak> Welcome back to the Alexa Sampler.  I sure have missed you since your last visit.  What can I do for you? </speak>" )
        } )
    } )

    describe( 'Speech reprompt response is as expected', function() {
        it( 'reprompt speech exists', function() {
            expect( speechResponse.response.reprompt.outputSpeech ).not.to.be.undefined
            expect( speechResponse.response.reprompt.outputSpeech ).not.to.be.null
        } )

        it( 'reprompt speech is ssml', function() {
            expect( speechResponse.response.reprompt.outputSpeech.type ).not.to.be.undefined
            expect( speechResponse.response.reprompt.outputSpeech.type ).to.equal( 'SSML' )
        } )


        it( 'reprompt ssml contains intro', function() {
            expect( speechResponse.response.reprompt.outputSpeech.ssml ).not.to.be.undefined
            expect( speechResponse.response.reprompt.outputSpeech.ssml ).not.to.be.null
            expect( speechResponse.response.reprompt.outputSpeech.ssml ).to.equal( '<speak> You can ask for the weather, visits, first visit, last visit or to change your name? </speak>' )
        } )
    } )
} )
