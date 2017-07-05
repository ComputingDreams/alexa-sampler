/* Copyright 2017 S & G Consulting - http://computingdreams.com/ */
/* This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* Version : 0.0.1 */


'use strict';

var   debug = false;

const Alexa = require( 'alexa-sdk' );
const http  = require( 'http' );
const https = require( 'https' );

const APP_ID = 'amzn1.ask.skill.94faefe4-49dd-4ec2-8bf9-2a18fa4b8024';

const EXPERT_LEVEL = 5;                // How many sessions before a user is an 'expert'
const NEEDY_TIME   = 30 * 60 * 1000;   // The number of milliseconds before she gets a little needy, currently 30 mins
const LIKE_COUNT   = 30;               // How many sessions before your 'really like' this skill

const ISS_HOST     = 'api.open-notify.org';
const MAP_HOST     = 'maps.googleapis.com';

const languageStrings = {
  'en-GB': {
    translation: {
      SKILL_NAME: 'Welcome to the Alexa Sampler.  ',
      CELEBRATE_MESSAGE: [ 'Way to go!', 'Good Job!', 'Outstanding!', 'Awesome!', "That's Amazing!", 'Whooo hoooo!', 'Incredible!', 'Impressive' ],
      CONFIRM_REQUEST: [ 'Done!', 'Got it!', 'All set!' ],
      DISCONFIRM_REQUEST: [ 'No Problem.', 'Of Course.', 'Gotcha.' ],
      START_MESSAGE: [ 'Hello', 'Hi', 'Ciao', 'There you are', 'Salutations', 'Greetings', 'Namaste', 'Ahoy' ],
      STOP_MESSAGE: [ 'Cheers!', 'Goodbye!', 'Later!', 'Farewell!', 'Bye!', 'So Long!' ],
      AND: ' and ',
      DT_JOIN: ' at ',
      ERROR: 'Oops, something went wrong.  Please try again later.',
      CONFIRM_PROMPT: 'Do you want to continue?',
      CONFIRM_REPROMPT: 'Continue, yes or no?',
      CONFIRM_NO: 'You did not confirm the last request.  ',
      CONFIRM_YES: 'You confirmed the last request.  ',
      FIRST_TIME: "You're new around here, what's your name?",
      FIRST_VISIT: "You're first visit was on ",
      LAST_VISIT: "You're last visit was on ",
      TOTAL_VISITS_A: "You have visited me ",
      TOTAL_VISITS_B: " times.  ",
      TOTAL_VISITS_C: "  You must really like me!  ",
      HELP_SHORT: 'You can ask for the weather, visits, first visit, last visit or to change your name?',
      HELP_LONG: "  You can ask for the weather, how many times you've visited, when you first visited, when you last visited, and you can change your name.  What would you like to do?",
      HELP_REPROMPT: 'Do you want weather, visits, first visit, last visit or to change your name?',
      MAIN_PROMPT: 'What can I do for you?',
      WELCOME_PROMPT: 'Welcome back.  ',
      NEEDY_PROMPT: 'Welcome back to the Alexa Sampler.  I sure have missed you since your last visit.  ',
      NEW_REPROMPT: "Since you're new around here do you want me to show you around?",
      BAD_NAME: "I'm sorry, I didn't get your name.  What should I call you?",
      NAME_CHANGE: '  Name changed to ',
      SET_NAME_A: "It's nice to meet you ",
      SET_NAME_B: '.  Would you like me to show you around?',
      SET_NAME_REPROMPT: 'What name should I call you?',
      SPACE_COUNT_SINGLE: 'There is one person in space. ',
      SPACE_COUNT_MULTI_A: 'There are ',
      SPACE_COUNT_MULTI_B: ' people in space. ',
    }
  },
  'en-US': {
    translation: {
      SKILL_NAME: 'Welcome to the Alexa Sampler.  ',
      CELEBRATE_MESSAGE: [ 'Way to go!', 'Good Job!', 'Outstanding!', 'Awesome!', "That's Amazing!", 'Whooo hoooo!', 'Incredible!', 'Impressive' ],
      CONFIRM_REQUEST: [ 'Done!', 'Got it!', 'All set!' ],
      DISCONFIRM_REQUEST: [ 'No Problem!', 'No Worries!', 'Gotcha!' ],
      START_MESSAGE: [ 'Hello', 'Hi', 'Aloha', 'There you are', 'Salutations', 'Greetings', 'Howdy', 'Namaste', "How's tricks", 'Ahoy' ],
      STOP_MESSAGE: [ 'Come back soon', 'Goodbye!', 'Adios!', 'Hasta la Vista, Baby!', 'Farewell!', 'Bye!', 'So Long!', 'Later!' ],
      AND: ' and ',
      DT_JOIN: ' at ',
      ERROR: 'Oops, something went wrong.  Please try again later.',
      CONFIRM_PROMPT: 'Do you want to continue?',
      CONFIRM_REPROMPT: 'Continue, yes or no?',
      CONFIRM_NO: 'You did not confirm the last request.  ',
      CONFIRM_YES: 'You confirmed the last request.  ',
      FIRST_TIME: "You're new around here, what's your name?",
      FIRST_VISIT: "You're first visit was on ",
      LAST_VISIT: "You're last visit was on ",
      TOTAL_VISITS_A: "You have visited me ",
      TOTAL_VISITS_B: " times.  ",
      TOTAL_VISITS_C: "  You must really like me!  ",
      HELP_SHORT: 'You can ask for the weather, visits, first visit, last visit or to change your name?',
      HELP_LONG: "  You can ask for the weather, how many times you've visited, when you first visited, when you last visited, and you can change your name.  What would you like to do?",
      HELP_REPROMPT: 'Do you want weather, visits, first visit, last visit or to change your name?',
      MAIN_PROMPT: 'What can I do for you?',
      WELCOME_PROMPT: 'Welcome back.  ',
      NEEDY_PROMPT: 'Welcome back to the Alexa Sampler.  I sure have missed you since your last visit.  ',
      NEW_REPROMPT: "Since you're new around here do you want me to show you around?",
      BAD_NAME: "I'm sorry, I didn't get your name.  What should I call you?",
      NAME_CHANGE: '  Name changed to ',
      SET_NAME_A: "It's nice to meet you ",
      SET_NAME_B: '.  Would you like me to show you around?',
      SET_NAME_REPROMPT: 'What name should I call you?',
      SPACE_COUNT_SINGLE: 'There is one person in space. ',
      SPACE_COUNT_MULTI_A: 'There are ',
      SPACE_COUNT_MULTI_B: ' people in space. ',
    }
  }
};

const handlers = {
  'AMAZON.CancelIntent'    : function() { logIt( "CancelIntent handler" );        this.emit( 'AMAZON.StopIntent' ); },
  'AMAZON.HelpIntent'      : function() { logIt( "HelpIntent handler" );          this.emit( ':ask', this.t( 'HELP_LONG' ), this.t( 'HELP_REPROMPT' ) ); },
  'AMAZON.StopIntent'      : function() { logIt( "StopIntent handler" );          endSession.call( this, getRandomPrompt( this.t( 'STOP_MESSAGE' ), true ), false, true ); },
  'ConfirmIntent'          : function() { logIt( "ConfirmIntent handler" );       doConfirm.call( this ); },
  'FirstVisitIntent'       : function() { logIt( "FirstVisitIntent handler" );    doFirstVisit.call( this ); },
  'LastVisitIntent'        : function() { logIt( "LastVisitIntent handler" );     doLastVisit.call( this ); },
  'NameIntent'             : function() { logIt( "NameIntent handler" );          doName.call( this ); },
  'SpaceCountIntent'       : function() { logIt( "SpaceCountIntent handler" );    doSpaceCount.call( this ); },
  'SpaceWhenIntent'        : function() { logIt( "SpaceWhenIntent handler" );     doSpaceWhen.call( this ); },
  'SpaceWhereIntent'       : function() { logIt( "SpaceWhereIntent handler" );    doSpaceWhere.call( this ); },
  'VisitsIntent'           : function() { logIt( "VisitsIntent handler" );        doVisits.call( this ); },
  'LaunchRequest'          : function() { logIt( "LaunchRequest handler" );       doMain.call( this ); },
  'NewSession'             : function() { logIt( "NewSession handler" );          doNewSession.call( this ); },
  'SessionEndedRequest'    : function() { logIt( "SessionEndedRequest handler" ); endSession.call( this, undefined, false, false ); },
  "Unhandled"              : function() { logIt( "Unhandled handler" );           this.emit( 'AMAZON.StopIntent' ); }
};


// Intent function for return information on the user's first visit to the app
function doConfirm()
{
   if ( this.event.request.intent.confirmationStatus === 'CONFIRMED' )
   {
      endSession.call( this, this.t( 'CONFIRM_YES' ) );
   }
   else if ( this.event.request.intent.confirmationStatus != 'DENIED' )
   {
      this.emit( ':confirmIntent', this.t( 'CONFIRM_PROMPT' ), this.t( 'CONFIRM_REPROMPT' ) );
   }
   else
   {
      endSession.call( this, this.t( 'CONFIRM_NO' ) );
   }
}

// Intent function for return information on the user's first visit to the app
function doFirstVisit()
{
   endSession.call( this, this.t( 'FIRST_VISIT' ) + this.attributes.firstSession + '.  ' );
}

// Intent function for return information on the user's last visit to the app
function doLastVisit()
{
   endSession.call( this, this.t( 'LAST_VISIT' ) + this.attributes.lastSession + '.  ' );
}

// Intent function for invoking the main menu
function doMain()
{
   var promptStr = '';
   var repromptStr = '';

   if ( this.attributes.sessionCount === 0 )
   {
      promptStr += this.t( 'SKILL_NAME' );
      promptStr += this.t( 'FIRST_TIME' );
      repromptStr += this.t( 'SET_NAME_REPROMPT' );
   }
   else
   {
      if ( this.event.session.new === true )
      {
         // How long since they were last here?
         var timeSince = (new Date()) - (new Date( this.attributes.lastSession ));

         logIt( "timeSince = " + timeSince + ", needy time = " + NEEDY_TIME );

         if ( this.attributes.name != ' ' )
         {
            promptStr += getRandomPrompt( this.t( 'START_MESSAGE' ) ) + this.attributes.name + ', ';
         }

         if ( timeSince < NEEDY_TIME )
         {
            promptStr += this.t( 'WELCOME_PROMPT' );
         }
         else
         {
            promptStr += this.t( 'NEEDY_PROMPT' );
         }
      }

      promptStr += this.t( 'MAIN_PROMPT' );
      repromptStr += this.t( this.attributes.sessionCount > EXPERT_LEVEL ? 'HELP_SHORT' : 'HELP_LONG' );
   }

   this.emit( ':ask', promptStr, repromptStr );
}

// Intent function for setting the user's name.  Does all slot validation and then emits proper message
function doName()
{
   this.attributes.lastText = ' '; 

   var name = slotValid( this.event.request, 'Name' ) ? this.event.request.intent.slots.Name.value  : undefined;

   if ( name === undefined )
   {
      this.emit( ':ask', this.t( 'BAD_NAME' ), this.t( 'SET_NAME_REPROMPT' ) );
   }
   else if ( this.attributes.name === ' ' )
   {
      this.attributes.name = name;
      this.attributes.nextState = 'tour';
      this.emit( ':ask', getRandomPrompt( this.t( 'CONFIRM_REQUEST' ) ) + this.t( 'SET_NAME_A' ) + name + this.t( 'SET_NAME_B' ), this.t( 'NEW_REPROMPT' ) );
   }
   else
   {
      this.attributes.name = name;
      this.attributes.nextState = ' ';
      endSession.call( this, getRandomPrompt( this.t( 'CONFIRM_REQUEST' ) ) + this.t( 'NAME_CHANGE' ) + name + '.  ' );
   }
}

// Launch request function for starting a new session
function doNewSession()
{
   initAttributes.call( this );

   var requestName = this.event.request.type == 'LaunchRequest' ? 'LaunchRequest' : this.event.request.intent.name;

   if ( handlers[ requestName ] !== undefined )
   {
      // We defined this handler, so go ahead and call it.
      this.emit( requestName );
   }
   else
   {
      // We don't know it, so invoke unhandled
      this.emit( 'Unhandled' );
   }
}

// Intent function for return information on the user's total visits to the app
function doVisits()
{
   // Tell the user how many times we've seen them.  Don't forget to include this visit
   var count = this.attributes.sessionCount + 1;
   var promptStr = this.t( 'TOTAL_VISITS_A' ) + sayAs( 'number', count ) + this.t( 'TOTAL_VISITS_B' );

   if ( count > LIKE_COUNT )
   {
      promptStr += this.t( 'TOTAL_VISITS_C' );
   }

   endSession.call( this, promptStr );
}

// Intent function for processing how many folks are in space
function doSpaceCount()
{
   var options = {
     host: ISS_HOST,
     path: '/astros.json',
     method: 'GET',
     port: 80
   };

   getRequest.call( this, http, options, function ( resp ) {
      var msg = '';
      var withCard = false;

      try
      {
         var obj = JSON.parse( resp );
         var people = obj.people;
         const numPeople = people.length;
         msg = numPeople == 1 ? this.t( 'SPACE_COUNT_SINGLE' ) : ( this.t( 'SPACE_COUNT_MULTI_A' ) + numPeople + this.t( 'SPACE_COUNT_MULTI_B' ) );

         var lastPerson = people.pop();

         people.forEach( function( person ) { msg += person.name + ', '; } );

         msg = msg.substr( 0, msg.length - 2 ) + this.t( 'AND' ) + lastPerson.name + '.  ';
         withCard = true;
      }
      catch( e )
      {
         msg = this.t( 'ERROR' );
      }

      endSession.call( this, msg, withCard );
   } );
}

// Intent function for processing when the ISS will be somewhere
function doSpaceWhen()
{
   var city = slotValid( this.event.request, 'City' ) ? this.event.request.intent.slots.City.value  : undefined;

   if ( city === undefined )
   {
      this.emit( ':ask', this.t( 'BAD_CITY' ), this.t( 'CITY_REPROMPT' ) );
   }
   else
   {
      var options = {
        host: MAP_HOST,
        path: '/maps/api/geocode/json?address=' + encodeURI( city ),
        method: 'GET'
      };

      getRequest.call( this, https, options, function ( resp ) {
         var msg = '';
         var withCard = false;

         try
         {
            var obj = JSON.parse( resp );

            var options = {
               host: ISS_HOST,
               path: '/iss-pass.json?lat=' + obj.results[ 0 ].geometry.location.lat + '&lon=' + obj.results[ 0 ].geometry.location.lng,
               method: 'GET',
               port: 80
            };

            getRequest.call( this, http, options, function ( resp ) {
               try
               {
                  var obj = JSON.parse( resp );
                  const timeInMillis = obj.response[ 0 ].risetime * 1000;
                  const nowInMillis = new Date().getTime();
                  const time = new Date(timeInMillis - nowInMillis);
                  const hoursString = time.getHours() > 0 ? time.getHours() + ' hours and ' : '';
                  
                  msg = 'The I S S will fly over ' + city + ' in ' + hoursString + time.getMinutes() + ' minutes.  ';
                  withCard = true;
               }
               catch( e )
               {
                  msg = this.t( 'ERROR' );
               }

               endSession.call( this, msg, withCard );

           } );
         }
         catch( e )
         {
            msg = this.t( 'ERROR' );

            endSession.call( this, msg, withCard );
         }
      } );
   }
}

// Intent function for processing where the ISS
function doSpaceWhere()
{
   var options = {
      host: ISS_HOST,
      path: '/iss-now.json',
      method: 'GET',
      port: 80
   };

   getRequest.call( this, http, options, function ( resp ) {
      var msg = '';
      var withCard = false;

      try
      {
         var obj = JSON.parse( resp );

         var options = {
            host: MAP_HOST,
            path: '/maps/api/geocode/json?latlng=' + encodeURI( obj.iss_position.latitude + ',' + obj.iss_position.longitude ),
            method: 'GET'
         };

         getRequest.call( this, https, options, function ( resp ) {
            try
            {
               var obj = JSON.parse( resp );
               const address = obj.results.length > 0 ? obj.results[ 0 ].formatted_address : ' an unidentified land mass or open ocean';

               msg = 'The I S S is currently over ' + address + '.  ';
               withCard = true;
            }
            catch( e )
            {
               msg = this.t( 'ERROR' );
            }

            endSession.call( this, msg, withCard );

        } );
      }
      catch( e )
      {
         msg = this.t( 'ERROR' );

         endSession.call( this, msg, withCard );
      }
   } );
}

// Helper function to consistently exit the skill in the event of a failure
function endSession( msg, withCard, forceClose )
{
   logIt( "calling endSession, msg = '" + msg + "'" );
   logIt( "calling endSession, withCard = '" + withCard + "'" );
   logIt( "calling endSession, forceClose = " + forceClose  );
   logIt( "calling endSession, session = '" + JSON.stringify( this.event.session ) );
   logIt( "calling endSession, attributes = " + JSON.stringify( this.attributes ) );
   
   if ( msg === undefined || this.event.session.new === true || forceClose === true )
   {
      updateSessionAttributes.call( this );

      if ( msg === undefined )
      {
         logIt( "Ending session with save" );
         this.emit( ':saveState', true );
      }
      else 
      {
         logIt( "Ending session with tell and msg = " + msg );
         this.emit( withCard ? ':tellWithCard' : ':tell', msg );
      }
   }
   else
   {
      if ( msg != this.t( 'HELP_LONG' ) )
      {
         msg += this.t( 'MAIN_PROMPT' );
      }

      logIt( "Ending session with ask and msg = " + msg );
      this.emit( withCard ? ':askWithCard' : ':ask', msg, this.t( 'HELP_SHORT' ) );
   }
}

// Helper fuction to generate a random number no greater than max
function getRandom( max )
{
   var result;

   logIt( "getRandom max is " + max );

   result = Math.floor( Math.random() * max ) + 1;

   logIt( "getRandom returning " + result );

   return result;
}

// Helper function to consistently output a random goodbye
function getRandomPrompt( prompts, useInterjection )
{
   var choice = prompts[ getRandom( prompts.length ) - 1 ];

   if ( useInterjection )
   {
      choice = sayAs( 'interjection', choice ) + " <break strength='strong'/>";
   }

   choice += '  ';

   logIt( "getRandomPrompt quote " + ( useInterjection ? 'with interjection ' : '' ) + "= '" + choice + "' from " + JSON.stringify( prompts ) );

   return choice;
}

function getRequest( httpType, options, callback )
{
   var ref = this; // Need a local reference for our callback functions

   var req = httpType.get( options, function( resp ) {
      var body = '';

      resp.on( 'data', function( chunk ) { body += chunk; } );
      resp.on( 'end', function() { callback.call( ref, body ); } );
    } )
    .on( 'error', function( err ) { callback.call( ref, err ); } );
}

// Basic entry point for NewSession
// Insures that all needed attributes are defined
function initAttributes()
{
   logIt( "initAttributes called" );

   // sessionCount - counts the number of times the users has called the application
   if ( this.attributes[ 'sessionCount' ] === undefined )
   {
      logIt( "initialized sessionCount" );
      this.attributes[ 'sessionCount' ] = 0;
   }

   // firstSession - the first time they used the application.
   if ( this.attributes[ 'firstSession' ] === undefined )
   {
      logIt( "initialized firstSession" );
      this.attributes[ 'firstSession' ] = (new Date()).toUTCString();
   }

   // lastSession - the last time they used the application.
   if ( this.attributes[ 'lastSession' ] === undefined )
   {
      logIt( "initialized lastSession" );
      this.attributes[ 'lastSession' ] = '';
   }

   // name - the user's name
   if ( this.attributes[ 'name' ] === undefined )
   {
      logIt( "initialized name" );
      this.attributes[ 'name' ] = ' ';
   }

   // nextState - the user's nextState
   if ( this.attributes[ 'nextState' ] === undefined )
   {
      logIt( "initialized nextState" );
      this.attributes[ 'nextState' ] = ' ';
   }

   logIt( "initAttributes finished : " + JSON.stringify( this.attributes ) );
}

// Helper function to control logging.  If debug is true, then output message
function logIt( msg )
{
   if ( debug )
   {
      console.log( "RRS: ", msg ); // Add a prefix to make app messages easier to find
   }
}

// Helper function to consistently output strings with the proper say-as type
function sayAs( type, value )
{
   return '<say-as interpret-as="' + type + '">' + value + '</say-as>';
}

// Helper function to consistently validate if a slot is available and valid
function slotValid( request, key )
{
   var result = false;

   // Tedious, but good for logging.
   logIt( "slotValid request = '" + typeof( request ) + "'" );
   if ( typeof( request ) == 'object' )
   {
      logIt( "slotValid intent = '" + typeof( request.intent ) + "'" );
      if ( typeof( request.intent ) == 'object' )
      {
         logIt( "slotValid slots = '" + typeof( request.intent.slots ) + "'" );
         if ( typeof( request.intent.slots ) == 'object' )
         {
            logIt( "slotValid " + key + " = '" + typeof( request.intent.slots[ key ] ) + "'" );
            if ( typeof( request.intent.slots[ key ] ) == 'object' && request.intent.slots[ key ].value )
            {
               result = true;
            }
         }
      }
   }

   return result;
}

// Helper function to standardize how we update our session variables
function updateSessionAttributes()
{
   this.attributes.sessionCount++;
   this.attributes.lastSession = (new Date()).toUTCString();
}


// Intent Helpers handle the various requests
exports.handler = ( event, context, callback ) => {
    const alexa = Alexa.handler( event, context, function( err, resp ) { 
       if ( err !== undefined && err !== null )
       {
          logIt( "Error returned : " + err );
          if ( callback === undefined )
          {
             context.fail( err );
          }
          else
          {
             callback( err );
          }
       }
       else
       {
          logIt( "Successful response : " + JSON.stringify( resp ) );
          if ( callback === undefined || callback === null )
          {
             logIt( "using context" );
             context.succeed( resp );
          }
          else
          {
             logIt( "using callback" );
             callback( null, resp );
          }
       }
    } );

    alexa.appId = APP_ID;

    // Define the table to be used for persistance data
    // if this is a mocha testUser case than don't use the DB
    if ( event.session.user.userId != 'testUser' )
    {
       debug = true;
       alexa.dynamoDBTableName = 'UserInfo-AlexaSampler';
    }
    else
    {
       debug = false;
    }

    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;

    // Register intent handlers
    alexa.registerHandlers( handlers );
    
    logIt( "export handler event - " + JSON.stringify( event ) );

    alexa.execute();
};
