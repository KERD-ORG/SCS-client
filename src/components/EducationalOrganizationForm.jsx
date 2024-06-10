import { useState, useEffect } from "react";
import ComboBoxFreeSolo from "./ComboBoxFreeSolo";
import { getToken } from "@/utils/auth";
import axios from "axios";
import { executeAjaxOperation } from "@/utils/fetcher";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

export default function EducationalOrganizationForm({
  mode,
  onSubmit,
  initialData,
  errors: error,
}) {
  const [errors, setErrors] = useState(error ? { ...error } : {});
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    geo_admin_1: { code: "", name: "", id: "" },
    under_category: { code: "", name: "", id: "" },
    country: { code: "", name: "", id: "" },
    status: "",
    web_address: "",
    statement: "",
    file: null,
  });

  const [dropdownData, setDropdownData] = useState({
    countries: [],
    categories: [],
    states: undefined,
  });

  const [loading, setLoading] = useState(false);
  const token = getToken();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch countries
        const countriesRes = await executeAjaxOperation({
          url: `${process.env.NEXT_PUBLIC_API_ENDPOINT_COUNTRY}`,
          token,
          locale: router.locale,
        });

        // Handle countries response
        if (countriesRes.success) {
          setDropdownData((prevState) => ({
            ...prevState,
            countries: countriesRes.data.map(
              ({ country_code, country_name, id }) => ({
                code: country_code,
                name: country_name,
                id,
              })
            ),
          }));
        } else {
          toast.error(countriesRes.error);
        }

        // Fetch categories
        const categoriesRes = await executeAjaxOperation({
          url: `${process.env.NEXT_PUBLIC_API_ENDPOINT_EDUCATIONAL_ORAGANIZATION_CATEGORY}`,
          token,
          locale: router.locale,
        });

        // Handle categories response
        if (categoriesRes.success) {
          setDropdownData((prevState) => ({
            ...prevState,
            categories: categoriesRes.data.map(({ description, id, name }) => ({
              name,
              code: description,
              id,
            })),
          }));
        } else {
          toast.error(categoriesRes.error);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, [token]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const loadInitialData = async () => {
        try {
          const [stateRes, categoryRes] = await Promise.allSettled([
            executeAjaxOperation({
              url: `${process.env.NEXT_PUBLIC_API_ENDPOINT_GEO_ADMIN_1}?country=${initialData.country}`,
              token,
              locale: router.locale,
            }),
            executeAjaxOperation({
              url: `${process.env.NEXT_PUBLIC_API_ENDPOINT_EDUCATIONAL_ORAGANIZATION_CATEGORY}${initialData.under_category}/`,
              token,
              locale: router.locale,
            }),
          ]);

          const updatedDropdownData = { ...dropdownData };

          if (stateRes.status === "fulfilled" && stateRes.value.success) {
            updatedDropdownData.states = stateRes.value.data.map(
              ({ geo_admin_1_code, geo_admin_1_name, id }) => ({
                code: geo_admin_1_code,
                name: geo_admin_1_name,
                id,
              })
            );
          }

          let tempCat = { id: "", name: "", code: "" };

          if (categoryRes.status === "fulfilled" && categoryRes.value.success) {
            tempCat = categoryRes.value.data;
          }

          const countryData = updatedDropdownData.countries.find(
            (c) => c.id === initialData.country
          );
          const stateData = updatedDropdownData.states.find(
            (s) => s.id === initialData.geo_admin_1
          );

          setFormData({
            name: initialData.name,
            statement: initialData.statement,
            status: initialData.status ? "active" : "inactive",
            country: countryData || { id: "", name: "", code: "" },
            geo_admin_1: stateData || { id: "", name: "", code: "" },
            under_category: tempCat || { id: "", name: "", code: "" },
            web_address: initialData.web_address,
            file: null,
          });
        } catch (error) {
          console.error("Error loading initial data:", error);
        }
      };

      loadInitialData();
    } else {
      resetForm();
    }
  }, [mode, initialData, token]);

  const resetForm = () => {
    setDropdownData({ ...dropdownData, states: undefined });

    setFormData({
      name: "",
      geo_admin_1: { code: "", name: "", id: "" },
      under_category: { code: "", name: "", id: "" },
      country: { code: "", name: "", id: "" },
      status: "",
      web_address: "",
      statement: "",
      file: null,
    });
  };

  const handleChange = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, country, geo_admin_1, under_category, status } = formData;

    const err = {};

    // Validation check for required fields
    if (!name) {
      err.name = ["Name is required"];
    }
    if (!country || !country.id) {
      err.country = ["Country is required"];
    }
    if (!geo_admin_1 || !geo_admin_1.id) {
      err.geo_admin_1 = ["State/Province is required"];
    }
    if (!under_category || !under_category.id) {
      err.under_category = ["Category is required"];
    }
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value && typeof value === "object" && value.id) {
        submissionData.append(key, value.id);
      } else if (value !== null && value !== undefined) {
        submissionData.append(key, value);
      }
    });

    submissionData.set("status", status === "active");

    onSubmit(submissionData);
    // resetForm();
  };

  const onCountrySelect = async (_country) => {
    setFormData({
      ...formData,
      country: _country,
      geo_admin_1: { code: "", name: "", id: "" },
    });
    setLoading(true);

    try {
      const response = await executeAjaxOperation({
        url: `${process.env.NEXT_PUBLIC_API_ENDPOINT_GEO_ADMIN_1}?country=${_country.id}`,
        token,
        locale: router.locale,
      });

      setDropdownData((prevState) => ({
        ...prevState,
        states: response.data.map(
          ({ geo_admin_1_code, geo_admin_1_name, id }) => ({
            code: geo_admin_1_code,
            name: geo_admin_1_name,
            id,
          })
        ),
      }));
    } catch (error) {
      console.error("Error fetching geo admin data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewItemAdded = (type, newItem) => {
    if (type === "error") {
      toast.error(newItem, { position: "top-center" });
      return;
    }
    toast.success("Record added successfully", { position: "top-center" });
    setDropdownData((prevState) => {
      const updatedData = { ...prevState };
      updatedData[`${type.toLowerCase()}`].push(newItem);
      return updatedData;
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="add-new-record pt-0 row g-2 fv-plugins-bootstrap5 fv-plugins-framework"
      id="form-add-new-record"
    >
      <Toaster />
      <div className="col-sm-12 fv-plugins-icon-container">
        <label className="form-label" htmlFor="name">
          Organization Name
        </label>
        <div className="input-group input-group-merge has-validation">
          <input
            type="text"
            id="name"
            className="form-control dt-full-name"
            name="name"
            placeholder="University of Idaho"
            aria-label="University of Idaho"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors?.name && (
            <div className="invalid-feedback d-block">{errors.name}</div>
          )}
        </div>
      </div>

      <div className="col-sm-12 fv-plugins-icon-container">
        <label className="form-label" htmlFor="under_category">
          Category
        </label>
        <div className="input-group input-group-merge has-validation">
          <ComboBoxFreeSolo
            data={dropdownData.categories}
            defaultValue={{
              id: formData.under_category?.id,
              name: formData.under_category?.name,
              code: formData.under_category?.code,
            }}
            onValueChange={(value) => handleChange("under_category", value)}
            onNewItemAdded={handleNewItemAdded}
            type="Category"
          />
          {errors?.under_category && (
            <div className="invalid-feedback d-block">
              {errors.under_category}
            </div>
          )}
        </div>
      </div>

      <div className="col-sm-12 fv-plugins-icon-container">
        <label className="form-label" htmlFor="country">
          Country
        </label>
        <div className="input-group input-group-merge has-validation">
          <ComboBoxFreeSolo
            data={dropdownData.countries}
            defaultValue={{
              id: formData.country?.id,
              name: formData.country?.name,
              code: formData.country?.code,
            }}
            onValueChange={onCountrySelect}
            onNewItemAdded={handleNewItemAdded}
            type="Country"
          />
          {errors?.country && (
            <div className="invalid-feedback d-block">{errors.country}</div>
          )}
        </div>
      </div>

      {dropdownData.states && (
        <div className="col-sm-12 fv-plugins-icon-container">
          <label className="form-label" htmlFor="geo_admin_1">
            State
          </label>
          <div className="input-group input-group-merge has-validation">
            <ComboBoxFreeSolo
              data={dropdownData.states}
              defaultValue={{
                id: formData.geo_admin_1?.id,
                name: formData.geo_admin_1?.name,
                code: formData.geo_admin_1?.code,
              }}
              country={formData.country?.id}
              onValueChange={(value) => handleChange("geo_admin_1", value)}
              onNewItemAdded={handleNewItemAdded}
              type="State"
            />
            {errors?.geo_admin_1 && (
              <div className="invalid-feedback d-block">
                {errors.geo_admin_1}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="col-sm-12 fv-plugins-icon-container">
        <label className="form-label" htmlFor="web_address">
          Web Address <span>(optional)</span>
        </label>
        <div className="input-group input-group-merge has-validation">
          <input
            type="url"
            id="web_address"
            className="form-control dt-full-name"
            name="web_address"
            placeholder="https://test.com"
            aria-label="https://test.com"
            value={formData.web_address}
            onChange={(e) => handleChange("web_address", e.target.value)}
          />
          {errors?.web_address && (
            <div className="invalid-feedback d-block">{errors.web_address}</div>
          )}
        </div>
      </div>

      <div className="col-sm-12 fv-plugins-icon-container">
        <label className="form-label" htmlFor="status">
          Status
        </label>
        <div className="input-group input-group-merge has-validation">
          <select
            id="status"
            className="form-control"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            required
          >
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors?.status && (
            <div className="invalid-feedback d-block">{errors.status}</div>
          )}
        </div>
      </div>

      <div className="col-sm-12 fv-plugins-icon-container">
        <label className="form-label" htmlFor="statement">
          Statement
        </label>
        <div className="input-group input-group-merge has-validation">
          <textarea
            id="statement"
            className="form-control"
            aria-label="With textarea"
            value={formData.statement}
            onChange={(e) => handleChange("statement", e.target.value)}
          ></textarea>
          {errors?.statement && (
            <div className="invalid-feedback d-block">{errors.statement}</div>
          )}
        </div>
      </div>

      <div className="col-sm-12">
        <label className="form-label" htmlFor="fileUpload">
          Upload Logo <span>(optional)</span>
        </label>
        <input
          type="file"
          id="fileUpload"
          name="fileUpload"
          onChange={(e) => handleChange("file", e.target.files[0])}
          className="form-control"
        />
      </div>

      <div className="col-sm-12">
        <button
          type="submit"
          className="btn btn-primary data-submit me-sm-3 me-1 btn-sm"
        >
          Submit
        </button>
        <button
          type="reset"
          className="btn btn-outline-secondary btn-sm"
          onClick={resetForm}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
