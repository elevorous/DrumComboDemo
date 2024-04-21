'use strict';

import { SiteUtils } from "site-utils";

SiteUtils.Analytics.gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied'
});
// just to be doubly-sure
SiteUtils.Analytics.gtag('set', 'ads_data_redaction', true);
