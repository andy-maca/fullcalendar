import 'fullcalendar/dist/fullcalendar.css';
import 'fullcalendar';
import $ from 'jquery';

export default function(eventsList) {
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