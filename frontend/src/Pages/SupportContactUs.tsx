import React from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { z } from "zod";
import "tailwindcss/tailwind.css";
import ResponsiveAppBar from "../components/Navbar";
import tailwindConfig from "../../tailwind.config";

const supportSchema = z.object({
  phoneNumber: z.string().min(5, "Invalid phone number"),
});

type SupportData = z.infer<typeof supportSchema>;

const supportData: SupportData = {
  phoneNumber: "15678",
};
const colors = tailwindConfig.theme.extend.colors;

const SupportContactUs = () => {
  return (
    <>
      <ResponsiveAppBar />
      <div className="flex flex-col  min-h-screen p-6 items-center text-textWhite">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl text-white rounded-2xl shadow-xl shadow-gold-1 border-2 border-gold-1 px-10 py-10 mb-16 mt-16"
        >
          <h1 className="text-center mb-8 text-3xl font-bold">Support</h1>
          <div className="w-24 mx-auto mb-4">
            <svg width="124" height="125" viewBox="0 0 124 125" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M120.507 59.5952H111.477C110.659 59.5952 109.984 60.2707 109.984 61.0884V64.1102C109.984 64.9279 110.659 65.6034 111.477 65.6034H120.507C121.324 65.6034 122 64.9279 122 64.1102V61.0884C122 60.2707 121.324 59.5952 120.507 59.5952Z" stroke="#D7B634" stroke-width="4" stroke-miterlimit="10"/>
                <path d="M60.3904 14.5163H63.4122C64.2299 14.5163 64.9054 13.8408 64.9054 13.0231V3.99315C64.9054 3.17547 64.2299 2.5 63.4122 2.5H60.3904C59.5727 2.5 58.8972 3.17547 58.8972 3.99315V13.0231C58.8972 13.8408 59.5727 14.5163 60.3904 14.5163Z" stroke="#D7B634" stroke-width="4" stroke-miterlimit="10"/>
                <path d="M90.6082 109.331C90.3949 108.976 89.9327 108.833 89.5772 109.047L88.2618 109.793C87.9063 110.007 87.7641 110.469 87.9774 110.824L90.2171 114.735C90.4304 115.09 90.8926 115.233 91.2481 115.019L92.5635 114.273C92.919 114.059 93.0612 113.597 92.8479 113.242L90.6082 109.331Z" stroke="#D7B634" stroke-width="4" stroke-miterlimit="10"/>
                <path d="M114.037 90.9867L110.127 88.7469C109.771 88.5336 109.309 88.6759 109.096 89.0314L108.349 90.3467C108.136 90.7023 108.278 91.1644 108.634 91.3777L112.544 93.6175C112.9 93.8308 113.362 93.6886 113.575 93.3331L114.322 92.0177C114.535 91.6266 114.393 91.1644 114.037 90.9867Z" stroke="#D7B634" stroke-width="4" stroke-miterlimit="10"/>
                <path d="M109.131 36.2027C109.345 36.5582 109.807 36.7004 110.162 36.4871L114.073 34.2474C114.428 34.0341 114.571 33.5719 114.357 33.2164L113.611 31.901C113.397 31.5455 112.935 31.4033 112.58 31.6166L108.669 33.8563C108.314 34.0696 108.171 34.5318 108.385 34.8873L109.131 36.2027Z" stroke="#D7B634" stroke-width="4" stroke-miterlimit="10"/>
                <path d="M92.599 10.9257L91.2836 10.1791C90.9281 9.96577 90.466 10.108 90.2527 10.4635L88.0129 14.3741C87.7996 14.7296 87.9418 15.1918 88.2973 15.4051L89.6127 16.1517C89.9683 16.365 90.4304 16.2228 90.6437 15.8673L92.8834 11.9566C93.0967 11.6011 92.9545 11.139 92.599 10.9257Z" stroke="#D7B634" stroke-width="4" stroke-miterlimit="10"/>
                <path d="M33.1937 15.8673C33.407 16.2228 33.8692 16.365 34.2247 16.1517L35.5401 15.4051C35.8956 15.1918 36.0378 14.7296 35.8245 14.3741L33.5848 10.4635C33.3715 10.108 32.9093 9.96577 32.5538 10.1791L31.2384 10.9257C30.8829 11.139 30.7407 11.6011 30.954 11.9566L33.1937 15.8673Z" stroke="#D7B634" stroke-width="4" stroke-miterlimit="10"/>
                <path d="M9.76586 34.2115L13.6765 36.4512C14.032 36.6645 14.4942 36.5223 14.7075 36.1668L15.454 34.8514C15.6673 34.4959 15.5251 34.0337 15.1696 33.8204L11.259 31.5807C10.9035 31.3674 10.4413 31.5096 10.228 31.8651L9.48145 33.1805C9.26814 33.5716 9.41035 34.0337 9.76586 34.2115Z" stroke="#D7B634" stroke-width="4" stroke-miterlimit="10"/>
                <path d="M59.0749 104.567C54.7376 104.283 50.5781 103.323 46.7031 101.83C45.281 101.261 43.5746 101.972 42.8991 103.359L41.5837 106.167C31.345 101.403 23.0971 93.12 18.3333 82.9168L21.1418 81.6014C22.5283 80.9615 23.2393 79.255 22.6705 77.7974C21.1774 73.9224 20.2175 69.7629 19.9331 65.4256C19.8264 63.8258 18.511 62.5815 16.9468 62.5815H6.49474C3.86396 62.5815 1.80199 64.8213 2.0153 67.4165C4.36167 96.7462 27.7543 120.139 57.084 122.485C59.7148 122.699 61.9189 120.601 61.9189 118.006V107.554C61.8834 105.989 60.6391 104.674 59.0749 104.567Z" stroke="#D7B634" stroke-width="4" stroke-miterlimit="10"/>
                <path d="M82.8592 41.0373C71.1984 29.6965 52.3919 29.7676 40.8022 41.2151C31.5589 50.3517 29.4969 63.9678 34.5807 75.0953C35.1496 76.3751 35.2918 77.7972 34.9363 79.1481L31.8078 90.88C31.5233 91.9821 32.5188 93.0131 33.6564 92.7286L45.3883 89.6001C46.7392 89.2446 48.1613 89.3513 49.4411 89.9557C60.5331 95.0039 74.0425 92.9775 83.1791 83.8764C94.9821 72.0023 94.8755 52.7692 82.8592 41.0373Z" stroke="#D7B634" stroke-width="4" stroke-miterlimit="10"/>
                <path d="M79.2324 66.7409V62.9725H73.011V66.7409H69.4203L78.5925 48.8232C78.6281 48.7165 78.557 48.6099 78.4503 48.6099H71.5178L62.239 66.7409V72.9624H73.011V76.7308H79.2324V72.9624H82.3609V66.7409H79.2324Z" fill="white"/>
                <path d="M59.4309 60.1641C60.0352 59.0975 60.3552 57.8532 60.3552 56.4668C60.3552 53.8004 59.502 51.7029 57.7955 50.2097C56.1246 48.6455 53.9204 47.8989 51.2541 47.8989C48.5878 47.8989 46.3836 48.6811 44.6771 50.2453C42.9707 51.8096 42.0819 53.9071 42.0819 56.5734H48.6233C48.6233 54.7247 49.5121 53.8004 51.2541 53.8004C52.9606 53.8004 53.8138 54.6892 53.8138 56.4312C53.8138 57.4266 53.3516 58.4221 52.3917 59.453L42.0819 70.6516V76.5531H60.3907V70.6516H50.0809L56.8712 63.4703C58.0799 62.1194 58.9687 61.0173 59.4309 60.1641Z" fill="white"/>
            </svg>
          </div>  


          <p className="text-center text-xl mb-3">You can call us on</p>
          <p className="text-center text-2xl font-bold">{supportData.phoneNumber}</p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              variant="contained"
              fullWidth
              sx={{
                background: "linear-gradient(to right, #FBC91A, #F8A777)",
                fontWeight: 600,
                color: colors.text,
                padding: "10px 20px",
                margin: "20px 0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textTransform: "capitalize",
                fontSize: 20,
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              Call Now
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default SupportContactUs;
