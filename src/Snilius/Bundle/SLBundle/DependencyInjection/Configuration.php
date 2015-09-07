<?php
/**
 * User: Victor Häggqvist
 * Date: 9/7/15
 * Time: 1:50 AM
 */

namespace Snilius\Bundle\SLBundle\DependencyInjection;


use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface {

    /**
     * Generates the configuration tree builder.
     *
     * @return \Symfony\Component\Config\Definition\Builder\TreeBuilder The tree builder
     */
    public function getConfigTreeBuilder() {
        $treeBuilder = new TreeBuilder();

        $treeBuilder
            ->root('snilius_sl')
            ->children()
            ->scalarNode('sl_realtidsinformation_3')->isRequired()->cannotBeEmpty()->end()
            ->scalarNode('sl_reseplanerare_2')->isRequired()->cannotBeEmpty()->end()
            ->scalarNode('sl_platsuppslag')->isRequired()->cannotBeEmpty()->end()
            ->end()
        ;

        return $treeBuilder;
    }
}
