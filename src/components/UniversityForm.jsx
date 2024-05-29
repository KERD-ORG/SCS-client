import { useState, useEffect } from "react";
import ComboBox from "./ComboBox";
import { getToken } from "@/utils/auth";
import axios from "axios";

export default function UniversityForm({
  mode,
  onSubmit,
  initialData,
  errors,
}) {
  const [name, setName] = useState("");
  const [geo_admin_1, setGeoAdmin] = useState({
    code: "",
    name: "",
    id: "",
  });
  const [under_category, setUnderCategory] = useState("");
  const [country, setCountry] = useState({
    code: "",
    name: "",
    id: "",
  });
  const [status, setStatus] = useState("");
  const [web_address, setWebAdress] = useState("");
  const [statement, setStatement] = useState("");
  const [file, setFile] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState();
  const [loading, setLoading] = useState(false);
  const token = getToken();

  useEffect(() => {
    (async function () {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const data = await res.json();

      setCountries(
        data.map(({ country_code, country_name, id }) => ({
          code: country_code,
          name: country_name,
          id,
        }))
      );
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mode === "edit" && initialData) {
          setName(initialData.name);
          setStatement(initialData.statement);
          setWebAdress(initialData.web_address);

          setStatus(initialData.status ? "active" : "inactive");
          setUnderCategory(initialData.under_category);

          const [countryResponse, geoAdminResponse] = await Promise.all([
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/${initialData.country}/`,
              { headers: { Authorization: `Token ${token}` } }
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin1/${initialData.geo_admin_1}/`,
              { headers: { Authorization: `Token ${token}` } }
            ),
          ]);
          setCountry({
            id: countryResponse.data.id,
            name: countryResponse.data.country_name,
            code: countryResponse.data.country_code,
          });

          setGeoAdmin({
            id: geoAdminResponse.data.id,
            name: geoAdminResponse.data.geo_admin_1_name,
            code: geoAdminResponse.data.geo_admin_1_code,
          });

          // Assuming onCountrySelect is used to set additional details or state based on country selection
          onCountrySelect({
            id: countryResponse.data.id,
            name: countryResponse.data.country_name,
            code: countryResponse.data.country_code,
          });
        } else {
          resetForm();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [mode, initialData]);

  const resetForm = () => {
    setName("");
    setStatement("");
    setGeoAdmin({
      code: "",
      name: "",
      id: "",
    });
    setUnderCategory("");
    setCountry({
      id: "",
      code: "",
      name: "",
    });
    setWebAdress("");
    setStatus("");
    setFile(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !name ||
      !country.id ||
      !geo_admin_1.id ||
      !under_category ||
      !status ||
      !statement
    ) {
      alert("Fill all the required fields");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("country", country.id);
    formData.append("geo_admin_1", geo_admin_1.id);
    formData.append("under_category", under_category);
    formData.append("web_address", web_address);
    formData.append("status", status === "active");
    formData.append("statement", statement);

    if (file) {
      formData.append("document", file); //
    }

    onSubmit(formData);
  };

  const handleSubmit_ = (event) => {
    event.preventDefault();
    onSubmit({ name, statement });
    resetForm();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onCountrySelect = async (_country) => {
    setCountry(_country);
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin1/`,
        {
          params: {
            country_id: _country.id,
          },
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      setStates(
        data.map(({ geo_admin_1_code, geo_admin_1_name, id }) => ({
          code: geo_admin_1_code,
          name: geo_admin_1_name,
          id,
        }))
      );
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors?.name && (
            <div className="invalid-feedback d-block">{errors.name}</div>
          )}
        </div>
        <div className="fv-plugins-message-container invalid-feedback" />
      </div>

      <div className="col-sm-12 fv-plugins-icon-container">
        <label className="form-label" htmlFor="under_category">
          Category
        </label>
        <div className="input-group input-group-merge has-validation">
          <select
            id="under_category"
            className="form-control"
            value={under_category}
            onChange={(e) => setUnderCategory(e.target.value)}
            required
          >
            {/* TODO: fetch from backend */}
            <option value="">Select category</option>
            <option value="university">University</option>
          </select>
          {errors?.under_category && (
            <div className="invalid-feedback d-block">
              {errors.under_category}
            </div>
          )}
        </div>
        <div className="fv-plugins-message-container invalid-feedback" />
      </div>

      <div className="col-sm-12 fv-plugins-icon-container">
        <label className="form-label" htmlFor="country">
          Country
        </label>
        <div className="input-group input-group-merge has-validation">
          <ComboBox
            data={countries}
            defaultValue={country}
            onValueChange={(e) => {
              onCountrySelect(e);
            }}
            type={"Country"}
          />

          {errors?.country && (
            <div className="invalid-feedback d-block">{errors.country}</div>
          )}
        </div>
        <div className="fv-plugins-message-container invalid-feedback" />
      </div>

      {states && (
        <div className="col-sm-12 fv-plugins-icon-container">
          <label className="form-label" htmlFor="geo_admin_1">
            State
          </label>
          <div className="input-group input-group-merge has-validation">
            <ComboBox
              data={states}
              defaultValue={geo_admin_1}
              onValueChange={setGeoAdmin}
              type={"State"}
              country={country ? country.id : ""}
            />
            {errors?.geo_admin_1 && (
              <div className="invalid-feedback d-block">
                {errors.geo_admin_1}
              </div>
            )}
          </div>
          <div className="fv-plugins-message-container invalid-feedback" />
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
            value={web_address}
            onChange={(e) => setWebAdress(e.target.value)}
          />
          {errors?.web_address && (
            <div className="invalid-feedback d-block">{errors.web_address}</div>
          )}
        </div>
        <div className="fv-plugins-message-container invalid-feedback" />
      </div>

      <div className="col-sm-12 fv-plugins-icon-container">
        <label className="form-label" htmlFor="status">
          Status
        </label>
        <div className="input-group input-group-merge has-validation">
          <select
            id="status"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
        <div className="fv-plugins-message-container invalid-feedback" />
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
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
          ></textarea>
          {errors?.statement && (
            <div className="invalid-feedback d-block">{errors.statement}</div>
          )}
        </div>
        <div className="fv-plugins-message-container invalid-feedback" />
      </div>

      <div className="col-sm-12">
        <label className="form-label" htmlFor="fileUpload">
          Upload Logo <span>(optional)</span>
        </label>
        <input
          type="file"
          id="fileUpload"
          name="fileUpload"
          onChange={handleFileChange}
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
          data-bs-dismiss="offcanvas"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
