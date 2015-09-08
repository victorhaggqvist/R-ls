<?php
/**
 * User: Victor Häggqvist
 * Date: 9/7/15
 * Time: 12:21 AM
 */

namespace Snilius\Bundle\SLBundle\Client;


class Client {

    private $SlPlatsuppslagURL = 'https://api.sl.se/api2/typeahead.json';
    private $SlReseplanerare2URL = 'https://api.sl.se/api2/TravelplannerV2';


    /**
     * @var \Guzzle\Http\Client
     */
    private $client;
    private $slRealtidsinformation3Key;
    private $slReseplanerare2key;
    private $slPlatsuppslagKey;

    function __construct($slRealtidsinformation3Key, $slReseplanerare2key, $slPlatsuppslagKey) {
        $this->client = new \Guzzle\Http\Client();
        $this->slRealtidsinformation3Key = $slRealtidsinformation3Key;
        $this->slReseplanerare2key = $slReseplanerare2key;
        $this->slPlatsuppslagKey = $slPlatsuppslagKey;
    }

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

}
