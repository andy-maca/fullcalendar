import './style.css';
import 'fullcalendar/dist/fullcalendar.css';

import 'fullcalendar';
import $ from 'jquery';
import googleclient from 'google-client-api';

googleclient().then(function (gapi) {

  // Client ID and API key from the Developer Console
  var CLIENT_ID = '1059756015078-62cgea117kpmdtvs7fugku6our0n69pi.apps.googleusercontent.com';
  var API_KEY = "AIzaSyAmhnldAhC3S_rT4HRMtfulCguU5iLjmC0";

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

  var authorizeButton = document.getElementById('authorize-button');
  var signoutButton = document.getElementById('signout-button');

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    });
  }

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      listUpcomingEvents();
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Append a pre element to the body containing the given message
   * as its text node. Used to display the results of the API call.
   *
   * @param {string} message Text to be placed in pre element.
   */
  function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  function listUpcomingEvents() {
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
    }).then(function (response) {
      var events = response.result.items;
      var eventsList = [];
      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          var entry = events[i];
          eventsList.push({
            id: entry.id,
            title: entry.summary,
            start: entry.start.dateTime || entry.start.date, // try timed. will fall back to all-day
            end: entry.end.dateTime || entry.end.date, // same
            url: entry.htmlLink,
            location: entry.location,
            description: entry.description
          });
        }
      }
      updateFullcalendar(eventsList);
    });
  }

  function updateFullcalendar(eventsList) {
    $('#calendar').fullCalendar("removeEvents");
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,listYear'
      },
      events: eventsList,
      eventClick: function (event) {
        // opens events in a popup window
        window.open(event.url, '_blank', 'width=700,height=600');
        return false;
      }
    });
  }

  handleClientLoad();
});