/**
 * Created by victor on 9/8/15.
 */

import {Search} from './Search.js';
var Mustache = require('mustache');


var Rels = {};

var encodeData = function(data) {
    var urlEncodedDataPairs = [];
    for(var name in data) {
        urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    return urlEncodedDataPairs.join('&').replace(/%20/g, '+');
};

var typeIcon = function (type) {
  return {
      'TRAIN': 'TRN',
      'BUS': 'BUS_red',
      'WALK': 'Walk',
      'METRO': 'MET_blue'
  }[type];
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
spinner.innerHTML = '<div class="spinner"><div class="cube1"></div><div class="cube2"></div></div><div class="load-text">Väntar på SL..</div>';

rootSearch.onsubmit = function (event) {
    event.preventDefault();
    var box = document.querySelector('#box');
    box.className = 'col-md-4';

    if (resultView === null) {
        resultView = document.createElement('div');
        resultView.className = 'col-md-8';
        box.parentNode.appendChild(resultView);
    } else {
        resultView.innerHTML = '';
        //spinner.style.display = 'block';
    }

    var resultHead = document.createElement('h3');
    resultHead.className = 'text-center';
    resultHead.innerHTML = sites.from.Name + ' -> ' + sites.to.Name;
    resultView.appendChild(resultHead);
    resultView.appendChild(spinner);

    var day = document.querySelector('#day');

    var arrival = '';
    var radios = document.getElementsByName('timeSet');
    Array.prototype.forEach.call(radios, (r) => {
        if (r.checked) {
            arrival = r.value;
        }
    });

    var time = document.querySelector('#time');

    var params = {
        'from': sites.from.SiteId,
        'to': sites.to.SiteId,
        'date': day.value,
        'time': time.value,
        'arrival': arrival
    };

    fetch('/api/trip?' + encodeData(params), {
        credentials: 'include'
    })
        .then((resp) => {
            return resp.json()
        }).then((resp) => {
            console.log(resp);
            var trips = resp.TripList.Trip;
            var resultList = document.createElement('div');

            trips.forEach((t) => {
                var legs = t.LegList.Leg;
                var legsView = '';
                var legsViewShort = '';

                var legViewTemplate = "<div><div>- {{Origin.time}} {{Origin.name}}</div> <div>{{name}} {{dir}}</div> <div>- {{Destination.time}} {{Destination.name}}</div></div><hr>";
                var legViewShortTemplate = "<div class='short-leg'><i class='icon icon-{{icon}}'></i>{{leg.line}}</div>";

                if (Array.isArray(legs)) {
                    console.log(legs);
                    legs.forEach((leg) => {
                        console.log(leg);
                        legsView += Mustache.render(legViewTemplate, leg);
                        legsViewShort += Mustache.render(legViewShortTemplate, {
                            icon: typeIcon(leg.type),
                            leg: leg
                        })
                    });

                    var from = legs[0].Origin;
                    var to = legs[legs.length-1].Destination;
                } else {
                    legsView += Mustache.render(legViewTemplate, legs);
                    legsViewShort += Mustache.render(legViewShortTemplate, {
                        icon: typeIcon(legs.type),
                        leg: legs
                    })

                    var from = legs.Origin;
                    var to = legs.Destination;
                }

                var now  = from.date + " "+ from.time;
                var then = to.date + " "+ to.time;

                var ms = moment(then,"YYYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm"));
                var d = moment.duration(ms);
                var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

                console.log(s);

                console.log(legsView);
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
            resultView.appendChild(resultList);
        });
    //m.mount(root, m.component(Search, {}));
};
