<?php
/**
 * Plugin Name:       Remote Islander Talent Portal
 * Description:        Renders the Remote Islander talent self-assessment portal and HubSpot application form via the [remote_islander_portal] shortcode.
 * Version:           1.0.0
 * Author:            Remote Islander
 * License:           GPL-2.0-or-later
 * Text Domain:       remote-islander-portal
 *
 * Usage: add the shortcode  [remote_islander_portal]  to any page.
 * The portal's CSS is scoped under .ri-portal so it will not affect the theme.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'RI_PORTAL_VERSION', '1.0.0' );

/**
 * Register styles/scripts. Enqueued only when the shortcode is used.
 */
function ri_portal_register_assets() {
	$base = plugin_dir_url( __FILE__ );

	wp_register_style(
		'ri-portal-fonts',
		'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap',
		array(),
		null
	);
	wp_register_style( 'ri-portal', $base . 'assets/style.css', array( 'ri-portal-fonts' ), RI_PORTAL_VERSION );

	// HubSpot forms embed loader (the form itself is created in script.js).
	wp_register_script( 'ri-portal-hubspot', 'https://js.hsforms.net/forms/embed/v2.js', array(), null, true );
	wp_register_script( 'ri-portal', $base . 'assets/script.js', array( 'ri-portal-hubspot' ), RI_PORTAL_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'ri_portal_register_assets' );

/**
 * [remote_islander_portal] — outputs the portal markup and enqueues its assets.
 */
function ri_portal_shortcode() {
	wp_enqueue_style( 'ri-portal-fonts' );
	wp_enqueue_style( 'ri-portal' );
	wp_enqueue_script( 'ri-portal-hubspot' );
	wp_enqueue_script( 'ri-portal' );

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'templates/portal.php';
	return ob_get_clean();
}
add_shortcode( 'remote_islander_portal', 'ri_portal_shortcode' );
