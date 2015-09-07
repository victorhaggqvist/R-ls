<?php
/**
 * User: Victor Häggqvist
 * Date: 9/7/15
 * Time: 1:58 AM
 */

namespace Snilius\Bundle\SLBundle\DependencyInjection;


use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

class SniliusSLExtension extends Extension {

    /**
     * Loads a specific configuration.
     *
     * @param array $config An array of configuration values
     * @param ContainerBuilder $container A ContainerBuilder instance
     *
     * @throws \InvalidArgumentException When provided tag is not defined in this extension
     *
     * @api
     */
    public function load(array $config, ContainerBuilder $container) {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $config);

        $container->setParameter('snilius.sl.sl_realtidsinformation_3', $config['sl_realtidsinformation_3']);
        $container->setParameter('snilius.sl.sl_reseplanerare_2', $config['sl_reseplanerare_2']);
        $container->setParameter('snilius.sl.sl_platsuppslag', $config['sl_platsuppslag']);

        $loader = new YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.yml');
    }
}
