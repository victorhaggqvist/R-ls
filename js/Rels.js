/**
 * Created by victor on 9/8/15.
 */

import {Search} from './Search.js';
var objectAssign = require('object-assign');
var Mustache = require('mustache');


var Rels = {};

var encodeData = function(data) {
    var urlEncodedDataPairs = [];
    for(var name in data) {
        urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    return urlEncodedDataPairs.join('&').replace(/%20/g, '+');
};

var typeIcon = function (leg) {
    var bbus = /blåbuss/;
    var bus = /buss/;

    var tubg = /tunnelbanans gröna/;
    var tubb = /tunnelbanans blå/;
    var tubr = /tunnelbanans röda/;

    if (bbus.test(leg.name)) {
        return 'BUS_blue';
    } else if (bus.test(leg.name)) {
        return 'BUS_red';
    } else if (tubr.test(leg.name)) {
        return 'MET_red';
    } else if (tubb.test(leg.name)) {
        return 'MET_blue';
    } else if (tubg.test(leg.name)) {
        return 'MET_green';
    }

    else {
        return {
            'TRAIN': 'TRN',
            'BUS': 'BUS_red',
            'WALK': 'Walk',
            'METRO': 'MET',
            'TRAM': 'TRL'
        }[leg.type];
    }
};

var displayMap = function () {
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'atriix.nd49o5jk',
        accessToken: 'pk.eyJ1IjoiYXRyaWl4IiwiYSI6IjdmNmY1MmUwZjY1ZDJmM2RlNDE0OGU3NmIyZDU2YWJmIn0.7rJekXMaz4HjJRNkgHF1nw'
    }).addTo(map);
};

window.sites = {};
var rootSearch = document.querySelector('#rootSearch');
var root = document.querySelector('#root');
var spinner = document.createElement('div');
var resultView = null;
//var resultListContainer = document.createElement('div');
var currentForm = null;
var prevDate = null, nextDate = null;
spinner.innerHTML = '<div class="spinner"><div class="cube1"></div><div class="cube2"></div></div><div class="load-text">Väntar på SL..</div>';


// form fields
var day = document.querySelector('#day');
var radios = document.getElementsByName('timeSet');
var time = document.querySelector('#time');

var prevButton = document.createElement('button');
prevButton.innerHTML = 'Tidigare';
prevButton.className = 'btn btn-default btn-block';
var nextButton = document.createElement('button');
nextButton.innerHTML = 'Senare';
nextButton.className = 'btn btn-default btn-block';

var prevTrips = function (e) {
    e.preventDefault();

    if (prevDate === null) {
        prevDate = currentForm.day + " "+ currentForm.time;
    }

    console.log(prevDate);
    var m = moment(prevDate,"YYYY-MM-DD HH:mm");
    //console.log(m.format());
    m.subtract(120 , 'minutes');
    //console.log(m.format());
    //console.log(currentForm);

    prevDate = m.format('YYYY-MM-DD HH:mm');

    var args = {};
    objectAssign(args, currentForm);
    args.day = m.format('YYYY-MM-DD');
    args.time = m.format('HH:mm');
    console.log(args);
    queryTrip(args, true);
};
prevButton.onclick = prevTrips;

var nextTrips = function (e) {
    e.preventDefault();

    if (nextDate === null) {
        nextDate = currentForm.day + " "+ currentForm.time;
    }

    console.log(nextDate);
    var m = moment(nextDate,"YYYY-MM-DD HH:mm");
    m.add(120 , 'minutes');

    nextDate = m.format('YYYY-MM-DD HH:mm');
    var args = {};
    objectAssign(args, currentForm);
    args.day = m.format('YYYY-MM-DD');
    args.time = m.format('HH:mm');
    console.log(args);
    queryTrip(args, false, true);
};
nextButton.onclick = nextTrips;

/**
 * Init the results area, ie. put the big from over to the left and create a new box for results
 */
var initSearchArea = function () {
    var box = document.querySelector('#box');
    box.className = 'col-md-4';
    resultView = document.createElement('div');
    resultView.className = 'col-md-8';
    box.parentNode.appendChild(resultView);
};

var parseForm = function () {

    var arrival = '';
    Array.prototype.forEach.call(radios, (r) => {
        if (r.checked) {
            arrival = r.value;
        }
    });

    return {
        from: sites.from.SiteId,
        to: sites.to.SiteId,
        day: day.value,
        time: time.value,
        arrival: arrival
    }

};

/**
 * Form submit action
 * @param event
 */
var submitButtonAction = function (event) {
    event.preventDefault();
    if (resultView === null) {
        initSearchArea();
    }

    resultView.innerHTML = '';

    var resultHead = document.createElement('h3');
    resultHead.className = 'text-center';
    resultHead.innerHTML = sites.from.Name + ' -> ' + sites.to.Name;
    resultView.appendChild(resultHead);
    resultView.appendChild(spinner);
    //resultView.appendChild(resultListContainer);
    //resultListContainer.innerHTML = '';
    spinner.style.display = 'block';

    var formInput = parseForm();
    currentForm = formInput;

    nextDate = null;
    prevDate = null;

    queryTrip(formInput);
};

var queryTrip  = function(params, appendTop = false, appendBottom = false) {
    fetch('/api/trip?' + encodeData(params), {
        credentials: 'include'
    }).then(res => res.json())
        .then(res => renderResults(res, appendTop, appendBottom));
};

/**
 * Render search results
 * @param resp
 * @param appendBottom
 * @param appendTop
 */
var renderResults = function(resp, appendTop, appendBottom) {
    console.log(resp);
    var resultList = document.createElement('div');

    if (resp.TripList.errorText !== undefined) {
        resultList.innerHTML = '<p class="error">'+resp.TripList.errorText+'</p>';
        resultList.className = 'alert alert-danger';
        spinner.style.display = 'none';
        resultView.appendChild(resultList);
        return;
    }

    var trips = resp.TripList.Trip;
    //if (resultList === null) {

    //}

    trips.forEach((t) => {
        // legs may be an Array or a Object, because SL
        var legs = t.LegList.Leg;

        var legsView = '';
        var legsViewShort = '';

        var legViewTemplate = "<div><div>- {{leg.Origin.time}} {{leg.Origin.name}}</div> <div><i class='icon icon-{{icon}}'></i> {{leg.name}} {{leg.dir}}</div> <div>- {{leg.Destination.time}} {{leg.Destination.name}}</div></div><hr>";
        var legViewShortTemplate = "<div class='short-leg'><i class='icon icon-{{icon}}'></i>{{leg.line}}</div>";

        var from, to;
        if (Array.isArray(legs)) {
            console.log(legs);
            legs.forEach((leg) => {
                console.log(leg);
                legsView += Mustache.render(legViewTemplate, {leg:leg, icon: typeIcon(leg)});
                legsViewShort += Mustache.render(legViewShortTemplate, {
                    icon: typeIcon(leg),
                    leg: leg
                })
            });

            from = legs[0].Origin;
            to = legs[legs.length-1].Destination;
        } else {
            legsView += Mustache.render(legViewTemplate, {leg:legs, icon: typeIcon(legs)});
            legsViewShort += Mustache.render(legViewShortTemplate, {
                icon: typeIcon(legs),
                leg: legs
            });

            from = legs.Origin;
            to = legs.Destination;
        }

        var now  = from.date + " "+ from.time;
        var then = to.date + " "+ to.time;

        var ms = moment(then,"YYYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm"));
        var d = moment.duration(ms);
        var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

        var listItem = document.createElement('div');
        var listItemButtons = document.createElement('div');
        listItemButtons.innerHTML = '<button class="btn btn-default btn-detail">Resväg</button><button class="btn btn-default btn-detail">Karta</button>';

        var listItemDetail = document.createElement('div');
        listItemDetail.className = 'trip-detail';
        listItemDetail.innerHTML = legsView;

        listItem.className = 'trip';
        listItem.innerHTML = Mustache.render("<h3>{{from.time}} -> {{to.time}} ({{duration}})</h3> <div class='short'>{{{legsShort}}}</div>", {
            legsShort: legsViewShort,
            trip: t,
            from: from,
            to: to,
            duration: s
        });
        listItem.appendChild(listItemDetail);
        listItemDetail.appendChild(listItemButtons);
        listItem.onclick = function(e) {
            if (listItemDetail.style.display !== 'block') {
                listItemDetail.style.display = 'block';
            } else {
                listItemDetail.style.display = 'none';
            }
        };
        resultList.appendChild(listItem);
    });
    spinner.style.display = 'none';
    console.log(resultList);

    if (appendTop) {
        prevButton.parentNode.insertBefore(resultList, prevButton.parentNode.childNodes[3]);
    } else if (appendBottom) {
        nextButton.parentNode.insertBefore(resultList, nextButton.parentNode.childNodes[nextButton.parentNode.childNodes.length-1]);
    } else {
        resultView.appendChild(prevButton);
        resultView.appendChild(resultList);
        resultView.appendChild(nextButton);
    }
};

rootSearch.onsubmit = submitButtonAction;

var makeComplete = function (query, syncResults, asyncResults) {
    console.log(query);

    var head = new Headers();
    //head.append('x-token', '{{ csrf_token('api_place') }}');

    fetch('/api/place?query=' + query, {
        headers: head,
        credentials: 'include'
    })
        .then(function(resp) {
            return resp.json()
        })
        .then(function(resp) {
            asyncResults(resp);
        });
};
var from = $('.typeahead');
from.typeahead({
        minLength: 2,
        highlight: false
    },
    {
        source: makeComplete,
        templates: {
            suggestion: function(data){
                return '<div>'+data.Name+'</div>';
            }
        },
        display: 'Name'
    });
from.on('typeahead:select', function (e, data) {
    console.log(e);
    console.log(data);
    if (e.target.id === 'from') {
        sites.from = data;
    } else if (e.target.id === 'to') {
        sites.to = data;
    }
});
