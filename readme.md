# Slothy, the WordPress Slowlog Analyzer

## What is slothy?

Slothy is a simple node program designed to read a slow_error log file from a WordPress site, count the errors and sort the number of slow_errors by their sources.

## How do I use it?

First, of course, install slothy:

```
npm i wp-slowlog-analyzer
```

Then, in your command line, type the `slothy` command followed by the file path of the slow log file to analyze. For example:

```
slothy /path/to/slow.log
```

You should see an output something like this:

```
Welcome to Slothy, the faster WordPress slowlog analyzer!
(Only use this tool on valid WP slowlog files, or weird stuff will happen.)
---
TOTAL ERRORS: 12952
SOURCES:
/plugins/shortpixel-image-optimiser                 10750   83.00%
**wp-core**                                         911     7.03%
/themes/soledad                                     558     4.31%
/themes/soledad-child                               388     3.00%
/plugins/accelerated-mobile-pages                   183     1.41%
/themes/enfold                                      159     1.23%
/plugins/wordpress-seo                              153     1.18%
/themes/divi                                        138     1.07%
/plugins/jetpack                                    63      0.49%
/plugins/redirection                                39      0.30%
/plugins/blogvault-real-time-backup                 32      0.25%
/plugins/js_composer                                23      0.18%
/plugins/swift-box-wp                               15      0.12%
/plugins/wp-rocket                                  11      0.08%
/plugins/pricing-table-by-supsystic                 10      0.08%
/plugins/disable-gutenberg                          10      0.08%
/plugins/amp                                        4       0.03%
/plugins/quick-adsense                              4       0.03%
/plugins/user-activity-log                          1       0.01%
/plugins/ssl-insecure-content-fixer                 1       0.01%
/plugins/disable-comments                           1       0.01%
/plugins/penci-review                               1       0.01%
```

## What type of file does slothy expect?

A typical WordPress slow_error might look something like this:

```

[13-May-2019 23:09:24]  [pool site-30040] pid 611
script_filename = /www//.wordpress/wp-login.php
[0x00007f4328c1c060] curl_exec() /wordpress/wp-includes/Requests/Transport/cURL.php:162
[0x00007f4328c1bfa0] request() /wordpress/wp-includes/class-requests.php:379
[0x00007f4328c1bea0] request() /wordpress/wp-includes/class-http.php:384
[0x00007f4328c1bd10] request() /wordpress/wp-includes/class-http.php:596
[0x00007f4328c1bc70] post() /wordpress/wp-includes/http.php:187
[0x00007f4328c1bbe0] wp_remote_post() /www/wp-content/plugins/jetpack/modules/protect.php:729
[0x00007f4328c1bab0] protect_call() /www/wp-content/plugins/jetpack/modules/protect.php:454
[0x00007f4328c1ba10] check_login_ability() /www/wp-content/plugins/jetpack/modules/protect.php:881
[0x00007f4328c1b980] [INCLUDE_OR_EVAL]() /www/wp-content/plugins/jetpack/class.jetpack.php:1871
[0x00007f4328c1b870] load_modules() /wordpress/wp-includes/class-wp-hook.php:286
[0x00007f4328c1b790] apply_filters() /wordpress/wp-includes/class-wp-hook.php:310
[0x00007f4328c1b720] do_action() /wordpress/wp-includes/plugin.php:465
[0x00007f4328c1b620] do_action() /wordpress/wp-settings.php:377
[0x00007f4328c1b470] [INCLUDE_OR_EVAL]() /www/wp-config.php:108
[0x00007f4328c1b3f0] [INCLUDE_OR_EVAL]() /wordpress/wp-config.php:5
[0x00007f4328c1b380] [INCLUDE_OR_EVAL]() /wordpress/wp-load.php:37
[0x00007f4328c1b2e0] [INCLUDE_OR_EVAL]() /wordpress/wp-login.php:12

```

Slothy would flag this as one slow error, and count `/plugins/jetpack` as the source. (Only once, however; no matter how many times a plugin or theme is mentioned in a slow_error log entry, it will only be counted once.) 

The exact formatting of the slow_error block may vary from server to server, but it isn't important, just as long as:

* There's a blank line between each log entry block;
* The block notes either `/plugins/*/` or `/themes/*/` (where `*` indicates any combination of characters) in its text.
 
If the log entry does _not_ mention either a plugin or theme in the format above, the entry will be noted as `**wp-core**` instead (since it stands to reason a slow_error log entry that doesn't mention themes or plugins would be due to standard WordPress core functionality). Note, however, that this may not be the case if your site is running custom PHP code that isn't in a plugin or theme.