<?php
/**
 * User: Victor Häggqvist
 * Date: 9/7/15
 * Time: 2:27 AM
 */

namespace Snilius\Bundle\SLBundle\Client;


use Guzzle\Http\Client;

class Platsuppslag {

    /**
     * @var \Guzzle\Http\Client
     */
    private $client;

    private $slPlatsuppslagKey;

    function __construct($slPlatsuppslagKey) {
        $this->slPlatsuppslagKey = $slPlatsuppslagKey;
        $this->client = new Client('https://api.sl.se/api2/typeahead.json');
    }

    public function query($query, array $options) {
//        $request = $this->client->createRequest('GET', null)
    }
}
