<?php
/**
 * User: Victor Häggqvist
 * Date: 6/12/15
 * Time: 1:58 AM
 */

namespace AppBundle\Entity;


class RealtidInput {

    /**
     * @var
     * Språk (sv/en)
    Språk i svar, default sv
     */
    var $lang;

    /**
     * @var
     * YYYY-MM-DD
    Datum. Exempel 2014-08-23. date=2014-08-23. Default idag.
     */
    var $date;

    /**
     * @var
     * HH:MM
    Tid. Exempel time=19:06. Default nu.
     */
    var $time;

    /**
     * @var
     * (0/1)
    Som standard/default söker man efter tiden som man vill att resan skall avgå. Genom att sätta searchForArrival=1,
     * så söker man istället resor baserat på tiden man vill komma fram. Default=0.
     */
    var $searchForArrival;

    /**
     * @var
     * (nummer)
    Begränsa antalet byten. Default obegränsad
     */
    var $numChg;

    /**
     * @var
     * (minuter)
    Minimum bytestid
     */
    var $minChgTime;

    /**
     * @var
     * Startpunkt (id)
    Kan antingen vara siteid eller ett alias, site eller akronym.
    Exempel: 300109000, 9000, CST
     */
    var $originId;

    /**
     * @var
     *
    Startpunkt (position)

    Ett trippel-id baserat på en koordinat och ett namn för utgångspunkten för resan. Detta kommer att hanteras som en adress i resultatet.
    Exempel: originCoordLat=59.347754
    originCoordLong=17.883724
    originCoordName=Blackebergsplan
     */
    var $originCoordLat;
    var $originCoordLong;
    var $originCoordName;

    /**
     * @var
     * Destination (id)
    Kan antingen vara ett site-id, eller ett alias, site eller akronym.
     */
    var $destId;

    /**
     * @var
     * Destination (position)
    Ett trippel-id baserat på en koordinat och ett namn för destinationen för resan. Detta kommer att hanteras som en adress i resultatet.
     */
    var $destCoordLat;
    var $destCoordLong;
    var $destCoordName;

    /**
     * @var
     * Via station
    Id för via-stop (siteId). Exempel: 300109600, 9600
     */
    var $viaId;

    /**
     * @var
     * Via time (minutes)
    Tid för via stop. Default=0 betyder att resan kommer att passera via-stoppet.
     */
    var $viaStopOver;

    /**
     * Oskarp sökning (1/0)
    Med unsharp=1 kommer svaret innehålla resor från alternative stop-platser i närheten. Default=0
     */
    var $unsharp;

    /**
     * @var
     * (first/last)
    Leta efter den första eller sista resan för dagen. Notera att det här gäller en tidtabellsdag som kan sträcka sig över midnatt.
     */
    var $searchFirstLastTrip;

    /**
     * @var
     * Gångavstånd(meter)
    Max gångavstånd får gång till stop-platser.
     */
    var $maxWalkDist;

    /**
     * @var
     * Exkludera trafiktyper (0/1)
    Stäng av trafiktyper som är tillgängliga som default. Exempel: useTrain=0.
     */
    var $useTrain;
    var $useMetro;
    var $useTram;
    var $useBus;
    var $useFerry;
    var $useShip;

    /**
     * @var
     * Inkludera linjer
    Inkludera endast dessa linjer I sökning, suffixlinjer stöds inte. Exempel: lineInc=4,1,38
     */
    var $lineInc;

    /**
     * @var
     * Exkludera linjer
    Exkludera dessa linjer i sökningen. Suffixlinjer stöds inte.
    Exempel: lineExc=4,1,38
     */
    var $lineExc;

    /**
     * @var
     * Antalet resor i resultatet (1-6)
    Begränsa antalet returnerade resor. Notera att det här är ett ungefärligt tal. Default=5
     */
    var $numTrips;

    /**
     * @var string
     * ISO-8859-1, UTF-8
    Default är ISO-8859-1. Encoding påverkar svaret och det man skickar in i originCoordName och destCoordName.
     */
    var $encoding = 'UTF-8';

}
