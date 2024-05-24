import { useState, useEffect } from "react";

export default function UniversityForm({
  mode,
  onSubmit,
  initialData,
  errors,
}) {
  const [name, setName] = useState("");
  const [statement, setStatement] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setStatement(initialData.statement);
    } else {
      resetForm();
    }
  }, [mode, initialData]);

  const resetForm = () => {
    setName("");
    setStatement("");
    setFile(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
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

  return (
    <form
      onSubmit={handleSubmit}
      className="add-new-record pt-0 row g-2 fv-plugins-bootstrap5 fv-plugins-framework"
      id="form-add-new-record"
    >
      <div className="col-sm-12 fv-plugins-icon-container">
        <label className="form-label" htmlFor="name">
          University Name
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
          Upload Logo
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
