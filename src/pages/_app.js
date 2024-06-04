import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config.js";
import { useEffect } from "react";
import { UserPermissionsProvider } from "../contexts/UserPermissionsContext";

import "./../styles/vendor/fonts/boxicons.css";
import "./../styles/vendor/css/core.css";
import "./../styles/vendor/css/theme-default.css";
import "./../styles/css/demo.css";
import "./../styles/vendor/css/pages/page-auth.css";
import "./../styles/vendor/libs/nouislider/nouislider.css";
import "./../styles/vendor/libs/swiper/swiper.css";

import "./../styles/vendor/libs/typeahead-js/typeahead.css";
import "./../styles/vendor/libs/apex-charts/apex-charts.css";
import { Toaster } from "react-hot-toast";


function App({ Component, pageProps }) {
  useEffect(() => {
    const loadAdditionalStyles = async () => {
      if (Component.layout === "auth") {
        await import("./../styles/vendor/css/core.css");
        await import("./../styles/vendor/css/theme-default.css");
      }
      if (Component.layout === "landing") {
        await import("./../styles/vendor/css/pages/front-page.css");
        await import("./../styles/vendor/css/pages/front-page-landing.css");
      }
      if (Component.layout === "default") {
        await import("./../styles/vendor/css/rtl/core.css");
        await import("./../styles/vendor/css/rtl/theme-default.css");
      }
    };

    loadAdditionalStyles();
  }, [Component.layout]);

  return (
    <UserPermissionsProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Component {...pageProps} />
    </UserPermissionsProvider>
  );
}

export default appWithTranslation(App, nextI18NextConfig);
