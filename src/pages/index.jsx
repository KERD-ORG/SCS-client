// src/pages/index.js
import React from "react";
import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout_landing"; // Adjust path based on your project structure
import { isLoggedIn } from "../utils/auth";


export default function Landing() {
  return (
    <Layout>
      <Head>
        <title>{process.env.NEXT_PUBLIC_DOMAIN_NAME} Landing</title>
        <meta name="description" content="Learn more about us." />
      </Head>
    </Layout>
  );
}

Landing.layout = "landing";
