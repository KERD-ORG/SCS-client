// src/dashboard.js
import React from "react";
import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout";
import { withAuthServerSideProps } from "../utils/withAuthServerSideProps";
import { isLoggedIn, logout, getToken } from "../utils/auth";
import { useRouter } from "next/router";
import { useUserPermissions } from "../contexts/UserPermissionsContext";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();
  const isAuthenticated = isLoggedIn();

  const permissions = useUserPermissions() || [];

  const { t } = useTranslation("common");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Learn more about us." />
      </Head>

      <div className="row">
        <div className="col-lg-12 mb-4 order-0">
          <div className="card">
            <div className="d-flex align-items-end row">
              <div className="col-sm-7">
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    Congratulations John! 🎉
                  </h5>
                  <p className="mb-4">
                    You have done <span className="fw-medium">72%</span> more
                    sales today. Check your new badge in your profile.
                  </p>
                  <a
                    href="javascript:;"
                    className="btn btn-sm btn-outline-primary"
                  >
                    View Badges
                  </a>
                </div>
              </div>
              <div className="col-sm-5 text-center text-sm-left">
                <div className="card-body pb-0 px-0 px-md-4">
                  <img
                    src="../assets/img/illustrations/man-with-laptop-light.png"
                    height={140}
                    alt="View Badge User"
                    data-app-dark-img="illustrations/man-with-laptop-dark.png"
                    data-app-light-img="illustrations/man-with-laptop-light.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

Dashboard.layout = "default";

export default Dashboard;
