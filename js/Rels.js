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

window.sites = {};
var rootSearch = document.querySelector('#rootSearch');
var root = document.querySelector('#root');
var spinner = document.createElement('div');
spinner.innerHTML = '<div class="spinner"><div class="cube1"></div><div class="cube2"></div></div><div class="load-text">Väntar på SL..</div>';

rootSearch.onsubmit = function (event) {
    event.preventDefault();
    var box = document.querySelector('#box');
    box.className = 'col-md-4';

    var resultView = document.createElement('div');
    resultView.className = 'col-md-8';
    box.parentNode.appendChild(resultView);

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
                var legsViewShort = ''

                legs.forEach((leg) => {
                    console.log(leg);
                    legsView += Mustache.render("<div><div>- {{Origin.time}} {{Origin.name}}</div> <div>{{name}} {{dir}}</div> <div>- {{Destination.time}} {{Destination.name}}</div></div><hr>", leg);
                    legsViewShort += Mustache.render("{{type}} ", leg)
                });

                var from = legs[0].Origin;
                var to = legs[legs.length-1].Destination;

                console.log(legsView);
                resultList.innerHTML += Mustache.render("<div class='trip'><h3>{{from.time}} -> {{to.time}} <small>{{legsShort}}</small></h3><div class='trip-detail'>{{{legs}}}</div></div>", {
                    legs: legsView,
                    legsShort: legsViewShort,
                    trip: t,
                    from: from,
                    to: to
                });
            });
            spinner.style.display = 'none';
            console.log(resultList);
            resultView.appendChild(resultList);
        });
    //m.mount(root, m.component(Search, {}));
};
