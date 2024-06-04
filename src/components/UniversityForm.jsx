import { useState, useEffect } from "react";
import ComboBoxFreeSolo from "./ComboBoxFreeSolo";
import { getToken } from "@/utils/auth";
import axios from "axios";

export default function UniversityForm({
  mode,
  onSubmit,
  initialData,
  errors,
}) {
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
    states: [],
  });

  const [loading, setLoading] = useState(false);
  const token = getToken();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [countriesRes, categoriesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/`, {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/under_category/`,
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]);

        setDropdownData((prevState) => ({
          ...prevState,
          countries: countriesRes.data.map(
            ({ country_code, country_name, id }) => ({
              code: country_code,
              name: country_name,
              id,
            })
          ),
          categories: categoriesRes.data.map(({ description, id, name }) => ({
            name,
            code: description,
            id,
          })),
        }));
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
          const [country, geoAdmin1, category] = await Promise.all([
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/${initialData.country}/`,
              { headers: { Authorization: `Token ${token}` } }
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin1/${initialData.geo_admin_1}/`,
              { headers: { Authorization: `Token ${token}` } }
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/under_category/${initialData.under_category}/`,
              { headers: { Authorization: `Token ${token}` } }
            ),
          ]);

          setFormData({
            name: initialData.name,
            statement: initialData.statement,
            status: initialData.status,
            country: {
              id: country.data.id,
              name: country.data.country_name,
              code: country.data.country_code,
            },
            geo_admin_1: {
              id: geoAdmin1.data.id,
              name: geoAdmin1.data.geo_admin_1_name,
              code: geoAdmin1.data.geo_admin_1_code,
            },
            under_category: {
              id: category.data.id,
              name: category.data.name,
              code: category.data.description,
            },
            web_address: initialData.web_address,
            file: null,
          });

          onCountrySelect({
            id: country.data.id,
            name: country.data.country_name,
            code: country.data.country_code,
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
    const {
      name,
      country,
      geo_admin_1,
      under_category,
      status,
      statement,
      web_address,
      file,
    } = formData;

    if (
      !name ||
      !country.id ||
      !geo_admin_1.id ||
      !under_category.id ||
      !status ||
      !statement
    ) {
      alert("Fill all the required fields");
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

    for (let [key, value] of submissionData.entries()) {
      console.log(key, value);
    }

    onSubmit(submissionData);
    // resetForm();
  };

  const onCountrySelect = async (_country) => {
    handleChange("country", _country);
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin1/`,
        {
          params: { country_id: _country.id },
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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

  return (
    <form
      onSubmit={handleSubmit}
      className="add-new-record pt-0 row g-2 fv-plugins-bootstrap5 fv-plugins-framework"
      id="form-add-new-record"
    >
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
              id: formData.under_category.id,
              name: formData.under_category.name,
              code: formData.under_category.code,
            }}
            onValueChange={(value) => handleChange("under_category", value)}
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
              id: formData.country.id,
              name: formData.country.name,
              code: formData.country.code,
            }}
            onValueChange={onCountrySelect}
            type="Country"
          />
          {errors?.country && (
            <div className="invalid-feedback d-block">{errors.country}</div>
          )}
        </div>
      </div>

      {dropdownData.states.length > 0 && (
        <div className="col-sm-12 fv-plugins-icon-container">
          <label className="form-label" htmlFor="geo_admin_1">
            State
          </label>
          <div className="input-group input-group-merge has-validation">
            <ComboBoxFreeSolo
              data={dropdownData.states}
              defaultValue={{
                id: formData.geo_admin_1.id,
                name: formData.geo_admin_1.name,
                code: formData.geo_admin_1.code,
              }}
              primary_key={formData.country.id}
              onValueChange={(value) => handleChange("geo_admin_1", value)}
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
            value={formData.status ? "active" : "inactive"}
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
