<?php
namespace RKGeronimo;

use RKGeronimo\Interfaces\InitInterface;
use Timber;

/**
 * Class: RkgPost
 *
 * @author Adrijan Adanić <adanic.ado@gmail.com>
 *
 * @see InitInterface
 */
class RkgPost implements InitInterface
{

    /**
     * init
     *
     * @return void
     */
    public function init()
    {
        add_action('init', array($this, 'createRkgPostPosttype'));
    }

    /**
     * createRkgPostPosttype
     *
     * @return void
     */
    public function createRkgPostPosttype()
    {
        $labels = array(
            'name'          => __('Objave'),
            'singular_name' => __('Objava'),
            'add_new'       => __('Dodaj novu'),
            'add_new_item'  => __('Dodaj novu'),
            'edit_item'     => __('Uredi objavu'),
            'new_item'      => __('Dodaj novu objavu'),
            'view_item'     => __('Pregledaj objavu'),
            'search_items'  => __('Pretraži objave'),
        );
        register_post_type(
            'rkg-post',
            array(
                'labels'   => $labels,
                'public'   => true,
                'menu_position' => 2,
                'menu_icon'            => 'dashicons-edit',
                'taxonomies'           => array('category'),
                'supports' => array(
                    'title',
                    'editor',
                    'author',
                    'thumbnail',
                    'revisions',
                ),
                // 'register_meta_box_cb' => array($this, 'createCourseMetaboxes'),
                'capability_type' => array('rkgPost', 'rkgPosts'),
            )
        );
    }
}
