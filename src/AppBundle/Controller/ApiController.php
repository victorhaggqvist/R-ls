<?php
/**
 * User: Victor Häggqvist
 * Date: 9/7/15
 * Time: 2:40 AM
 */

namespace AppBundle\Controller;


use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Csrf\CsrfToken;

class ApiController extends Controller {

    /**
     * @Route("/api/place", name="api_place")
     */
    public function indexAction(Request $request) {
        $cache = $this->get('sonata.cache.memcached');
        $slClient = $this->get('snilius.sl.client');
        $log = $this->get('logger');
        $query = $request->query->getAlnum('query', '');
        $has = $cache->has(['id' => $query]);
//        var_dump($has);
        if ($has) {
            $hit = $cache->get(['id' => $query]);
            $log->info('using cache');
            return new JsonResponse($hit->getData());
        } else {
            $log->info('new query');
            $places = $slClient->slPlatsuppslag($request->query->getAlnum('query', ''), [
                'stationsonly' => 'true'
            ]);
            $cache->set(['id' => $query], $places);

            return new JsonResponse($places);
        }

////        $token = $request->headers->get('x-token');
////        $csrf_token = new CsrfToken('api_place', $token);
////
////        $log->info(var_export($this->get('security.csrf.token_manager')->isTokenValid($csrf_token), true));
////        if ($this->get('security.csrf.token_manager')->isTokenValid($csrf_token)) {
//            $slClient = $this->get('snilius.sl.client');
//            return new JsonResponse(
//                $slClient->slPlatsuppslag($request->query->getAlnum('query', ''), [
//                'stationsonly' => 'false'
//            ]));
//        } else {
//            return new Response('', 403);
//        }

    }

    /**
     * @Route("/api/trip", name="api_trip")
     */
    public function tripAction(Request $request) {
        $fromSite = $request->query->getInt('from');
        $toSite = $request->query->getInt('to');

        $arrival = $request->query->getAlpha('arrival');
        $date = $request->query->getAlnum('date', date('Y-m-d'));
        $time = $request->query->getAlnum('time', date('H:i'));

        $slClient = $this->get('snilius.sl.client');
        $trips = $slClient->slReseplanerare2Trip($fromSite, $toSite, array(
            'date' => $date,
            'time' => $time,
            'searchForArrival' => $arrival == 'ank' ? 0 : 1
        ));

        return new JsonResponse($trips);
    }

}
