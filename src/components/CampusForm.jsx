import { useState, useEffect } from "react";
import ComboBoxFreeSolo from "./ComboBoxFreeSolo";
import { getToken } from "@/utils/auth";
import axios from "axios";
import ComboBox from "./ComboBox";
import { ListItemText } from "@mui/material";

export default function CampusForm({ mode, onSubmit, initialData, errors }) {
  const [name, setName] = useState("");
  const [geo_admin_1, setGeoAdmin] = useState({
    code: "",
    name: "",
    id: "",
  });
  const [educational_organization, setEduOrg] = useState({
    label: "",
    id: "",
  });
  const [country, setCountry] = useState({
    code: "",
    name: "",
    id: "",
  });
  const [geo_admin_2, setGeoAdmin2] = useState({
    name: "",
    id: "",
    country: "",
    geo_admin_1: "",
  });
  const [status, setStatus] = useState("");
  const [web_address, setWebAdress] = useState("");
  const [statement, setStatement] = useState("");
  const [file, setFile] = useState(null);
  const [countries, setCountries] = useState([]);
  const [edu_org_list, setEduOrgList] = useState([]);
  const [states, setStates] = useState();
  const [cities, setCities] = useState();
  const [loading, setLoading] = useState(false);
  const token = getToken();

  useEffect(() => {
    (async function () {
      try {
        let res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        let data = await res.json();

        setCountries(
          data
            ? data.map(({ country_code, country_name, id }) => ({
                code: country_code,
                name: country_name,
                id,
              }))
            : []
        );

        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/educational_organizations/`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        data = await res.json();

        setEduOrgList(
          data
            ? data.map(({ id, name }) => ({
                label: name,
                id,
              }))
            : []
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mode === "edit" && initialData) {
          setName(initialData.campus_name);
          setStatement(initialData.statement);

          setStatus(initialData.status === "Active" ? "active" : "inactive");

          const [
            countryResponse,
            geoAdminResponse,
            eduOrgResponse,
            geoAdmin2Response,
          ] = await Promise.all([
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/${initialData.country}/`,
              { headers: { Authorization: `Token ${token}` } }
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin1/${initialData.geo_admin_1}/`,
              { headers: { Authorization: `Token ${token}` } }
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/educational_organizations/${initialData.educational_organization}/`,
              { headers: { Authorization: `Token ${token}` } }
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin2/${initialData.geo_admin_2}/`,
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

          setEduOrg({
            id: eduOrgResponse.data.id,
            label: eduOrgResponse.data.name,
          });

          setGeoAdmin2({
            id: geoAdmin2Response.data.id,
            country: geoAdmin2Response.data.country,
            name: geoAdmin2Response.data.geo_admin_2_name,
            geo_admin_1: geoAdmin2Response.data.geo_admin_1,
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
    setGeoAdmin2({
      name: "",
      id: "",
      country: "",
      geo_admin_1: "",
    });
    setEduOrg({ id: "", label: "" });
    setCountry({
      id: "",
      code: "",
      name: "",
    });
    setStatus("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !name ||
      !country.id ||
      !geo_admin_1.id ||
      !educational_organization.id ||
      !status ||
      !statement ||
      !geo_admin_2.id
    ) {
      alert("Fill all the required fields");
      return;
    }
    const formData = new FormData();
    formData.append("campus_name", name);
    formData.append("country", country.id);
    formData.append("geo_admin_1", geo_admin_1.id);
    formData.append("educational_organization", educational_organization.id);
    formData.append("geo_admin_2", geo_admin_2.id);
    formData.append("status", status === "active" ? "Active" : "Inactive");
    formData.append("statement", statement);

    onSubmit(formData);
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

      let data = response.data;
      setStates(
        data.map(({ geo_admin_1_code, geo_admin_1_name, id }) => ({
          code: geo_admin_1_code,
          name: geo_admin_1_name,
          id,
        }))
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin2/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      data = await res.json();

      setCities(
        data
          ? data.map(({ id, geo_admin_2_name, country, geo_admin_1 }) => ({
              name: geo_admin_2_name,
              id,
              country,
              geo_admin_1,
            }))
          : []
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
          Campus Name
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
          {errors?.campus_name && (
            <div className="invalid-feedback d-block">{errors.campus_name}</div>
          )}
        </div>
        <div className="fv-plugins-message-container invalid-feedback" />
      </div>

      <div className="col-sm-12 fv-plugins-icon-container">
        <label className="form-label" htmlFor="under_category">
          Educational Organization
        </label>
        <div className="input-group input-group-merge has-validation">
          <ComboBox
            data={edu_org_list}
            defaultValue={educational_organization}
            onValueChange={setEduOrg}
          />
          {errors?.educational_organization && (
            <div className="invalid-feedback d-block">
              {errors.educational_organization}
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
          <ComboBoxFreeSolo
            data={countries}
            defaultValue={country}
            onValueChange={(e) => {
              onCountrySelect(e);
            }}
            type={"Country"}
            freeSolo={true}
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
            <ComboBoxFreeSolo
              data={states}
              defaultValue={geo_admin_1}
              onValueChange={setGeoAdmin}
              type={"State"}
              country={country ? country.id : ""}
              freeSolo={true}
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

      {cities && (
        <div className="col-sm-12 fv-plugins-icon-container">
          <label className="form-label" htmlFor="geo_admin_2">
            City
          </label>
          <div className="input-group input-group-merge has-validation">
            <ComboBoxFreeSolo
              data={cities}
              defaultValue={geo_admin_2}
              onValueChange={setGeoAdmin2}
              type={"City"}
              country={country ? country.id : ""}
              geo_admin_1={geo_admin_1 ? geo_admin_1.id : ""}
            />
            {errors?.geo_admin_2 && (
              <div className="invalid-feedback d-block">
                {errors.geo_admin_2}
              </div>
            )}
          </div>
          <div className="fv-plugins-message-container invalid-feedback" />
        </div>
      )}

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
