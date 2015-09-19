<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="search")
     * @Route("/{from}/{to}/{fromName}/{toName}", name="search_params")
     */
    public function indexAction(Request $request, $from = null, $to = null, $fromName = null, $toName = null) {
        $locale = $request->getLocale();
        if ($locale == 'sv')
            setlocale(LC_ALL, 'sv_SE');

        $dates = array();
        for ($i = 1; $i < 14; $i++) {
            $time = strtotime('+'.$i.' day');
            $dates[] = array(
                'time' => date('Y-m-d', $time),
                'display' => utf8_encode(strftime('%A %e %B', $time))
            );
        }
        $t = $this->get('translator');
        $dates[0]['display'] = $t->trans('i dag');
        $dates[1]['display'] = $t->trans('i morgon').' ('.$dates[1]['display'].')';

        return $this->render('default/index.html.twig', array(
            'date' => new \DateTime(),
            'dates' => $dates,
            'params' => $from === null ? false : array('from' => $from, 'to' => $to, 'fromName' => $fromName, 'toName' => $toName)
        ));
    }
}
