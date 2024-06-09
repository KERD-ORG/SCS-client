import { useState, useEffect } from "react";
import ComboBoxFreeSolo from "./ComboBoxFreeSolo";
import { getToken } from "@/utils/auth";
import axios from "axios";
import ComboBox from "./ComboBox";

export default function CampusForm({ mode, onSubmit, initialData, errors }) {
  const [formData, setFormData] = useState({
    campus_name: "",
    geo_admin_1: { code: "", name: "", id: "" },
    educational_organization: { label: "", id: "" },
    country: { code: "", name: "", id: "" },
    geo_admin_2: { name: "", id: "", country: "", geo_admin_1: "" },
    status: "",
    web_address: "",
    statement: "",
    file: null,
  });

  const [dropdownData, setDropdownData] = useState({
    countries: [],
    edu_org_list: [],
    states: undefined,
    cities: undefined,
  });

  const [loading, setLoading] = useState(false);
  const token = getToken();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [countriesRes, eduOrgsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/`, {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/educational_organizations/`,
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
          edu_org_list: eduOrgsRes.data.map(({ id, name }) => ({
            label: name,
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
        console.log(initialData);
        try {
          const [stateRes, orgRes, cityRes] = await Promise.allSettled([
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin1/?country=${initialData.country}`,
              { headers: { Authorization: `Token ${token}` } }
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/educational_organizations/`,
              { headers: { Authorization: `Token ${token}` } }
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin2/`,
              { headers: { Authorization: `Token ${token}` } }
            ),
          ]);
          const updatedDropdownData = { ...dropdownData };

          if (orgRes.status === "fulfilled") {
            updatedDropdownData.edu_org_list = orgRes.value.data.map(
              ({ id, name }) => ({
                label: name,
                id,
              })
            );
          }

          if (stateRes.status === "fulfilled") {
            updatedDropdownData.states = stateRes.value.data.map(
              ({ geo_admin_1_code, geo_admin_1_name, id }) => ({
                code: geo_admin_1_code,
                name: geo_admin_1_name,
                id,
              })
            );
          }

          if (cityRes.status === "fulfilled") {
            updatedDropdownData.cities = cityRes.value.data.map(
              ({ id, geo_admin_2_name, country, geo_admin_1 }) => ({
                name: geo_admin_2_name,
                id,
                country,
                geo_admin_1,
              })
            );
          }

          setDropdownData(updatedDropdownData);

          const countryData = updatedDropdownData.countries.find(
            (c) => c.id === initialData.country
          );
          const stateData = updatedDropdownData.states.find(
            (s) => s.id === initialData.geo_admin_1
          );
          const eduOrgData = updatedDropdownData.edu_org_list.find(
            (org) => org.id === initialData.educational_organization
          );
          const cityData = updatedDropdownData.cities.find(
            (city) => city.id === initialData.geo_admin_2
          );

          setFormData({
            campus_name: initialData.campus_name,
            statement: initialData.statement,
            status: initialData.status === "Active" ? "active" : "inactive",
            country: countryData || { id: "", name: "", code: "" },
            geo_admin_1: stateData || { id: "", name: "", code: "" },
            educational_organization: eduOrgData || { id: "", label: "" },
            geo_admin_2: cityData || {
              id: "",
              name: "",
              country: "",
              geo_admin_1: "",
            },
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
    setDropdownData({ ...dropdownData, states: undefined, cities: undefined });
    setFormData({
      campus_name: "",
      geo_admin_1: { code: "", name: "", id: "" },
      educational_organization: { label: "", id: "" },
      country: { code: "", name: "", id: "" },
      geo_admin_2: { name: "", id: "", country: "", geo_admin_1: "" },
      status: "",
      statement: "",
    });
  };

  const handleChange = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const {
      campus_name,
      country,
      geo_admin_1,
      educational_organization,
      status,
      geo_admin_2,
    } = formData;

    if (
      !campus_name ||
      !country.id ||
      !geo_admin_1.id ||
      !educational_organization.id ||
      !status ||
      !geo_admin_2.id
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

    submissionData.set("status", status === "active" ? "Active" : "Inactive");

    for (let [key, value] of submissionData.entries()) {
      console.log(key, value);
    }

    onSubmit(submissionData);
    resetForm();
  };

  const onCountrySelect = async (_country) => {
    setFormData({
      ...formData,
      country: _country,
      geo_admin_2: { name: "", id: "", country: "", geo_admin_1: "" },
      geo_admin_1: { code: "", name: "", id: "" },
    });
    setLoading(true);

    try {
      const statesRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin1/?country=${_country.id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let statesData = [];

      if (statesRes.data.length) {
        statesData = statesRes.data.map(
          ({ geo_admin_1_code, geo_admin_1_name, id }) => ({
            code: geo_admin_1_code,
            name: geo_admin_1_name,
            id,
          })
        );
      }

      setDropdownData((prevState) => ({
        ...prevState,
        states: statesData,
        cities: undefined, // Reset cities when a new country is selected
      }));
    } catch (error) {
      console.error("Error fetching states data:", error.message);
      setDropdownData((prevState) => ({
        ...prevState,
      }));
    } finally {
      setLoading(false);
    }
  };

  const onStateSelect = async (_state) => {
    setFormData({
      ...formData,
      geo_admin_2: { name: "", id: "", country: "", geo_admin_1: "" },
      geo_admin_1: _state,
    });
    console.log(_state);
    setLoading(true);

    try {
      const citiesRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin2/?geo_admin_1=${_state.id}&&country=${formData.country.id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let citiesData = [];

      if (citiesRes.data.length) {
        citiesData = citiesRes.data.map(
          ({ id, geo_admin_2_name, country, geo_admin_1 }) => ({
            name: geo_admin_2_name,
            id,
            country,
            geo_admin_1,
          })
        );
      }

      setDropdownData((prevState) => ({
        ...prevState,
        cities: citiesData,
      }));
    } catch (error) {
      console.error("Error fetching cities data:", error.message);
      setDropdownData((prevState) => ({
        ...prevState,
      }));
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
            id="campus_name"
            className="form-control dt-full-name"
            name="campus_name"
            placeholder="University of Idaho"
            aria-label="University of Idaho"
            value={formData.campus_name}
            onChange={(e) => handleChange("campus_name", e.target.value)}
          />
          {errors?.campus_name && (
            <div className="invalid-feedback d-block">{errors.campus_name}</div>
          )}
        </div>
      </div>

      <div className="col-sm-12 fv-plugins-icon-container">
        <label className="form-label" htmlFor="under_category">
          Educational Organization
        </label>
        <div className="input-group input-group-merge has-validation">
          <ComboBox
            data={dropdownData.edu_org_list}
            defaultValue={formData.educational_organization}
            onValueChange={(value) =>
              handleChange("educational_organization", value)
            }
          />
          {errors?.educational_organization && (
            <div className="invalid-feedback d-block">
              {errors.educational_organization}
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
            onValueChange={(value) => onCountrySelect(value)}
            type={"Country"}
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
              defaultValue={formData.geo_admin_1}
              onValueChange={(value) => onStateSelect(value)}
              type={"State"}
              country={formData.country?.id}
            />
            {errors?.geo_admin_1 && (
              <div className="invalid-feedback d-block">
                {errors.geo_admin_1}
              </div>
            )}
          </div>
        </div>
      )}

      {dropdownData.cities && (
        <div className="col-sm-12 fv-plugins-icon-container">
          <label className="form-label" htmlFor="geo_admin_2">
            City
          </label>
          <div className="input-group input-group-merge has-validation">
            <ComboBoxFreeSolo
              data={dropdownData.cities}
              defaultValue={formData.geo_admin_2}
              onValueChange={(value) => handleChange("geo_admin_2", value)}
              type={"City"}
              country={formData.country?.id}
              geo_admin_1={formData.geo_admin_1?.id}
            />
            {errors?.geo_admin_2 && (
              <div className="invalid-feedback d-block">
                {errors.geo_admin_2}
              </div>
            )}
          </div>
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
          aria-label="Close"
          // onClick={resetForm}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
