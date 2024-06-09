// src/pages/about.js
import React from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import { useState, useEffect } from "react";
import { isLoggedIn, logout, getToken } from "../../utils/auth";
import UniversityForm from "../../components/UniversityForm";
import { useRouter } from "next/router";
import { useUserPermissions } from "../../contexts/UserPermissionsContext";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import axios from "axios";
import EducationalOrganizationForm from "@/components/EducationalOrganizationForm";

export default function EducationalOrganizationList() {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [viewUniversity, setViewUniversity] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const token = getToken(); // Retrieve the token
  const [countries, setCountries] = useState({});
  const [geoAdmins, setGeoAdmins] = useState({});
  const [categories, setCategories] = useState({});

  const router = useRouter();
  const isAuthenticated = isLoggedIn();

  const { t } = useTranslation("common");

  const permissions = useUserPermissions();

  const canAdd = permissions.some(
    (permission) => permission.codename === "add_educationalorganizations"
  );
  const canEdit = permissions.some(
    (permission) => permission.codename === "change_educationalorganizations"
  );
  const canDetails = permissions.some(
    (permission) => permission.codename === "view_educationalorganizations"
  );
  const canDelete = permissions.some(
    (permission) => permission.codename === "delete_educationalorganizations"
  );

  function getCsrfToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      .split("=")[1];
  }

  const fetchUniversities = async () => {
    try {
      const universityResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/educational_organizations/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setUniversities(universityResponse.data);

      const countryIds = [
        ...new Set(
          universityResponse.data.map((university) => university.country)
        ),
      ];
      const geoAdminIds = [
        ...new Set(
          universityResponse.data.map((university) => university.geo_admin_1)
        ),
      ];
      const categoriesIds = [
        ...new Set(
          universityResponse.data.map((university) => university.under_category)
        ),
      ];

      const [countryResponses, geoAdminResponses, categoryResponses] =
        await Promise.allSettled([
          Promise.allSettled(
            countryIds.map((id) =>
              axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/${id}/`,
                { headers: { Authorization: `Token ${token}` } }
              )
            )
          ),
          Promise.allSettled(
            geoAdminIds.map((id) =>
              axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin1/${id}/`,
                { headers: { Authorization: `Token ${token}` } }
              )
            )
          ),
          Promise.allSettled(
            categoriesIds.map((id) =>
              axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/under_category/${id}/`,
                { headers: { Authorization: `Token ${token}` } }
              )
            )
          ),
        ]);

      const processResponses = (responses) => {
        return responses.map((res) =>
          res.status === "fulfilled" ? res.value.data : { name: "null" }
        );
      };

      const countriesData = processResponses(countryResponses.value);
      const geoAdminsData = processResponses(geoAdminResponses.value);
      const categoriesData = processResponses(categoryResponses.value);

      const countries = Object.fromEntries(
        countryIds.map((id, index) => [id, countriesData[index]])
      );
      const geoAdmins = Object.fromEntries(
        geoAdminIds.map((id, index) => [id, geoAdminsData[index]])
      );
      const categories = Object.fromEntries(
        categoriesIds.map((id, index) => [id, categoriesData[index]])
      );

      setCountries(countries);
      setGeoAdmins(geoAdmins);
      setCategories(categories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    fetchUniversities();
  }, []);

  const deleteUniversity = async (id) => {
    const isConfirmed = confirm(
      "Are you sure you want to delete this educational organization?"
    );

    if (isConfirmed) {
      try {
        const token = getToken();
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/educational_organizations/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 204) {
          // 204 No Content indicates successful deletion
          setUniversities((prevUniversities) =>
            prevUniversities.filter((uni) => uni.id !== id)
          );
          setSuccessMessage("Educational organization deleted successfully");
        } else {
          console.error("Failed to delete educational organization");
          setErrorMessage("Failed to delete educational organization");
        }
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage(error.message);
      }
    } else {
      console.log("Deletion cancelled.");
    }
  };

  const handleFormSubmit = async (data) => {
    const url =
      formMode === "create"
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/educational_organizations/`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/educational_organizations/${selectedUniversity.id}/`;
    const method = formMode === "create" ? "POST" : "PUT";

    try {
      const response = await axios({
        url,
        method,
        headers: {
          Authorization: `Token ${getToken()}`,
          "Content-Type": "application/json", // If data is JSON, otherwise adjust as needed
        },
        data,
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(
          formMode === "create"
            ? "Educational organization created successfully"
            : "Educational organization updated successfully"
        );
        fetchUniversities();
        const offcanvasElement = document.getElementById("add-new-record");
        const offcanvasInstance =
          bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
        setFormErrors({});
      } else {
        throw new Error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response.status === 400) {
        setFormErrors(error.response.data);
        setErrorMessage("Validation Failed");
      } else setErrorMessage(error.message);
    }
  };

  const openCreateForm = () => {
    setFormMode("create");
    setSelectedUniversity(null);
    setShowOffcanvas(true);
  };

  const openEditForm = (university) => {
    console.log("Opening edit form for:", university);
    setFormMode("edit");
    setSelectedUniversity(university);
    setShowOffcanvas(true);
    setFormErrors({});
  };

  const openShowView = (university) => {
    console.log("Opening show view for:", university);
    setViewUniversity(university); //
    /*const detailsOffcanvas = document.getElementById('show-details');
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(detailsOffcanvas);
        if (offcanvasInstance) {
            offcanvasInstance.show();
        } else {
            const newOffcanvasInstance = new bootstrap.Offcanvas(detailsOffcanvas);
            newOffcanvasInstance.show();
        }*/
  };

  return (
    <Layout>
      <Head>
        <title>{t("Educational Organizations")}</title>
        <meta name="description" content="Learn more about us." />
      </Head>

      <h4 className="py-3 mb-4">
        <span className="text-muted fw-light">
          {t("Educational Organizations")} /
        </span>{" "}
        {t("List")}
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
          <EducationalOrganizationForm
            mode={formMode}
            initialData={selectedUniversity}
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
          {viewUniversity ? (
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex align-items-center">
                {viewUniversity.name}
              </li>
              <li className="list-group-item d-flex align-items-center">
                {viewUniversity.description}
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
                  onClick={() => openCreateForm()}
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
                  <th scope="col">{t("Web Address")}</th>
                  <th scope="col">{t("Country")}</th>
                  <th scope="col">{t("State")}</th>
                  <th scope="col">{t("Category")}</th>
                  <th scope="col">{t("Status")}</th>
                  <th scope="col">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {universities.map((university) => (
                  <tr key={university.id}>
                    <td>{university.name}</td>
                    <td>{university.web_address}</td>
                    <td>
                      {countries[university.country]?.country_name ||
                        "Loading..."}
                    </td>
                    <td>
                      {geoAdmins[university.geo_admin_1]?.geo_admin_1_name ||
                        "Loading..."}
                    </td>
                    <td>
                      {categories[university.under_category]?.name ||
                        "Loading..."}
                    </td>
                    <td>
                      <span
                        className={`badge badge-pill ${
                          university.status ? "bg-success" : "bg-danger"
                        }`}
                        style={{ borderRadius: "15px", fontSize: "12px" }}
                      >
                        {university.status ? "Active" : "Inactive"}
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
                          onClick={() => openEditForm(university)}
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
                          onClick={() => openShowView(university)}
                        >
                          {t("Details")}
                        </button>
                      )}

                      {canDelete && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteUniversity(university.id)}
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

EducationalOrganizationList.layout = "default";
