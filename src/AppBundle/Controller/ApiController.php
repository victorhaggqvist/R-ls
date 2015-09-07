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
        $token = $request->headers->get('x-token');
        $csrf_token = new CsrfToken('api_place', $token);

        $log = $this->get('logger');
        $log->info(var_export($this->get('security.csrf.token_manager')->isTokenValid($csrf_token), true));
//        if ($this->get('security.csrf.token_manager')->isTokenValid($csrf_token)) {
            $slClient = $this->get('snilius.sl.client');
            return new JsonResponse($slClient->slPlatsuppslag($request->query->getAlnum('query', '')));
//        } else {
//            return new Response('', 403);
//        }

    }

}
