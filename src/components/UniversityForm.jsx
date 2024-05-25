import { useState, useEffect } from "react";
import ComboBox from "./ComboBox";

const top100Films = ["a", "b", "c", "d"];

export default function UniversityForm({
  mode,
  onSubmit,
  initialData,
  errors,
}) {
  const [name, setName] = useState("");
  const [geo_admin_1, setGeoAdmin] = useState("");
  const [under_category, setUnderCategory] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("");
  const [web_address, setWebAdress] = useState("");
  const [statement, setStatement] = useState("");
  const [file, setFile] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/iso"
      );
      const { data } = await res.json();
      setCountries(data.map((val) => val.name));
    })();
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setStatement(initialData.statement);
      setWebAdress(initialData.web_address);
      setCountry(initialData.country);
      setGeoAdmin(initialData.geo_admin_1);
      setStatus(initialData.status ? "active" : "inactive");
      setUnderCategory(initialData.under_category);
      onCountrySelect(initialData.country);
    } else {
      resetForm();
    }
  }, [mode, initialData]);

  const resetForm = () => {
    setName("");
    setStatement("");
    setGeoAdmin("");
    setUnderCategory("");
    setCountry("");
    setWebAdress("");
    setStatus("");
    setFile(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !name ||
      !country ||
      !geo_admin_1 ||
      !under_category ||
      !status ||
      !statement
    ) {
      alert("Fill all the required fields");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("country", country);
    formData.append("geo_admin_1", geo_admin_1);
    formData.append("under_category", under_category);
    formData.append("web_address", web_address);
    formData.append("status", status === "active");
    formData.append("statement", statement);
    // formData.append("created_at", new Date().toISOString().split('T')[0]);
    // formData.append("updated_at", new Date().toISOString().split('T')[0]);

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
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country: _country }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.msg);
      setStates(data.data.states.map((val) => val.name));
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
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
            value={country}
            setValue={onCountrySelect}
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
              value={geo_admin_1}
              setValue={setGeoAdmin}
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
