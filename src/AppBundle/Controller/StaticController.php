<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class StaticController extends Controller {

    /**
     * @Route("/om", name="about")
     */
    public function aboutAction() {
        return $this->render(':about:index.html.twig');
    }
}
