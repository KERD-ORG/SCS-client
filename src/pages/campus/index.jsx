import React, { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import { isLoggedIn, getToken } from "../../utils/auth";
import { useRouter } from "next/router";
import { useUserPermissions } from "../../contexts/UserPermissionsContext";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import axios from "axios";
import CampusForm from "@/components/CampusForm";

export default function CampusList() {
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [viewCampus, setViewCampus] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const token = getToken();
  const [countries, setCountries] = useState({});
  const [geoAdmins1, setGeoAdmins1] = useState({});
  const [geoAdmins2, setGeoAdmins2] = useState({});
  const [eduOrgs, setEduOrgs] = useState({});

  const router = useRouter();
  const isAuthenticated = isLoggedIn();

  const { t } = useTranslation("common");

  const permissions = useUserPermissions();

  const canAdd = permissions.some(
    (permission) => permission.codename === "add_campus"
  );
  const canEdit = permissions.some(
    (permission) => permission.codename === "change_campus"
  );
  const canDetails = permissions.some(
    (permission) => permission.codename === "view_campus"
  );
  const canDelete = permissions.some(
    (permission) => permission.codename === "delete_campus"
  );

  function getCsrfToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      .split("=")[1];
  }

  const fetchCampuses = async () => {
    try {
      const campusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campus/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setCampuses(campusResponse.data);

      const countryIds = [
        ...new Set(campusResponse.data.map((campus) => campus.country)),
      ];
      const geoAdminIds1 = [
        ...new Set(campusResponse.data.map((campus) => campus.geo_admin_1)),
      ];
      const geoAdminIds2 = [
        ...new Set(campusResponse.data.map((campus) => campus.geo_admin_2)),
      ];
      const eduOrgIds = [
        ...new Set(
          campusResponse.data.map((campus) => campus.educational_organization)
        ),
      ];

      const [
        countriesResponse,
        geoAdmin1Response,
        geoAdmin2Response,
        eduOrgResponse,
      ] = await Promise.allSettled([
        Promise.allSettled(
          countryIds.map((id) =>
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/${id}/`,
              { headers: { Authorization: `Token ${token}` } }
            )
          )
        ),
        Promise.allSettled(
          geoAdminIds1.map((id) =>
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin1/${id}/`,
              { headers: { Authorization: `Token ${token}` } }
            )
          )
        ),
        Promise.allSettled(
          geoAdminIds2.map((id) =>
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin2/${id}/`,
              { headers: { Authorization: `Token ${token}` } }
            )
          )
        ),
        Promise.allSettled(
          eduOrgIds.map((id) =>
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/educational_organizations/${id}/`,
              { headers: { Authorization: `Token ${token}` } }
            )
          )
        ),
      ]);

      console.log(eduOrgResponse);

      const processResponses = (responses) => {
        return responses.map((res) =>
          res.status === "fulfilled" ? res.value.data : { name: "null" }
        );
      };

      const countriesData = processResponses(countriesResponse.value);
      const geoAdmins1Data = processResponses(geoAdmin1Response.value);
      const geoAdmins2Data = processResponses(geoAdmin2Response.value);
      const eduOrgsData = processResponses(eduOrgResponse.value);

      const countries = Object.fromEntries(
        countryIds.map((id, index) => [id, countriesData[index]])
      );
      const geoAdmins1 = Object.fromEntries(
        geoAdminIds1.map((id, index) => [id, geoAdmins1Data[index]])
      );
      const geoAdmins2 = Object.fromEntries(
        geoAdminIds2.map((id, index) => [id, geoAdmins2Data[index]])
      );
      const eduOrgs = Object.fromEntries(
        eduOrgIds.map((id, index) => [id, eduOrgsData[index]])
      );

      setCountries(countries);
      setGeoAdmins1(geoAdmins1);
      setGeoAdmins2(geoAdmins2);
      setEduOrgs(eduOrgs);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    fetchCampuses();
  }, [isAuthenticated, router, token]);

  const deleteCampus = async (id) => {
    if (confirm("Are you sure you want to delete this campus?")) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campus/${id}/`,
          { headers: { Authorization: `Token ${token}` } }
        );

        if (response.status === 204) {
          setCampuses((prevCampuses) =>
            prevCampuses.filter((campus) => campus.id !== id)
          );
          setSuccessMessage("Campus deleted successfully");
        } else {
          setErrorMessage("Failed to delete Campus");
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  const handleFormSubmit = async (data) => {
    const url =
      formMode === "create"
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campus/`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campus/${selectedCampus.id}/`;
    const method = formMode === "create" ? "POST" : "PUT";

    try {
      const response = await axios({
        url,
        method,
        headers: { Authorization: `Token ${token}` },
        data,
      });

      if ([200, 201].includes(response.status)) {
        setSuccessMessage(
          formMode === "create"
            ? "Campus created successfully"
            : "Campus updated successfully"
        );
        fetchCampuses();
        bootstrap.Offcanvas.getInstance(
          document.getElementById("add-new-record")
        ).hide();
        setFormErrors({});
      } else {
        throw new Error("An error occurred. Please try again.");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setFormErrors(error.response.data);
        setErrorMessage("Validation Failed");
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  const openCreateForm = () => {
    setFormMode("create");
    setSelectedCampus(null);
    setShowOffcanvas(true);
  };

  const openEditForm = (campus) => {
    setFormMode("edit");
    setSelectedCampus(campus);
    setShowOffcanvas(true);
    setFormErrors({});
  };

  const openShowView = (campus) => {
    setViewCampus(campus);
  };

  return (
    <Layout>
      <Head>
        <title>{t("Campus")}</title>
        <meta name="description" content="Learn more about us." />
      </Head>

      <h4 className="py-3 mb-4">
        <span className="text-muted fw-light">{t("Campus")} /</span> {t("List")}
      </h4>

      <div
        className="offcanvas offcanvas-end"
        id="add-new-record"
        tabIndex={-1}
        aria-labelledby="addNewRecordLabel"
        aria-hidden="true"
        style={{ width: "500px" }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="addNewRecordLabel">
            {formMode === "create" ? t("New Record") : t("Edit Record")}
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          <CampusForm
            mode={formMode}
            initialData={selectedCampus}
            onSubmit={handleFormSubmit}
            errors={formErrors}
          />
        </div>
      </div>

      <div
        className="offcanvas offcanvas-end"
        id="show-details"
        tabIndex={-1}
        aria-labelledby="showDetailsLabel"
        aria-hidden="true"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="showDetailsLabel">
            {t("Details")}
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          {viewCampus ? (
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex align-items-center">
                {viewCampus.campus_name}
              </li>
              <li className="list-group-item d-flex align-items-center">
                {viewCampus.statement}
              </li>
            </ul>
          ) : (
            <p>No details available</p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header flex-column flex-md-row">
          <div className="dt-action-buttons text-end pt-3 pt-md-0">
            <div className="dt-buttons btn-group flex-wrap">
              {canAdd && (
                <button
                  className="btn btn-secondary create-new btn-primary"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#add-new-record"
                  aria-controls="add-new-record"
                  onClick={openCreateForm}
                >
                  <span>
                    <i className="bx bx-plus me-sm-1" />{" "}
                    <span className="d-none d-sm-inline-block">
                      {t("Add New Record")}
                    </span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card-body">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <div className="table-responsive text-nowrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">{t("Name")}</th>
                  <th scope="col">{t("Educational Organization")}</th>
                  <th scope="col">{t("Country")}</th>
                  <th scope="col">{t("State")}</th>
                  <th scope="col">{t("City")}</th>
                  <th scope="col">{t("Status")}</th>
                  <th scope="col">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {campuses.map((campus) => (
                  <tr key={campus.id}>
                    <td>{campus.campus_name}</td>
                    <td>
                      {eduOrgs[campus.educational_organization]?.name ||
                        "Loading..."}
                    </td>
                    <td>
                      {countries[campus.country]?.country_name || "Loading..."}
                    </td>
                    <td>
                      {geoAdmins1[campus.geo_admin_1]?.geo_admin_1_name ||
                        "Loading..."}
                    </td>
                    <td>
                      {geoAdmins2[campus.geo_admin_2]?.geo_admin_2_name ||
                        "Loading..."}
                    </td>
                    <td>
                      <span
                        className={`badge badge-pill ${
                          campus.status === "Active"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                        style={{ borderRadius: "15px", fontSize: "12px" }}
                      >
                        {campus.status}
                      </span>
                    </td>
                    <td>
                      {canEdit && (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          type="button"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#add-new-record"
                          aria-controls="add-new-record"
                          onClick={() => openEditForm(campus)}
                        >
                          {t("Edit")}
                        </button>
                      )}

                      {canDetails && (
                        <button
                          className="btn btn-success btn-sm me-2"
                          type="button"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#show-details"
                          aria-controls="show-details"
                          onClick={() => openShowView(campus)}
                        >
                          {t("Details")}
                        </button>
                      )}

                      {canDelete && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteCampus(campus.id)}
                        >
                          {t("Delete")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])), // Load the 'common' namespace
    },
  };
}

CampusList.layout = "default";
