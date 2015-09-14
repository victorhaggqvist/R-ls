<?php
/**
 * User: Victor Häggqvist
 * Date: 9/7/15
 * Time: 12:21 AM
 */

namespace Snilius\Bundle\SLBundle\Client;


/**
 * Wrapper for SL apis provided through Trafiklab
 *
 * This wrapper covers;
 * - https://www.trafiklab.se/api/sl-reseplanerare-2
 * - https://www.trafiklab.se/api/sl-platsuppslag
 *
 * Class Client
 * @package Snilius\Bundle\SLBundle\Client
 */
class Client {

    private $SlPlatsuppslagURL = 'https://api.sl.se/api2/typeahead.json';
    private $SlReseplanerare2URL = 'https://api.sl.se/api2/TravelplannerV2';


    /**
     * @var \Guzzle\Http\Client
     */
    private $client;

    /**
     * Api key for SL Realtidsinformation 3
     * @var string
     */
    private $slRealtidsinformation3Key;

    /**
     * Api key for SL Reseplanerare 2
     * @var string
     */
    private $slReseplanerare2key;

    /**
     * Api key for SL Platsuppslag
     * @var string
     */
    private $slPlatsuppslagKey;

    function __construct($slRealtidsinformation3Key, $slReseplanerare2key = null, $slPlatsuppslagKey = null) {
        $this->client = new \Guzzle\Http\Client();
        $this->slRealtidsinformation3Key = $slRealtidsinformation3Key;
        $this->slReseplanerare2key = $slReseplanerare2key;
        $this->slPlatsuppslagKey = $slPlatsuppslagKey;
    }

    /**
     * SL Platsuppslag
     * @see https://www.trafiklab.se/api/sl-platsuppslag
     * @param string $query
     * @param array $options
     * @return mixed
     */
    public function slPlatsuppslag($query, array $options = []) {
        $params = ['key' => $this->slPlatsuppslagKey, 'searchstring' => $query];
        $params = array_merge($params, $options);

        $request = $this->client->createRequest('GET', $this->SlPlatsuppslagURL, null, null, [
            'query' => $params
        ]);

        $resp = $request->send();
        $json = json_decode($resp->getBody(), true);
        return $json['ResponseData'];
    }

    /**
     * SL Reseplanerare 2 -> Trip
     * @see https://www.trafiklab.se/api/sl-reseplanerare-2
     * @param string $originId SiteID from
     * @param string $destId SiteID to
     * @param array $options Any extra options
     * @return mixed
     */
    public function slReseplanerare2Trip($originId, $destId, array $options = []) {
        $params = [
            'key' => $this->slReseplanerare2key,
            'originId' => $originId,
            'destId' => $destId
        ];
        $params = array_merge($params, $options);

        $url = $this->SlReseplanerare2URL.'/trip.json';

        $request = $this->client->createRequest('GET', $url, null, null, [
            'query' => $params
        ]);

        $resp = $request->send();
        $json = json_decode($resp->getBody(), true);
        return $json;
    }

    /**
     * SL Reseplanerare 2 -> Geometry
     * @see https://www.trafiklab.se/api/sl-reseplanerare-2
     * @param string $ref
     * @return mixed
     */
    public function slReseplanerare2Geometry($ref) {
        $url = $this->SlReseplanerare2URL.'/geometry.json';

        $params = [
            'key' => $this->slReseplanerare2key,
            'ref' => $ref
        ];

        $request = $this->client->createRequest('GET', $url, null, null, [
            'query' => $params
        ]);

        $resp = $request->send();
        $json = json_decode($resp->getBody(), true);
        return $json;
    }

    /**
     * SL Reseplanerare 2 -> JourneyDetail
     * @see https://www.trafiklab.se/api/sl-reseplanerare-2
     * @param string $ref
     * @return mixed
     */
    public function slReseplanerare2JourneyDetail($ref) {
        $url = $this->SlReseplanerare2URL.'/journeydetail.json';

        $params = [
            'key' => $this->slReseplanerare2key,
            'ref' => $ref
        ];

        $request = $this->client->createRequest('GET', $url, null, null, [
            'query' => $params
        ]);

        $resp = $request->send();
        $json = json_decode($resp->getBody(), true);
        return $json;
    }

}
