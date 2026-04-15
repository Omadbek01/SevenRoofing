<?php

define( 'WP_CACHE', true ); // Added by WP Rocket

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'dbiqzw1mcuotvw' );

/** Database username */
define( 'DB_USER', 'u28iv2tznrefp' );

/** Database password */
define( 'DB_PASSWORD', 'cioxkhakvtbn' );

/** Database hostname */
define( 'DB_HOST', '127.0.0.1' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          's^dyTr)wq[:Mw]]V5i`,{`?q;,?3~4YF%1ST!qr>?U`Z:F}Qfh]IuP{0kg{g*y5(' );
define( 'SECURE_AUTH_KEY',   'X;{;jp<1:%T]s+B&|8^~$PV{r+;XUnyoHk>bljIrbaCA{Q2ZYwqY)Af?q|Io9IA!' );
define( 'LOGGED_IN_KEY',     'J2Q aPQi^{Do)W]g)im8TK4n~C>LfG~=-Az^O)&%Bd,xGMqogW@Z;++Ry-UFuI?r' );
define( 'NONCE_KEY',         'F~K4SFOSA[K^S{AZybd{}C3.|&}E6}{NU#NUUKq=Uibne%EG8Hdz8V-d,*Da]-4_' );
define( 'AUTH_SALT',         '[y{Sf/2Bo$J-WZ]qdczV69[N/ooA6Eh]hC,O8X6^FgH=_-I1^~sf||l3b,hD,zI-' );
define( 'SECURE_AUTH_SALT',  'bHY2pr#z4Uwi0UD/.*ELdO[;7Dhb{~;*^RPOMRuQM*/u>P pwfOqY|]Q#TWok.Jk' );
define( 'LOGGED_IN_SALT',    'Vwr;e/g?6k&#L7e@ejVwT(C,Jp6ylJE*apH.F=(sYRmcTcVdDKFK1YfZI(Rs$H)o' );
define( 'NONCE_SALT',        '[C6l0hM<qlG| fXC]lCCX)UA#xot6AHCRV_3EY;3a14R_XWz&deJ>j-t%5}opcLG' );
define( 'WP_CACHE_KEY_SALT', ':>hzf^{@91]:yy)Uy>N*UEz$qG{?jK[gy/|k6:yXJW~y9Y2&w8$AD|dv4&c*^6/u' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_cfrt0j4sd2_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
@include_once('/var/lib/sec/wp-settings-pre.php'); // Added by SiteGround WordPress management system
require_once ABSPATH . 'wp-settings.php';
@include_once('/var/lib/sec/wp-settings.php'); // Added by SiteGround WordPress management system
