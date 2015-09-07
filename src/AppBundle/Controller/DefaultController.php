<?php

namespace AppBundle\Controller;

use AppBundle\Entity\RealtidInput;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction() {
        $input = new RealtidInput();
        $input->date = new \DateTime();
        $input->time = new \DateTime();

        $form = $this->createFormBuilder($input)
//            ->add('lang','text')
            ->add('date','date', array('widget' => 'single_text', 'format' => 'yyyy-MM-dd'))
            ->add('time','time', array('widget' => 'single_text'))
            ->add('searchForArrival','checkbox')
            ->add('numChg','number')
            ->add('minChgTime','number')
            ->add('originId','text')
//            ->add('originCoordLat','text')
//            ->add('originCoordLong','text')
//            ->add('originCoordName','text')
            ->add('destId','text')
//            ->add('destCoordLat','text')
//            ->add('destCoordLong','text')
//            ->add('destCoordName','text')
            ->add('viaId','checkbox')
            ->add('viaStopOver','text')
//            ->add('unsharp','text')
            ->add('searchFirstLastTrip','text')
            ->add('maxWalkDist','number')
            ->add('useTrain','text')
            ->add('useMetro','text')
            ->add('useTram','text')
            ->add('useBus','text')
            ->add('useFerry','text')
            ->add('useShip','text')
            ->add('lineInc','text')
            ->add('lineExc','text')
            ->add('numTrips','text')
            ->add('save', 'submit', array('label' => 'Hunt Ride'))
            ->getForm();


        return $this->render('default/index.html.twig', array(
//            'form' => $form->createView(),
            'date' => new \DateTime()
        ));
    }
}
