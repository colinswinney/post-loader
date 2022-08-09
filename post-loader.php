<?php
/**
 * Plugin Name:       Post Loader
 * Description:       Example static block scaffolded with Create Block tool.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       post-loader
 *
 * @package           create-block
 */

/**
 * Exit if accessed directly
 */
if( ! defined( 'ABSPATH' ) ) exit;

/**
 * Include class for custom rest api route
 */
require_once( __DIR__ . '/class-rest-api.php' );

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
add_action( 'init', function () {
	register_block_type( __DIR__ . '/build' );
} );

/**
 * Enqueue script to handle front end functions
 */
add_action( 'wp_enqueue_scripts', function () {
    wp_enqueue_script( 'post-loader/frontend', plugins_url( basename( __DIR__ ) . '/src/frontend.js' ), array(), '1.0.0', true );
} );
