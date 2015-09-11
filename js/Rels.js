/**
 * Created by victor on 9/8/15.
 */

import {Search} from './Search.js';
var objectAssign = require('object-assign');
var Mustache = require('mustache');

var DB;
var schemaBuilder = lf.schema.create('searchHistory', 1);
var initDB = function () {
    schemaBuilder.createTable('History').
        addColumn('id', lf.Type.INTEGER).
        addColumn('from', lf.Type.OBJECT).
        addColumn('to', lf.Type.OBJECT).
        addColumn('useCount', lf.Type.INTEGER).
        addPrimaryKey(['id']).
        addIndex('idxDeadline', ['useCount'], false, lf.Order.DESC);
};

initDB();
schemaBuilder.connect().then(function(db) {
    DB = db;
    loadHistory();
});

var loadHistory = function () {
    var h = DB.getSchema().table('History');
    console.log(h);
    DB.select()
        .from(h)
        .orderBy(h.useCount, lf.Order.DESC)
        //.where(lf.op.and(h.from.eq(sites.from), h.to.eq(sites.to)))
        .exec()
        .then((rows) => {
            var view =  document.createElement('div');
            rows.forEach((r) => {
                console.log(r);
                var hRow = document.createElement('div');
                hRow.innerHTML = r.from.Name + ' -> ' + r.to.Name;
                hRow.className = 'history-row';
                hRow.onclick = function () {
                    _from.value = r.from.Name;
                    _to.value = r.to.Name;

                    sites.from = r.from;
                    sites.to = r.to;
                    submitButtonAction(null);
                };
                view.appendChild(hRow)
            });

            history.appendChild(view);
        });
};


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

window.sites = {};
var rootSearch = document.querySelector('#rootSearch');
var root = document.querySelector('#root');
var spinner = document.createElement('div');
var history = document.querySelector('#history');
var resultView = null;
var currentForm = null;
var prevDate = null, nextDate = null;
spinner.innerHTML = '<div class="spinner"><div class="cube1"></div><div class="cube2"></div></div><div class="load-text">Väntar på SL..</div>';


// form fields
var day = document.querySelector('#day');
var radios = document.getElementsByName('timeSet');
var time = document.querySelector('#time');
var _from = document.querySelector('#from');
var _to = document.querySelector('#to');

var prevButton = document.createElement('button');
prevButton.innerHTML = Translator.trans('Tidigare');
prevButton.className = 'btn btn-default btn-block';
var nextButton = document.createElement('button');
nextButton.innerHTML = Translator.trans('Senare');
nextButton.className = 'btn btn-default btn-block';

var prevTrips = function (e) {
    e.preventDefault();

    if (prevDate === null) {
        prevDate = currentForm.day + " "+ currentForm.time;
    }

    var m = moment(prevDate,"YYYY-MM-DD HH:mm");
    m.subtract(120 , 'minutes');
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

window.startFromUrl = function (toId, toName, fromId, fromName) {
    sites.to = {
        SiteId: toId,
        Name: toName
    };
    sites.from = {
        SiteId: fromId,
        Name: fromName
    };
    _to.value = toName;
    _from.value = fromName;

    submitButtonAction(null);
};

/**
 * Form submit action
 * @param event
 */
var submitButtonAction = function (event) {
    event === null || event.preventDefault();
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

    var urlBits = [Translator.locale, sites.from.SiteId, sites.to.SiteId, encodeURIComponent(sites.from.Name), encodeURIComponent(sites.to.Name)];
    var hist = urlBits.join('/');

    window.history.pushState(null, 'Räls - '+sites.from.Name +' -> '+sites.to.Name, window.location.origin+'/'+hist);


    nextDate = null;
    prevDate = null;

    queryTrip(formInput);

    var h = DB.getSchema().table('History');
    console.log(h);
    DB.select()
    .from(h)
    //.where(lf.op.and(h.from.eq(sites.from), h.to.eq(sites.to)))
    .exec()
    .then((rows) => {
            var exists = null;

            // working around .eq beeing undefined in the query
            rows.forEach((r) => {
                //console.log(r);
               if (r.to.SiteId === sites.to.SiteId && r.from.SiteId === sites.from.SiteId) exists = r;
            });

            console.log('query result');
            //console.log(rows);

            if (exists === null) {
                console.log('new history');
                var row = h.createRow({
                    'id': parseInt(sites.from.SiteId+''+sites.to.SiteId),
                    'from': sites.from,
                    'to': sites.to,
                    'useCount': 1
                });
                DB.insertOrReplace().into(h).values([row]).exec();
            } else {
                console.log('update history');
                //var r = exists;
                exists.useCount++;
                console.log(exists);
                var row = h.createRow(exists);
                console.log(row);
                DB.insertOrReplace().into(h).values([row]).exec();
            }
        });
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

    trips.forEach((t) => {
        console.log(t);
        // legs may be an Array or a Object, because SL
        var legs = t.LegList.Leg;

        var legsView = '';
        var legsViewShort = '';

        var legViewTemplate = "<div><div>- {{leg.Origin.time}} {{leg.Origin.name}}</div> <div><i class='icon icon-{{icon}}'></i> {{leg.name}} {{leg.dir}}</div> <div>- {{leg.Destination.time}} {{leg.Destination.name}}</div></div><hr>";
        var legViewShortTemplate = "<div class='short-leg'><i class='icon icon-{{icon}}'></i>{{leg.line}}</div>";

        var from, to;
        var geoRefs = [];
        if (Array.isArray(legs)) {
            //console.log(legs);
            legs.forEach((leg) => {
                //console.log(leg);
                legsView += Mustache.render(legViewTemplate, {leg:leg, icon: typeIcon(leg)});
                legsViewShort += Mustache.render(legViewShortTemplate, {
                    icon: typeIcon(leg),
                    leg: leg
                });

                if (leg.type !== 'WALK') geoRefs.push(leg.GeometryRef.ref.substring(6));
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
            if (legs.type !== 'WALK') geoRefs.push(legs.GeometryRef.ref.substring(6));
        }

        var now  = from.date + " "+ from.time;
        var then = to.date + " "+ to.time;

        var ms = moment(then,"YYYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm"));
        var d = moment.duration(ms);
        var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

        var listItem = document.createElement('div');

        // action buttons
        var listItemButtons = document.createElement('div');
        var routeButton = document.createElement('button');
        routeButton.className = 'btn btn-default btn-detail';
        routeButton.innerHTML = Translator.trans('Resväg');
        var mapButton = document.createElement('button');
        mapButton.className = 'btn btn-default btn-detail';
        mapButton.innerHTML = Translator.trans('Karta');
        listItemButtons.appendChild(routeButton);
        listItemButtons.appendChild(mapButton);

        // wrapper box
        var listItemBox  = document.createElement('div');
        listItemBox.style.display = 'none';

        // list items
        var listItemDetail = document.createElement('div');
        listItemDetail.className = 'trip-detail';
        listItemDetail.innerHTML = legsView;

        listItemBox.appendChild(listItemDetail);

        listItem.className = 'trip';

        var listItemHeader = document.createElement('div');
        listItemHeader.innerHTML = Mustache.render("<h3>{{from.time}} -> {{to.time}} ({{duration}})</h3> <div class='short'>{{{legsShort}}}</div>", {
            legsShort: legsViewShort,
            trip: t,
            from: from,
            to: to,
            duration: s
        });
        listItem.appendChild(listItemHeader);
        listItem.appendChild(listItemBox);

        listItemHeader.onclick = function(e) {
            if (listItemBox.style.display !== 'block') {
                listItemBox.style.display = 'block';
            } else {
                listItemBox.style.display = 'none';
            }
        };
        resultList.appendChild(listItem);

        var listItemMap = document.createElement('div');
        var mapId = 'map_'+Math.random().toString(36).substr(2, 7);
        listItemMap.id = mapId;
        listItemMap.className = 'trip-map';

        listItemBox.appendChild(listItemMap);
        listItemBox.appendChild(listItemButtons);
        mapButton.onclick = function(e) {
            listItemDetail.style.display = 'none';
            listItemMap.style.display = 'block';
            renderMap(mapId, geoRefs);
        };

        routeButton.onclick = function (e) {
            listItemMap.style.display = 'none';
            listItemDetail.style.display = 'block';
        };

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

var renderMap = function (mapId, geoRefs) {
    //console.log(geoRefs);
    try {
        L.mapbox.accessToken = 'pk.eyJ1IjoiYXRyaWl4IiwiYSI6IjdmNmY1MmUwZjY1ZDJmM2RlNDE0OGU3NmIyZDU2YWJmIn0.7rJekXMaz4HjJRNkgHF1nw';

        var map = L.mapbox.map(mapId, 'atriix.nd49o5jk');

        //var map = L.map(mapId).setView([59.3282702,18.065956], 13);
        L.control.layers({
            'Streets': L.mapbox.tileLayer('mapbox.mapbox-streets-v6').addTo(map),
            'Satellite': L.mapbox.tileLayer('mapbox.satellite'),
            //'Miao': L.mapbox.tileLayer('mapbox.mapbox-streets-v6')
        }, {
            'Bike Stations': L.mapbox.tileLayer('examples.bike-locations'),
            'Bike Lanes': L.mapbox.tileLayer('examples.bike-lanes')
        }).addTo(map);
        //L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        //    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        //    maxZoom: 18,
        //    id: 'atriix.nd49o5jk',
        //    accessToken: 'pk.eyJ1IjoiYXRyaWl4IiwiYSI6IjdmNmY1MmUwZjY1ZDJmM2RlNDE0OGU3NmIyZDU2YWJmIn0.7rJekXMaz4HjJRNkgHF1nw'
        //}).addTo(map);

        var allPoints = [];
        geoRefs.forEach((ref) => {
            fetch('/api/geometry?ref=' + ref)
                .then(res => res.json())
                .then((res) => {
                    var points = res.Geometry.Points.Point;

                    var pointList = points.map((p) => {
                        return new L.LatLng(p.lat, p.lon);
                    });
                    allPoints.push(pointList);

                    var polyline = new L.Polyline(pointList, {
                        color: 'red',
                        weight: 3,
                        opacity: 0.5,
                        smoothFactor: 1

                    });
                    polyline.addTo(map);

                    var bounds = new L.LatLngBounds(allPoints);
                    map.fitBounds(bounds);
                });
        });
    } catch (e){ }

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

