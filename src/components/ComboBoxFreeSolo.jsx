import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import toast from "react-hot-toast";
import { getToken } from "@/utils/auth";
import axios from "axios";

const filter = createFilterOptions();

export default function ComboBoxFreeSolo({
  defaultValue,
  type = "Country",
  data,
  onValueChange,
  ...restProp
}) {
  const [open, toggleOpen] = React.useState(false);
  const [dialogValue, setDialogValue] = React.useState({
    name: "",
    code: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!dialogValue.name || !dialogValue.code) {
      return toast.error("Fill all the fields");
    }

    const url =
      type === "Country"
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/`
        : type === "State"
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin1/`
        : type === "City"
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geo_admin2/`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/under_category/`;

    const data =
      type === "Country"
        ? {
            country_name: dialogValue.name,
            country_code: dialogValue.code,
          }
        : type === "State"
        ? {
            geo_admin_1_code: dialogValue.code,
            geo_admin_1_name: dialogValue.name,
            country: restProp.primary_key,
          }
        : type === "City"
        ? {
            geo_admin_2_name: dialogValue.name,
            geo_admin_2_code: dialogValue.code,
            country: restProp.country,
            geo_admin_1: restProp.geo_admin_1,
          }
        : {
            name: dialogValue.name,
            description: dialogValue.code,
          };

    try {
      await axios.post(url, data, {
        headers: {
          Authorization: `Token ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <React.Fragment>
      <Autocomplete
        value={defaultValue}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                name: newValue,
                code: "",
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              name: newValue.inputValue,
              code: "",
            });
          } else {
            onValueChange(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        id={`free-solo-dialog-demo-${type}`}
        options={data}
        getOptionLabel={(option) => {
          // for example value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => <li {...props}>{option["name"]}</li>}
        size="small"
        style={{ width: "100%" }}
        freeSolo
        renderInput={(params) => <TextField {...params} />}
      />
      <Dialog open={open} onClose={() => toggleOpen(false)} disablePortal>
        <form>
          <DialogTitle>Add a new {type}</DialogTitle>
          <DialogContent>
            <TextField
              style={{ marginRight: "20px" }}
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.name}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  name: event.target.value,
                })
              }
              label={`${type} name`}
              type="text"
              variant="standard"
            />
            <TextField
              margin="dense"
              id="name"
              value={dialogValue.code}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  code: event.target.value,
                })
              }
              label={type === "Category" ? "Description" : `${type} code`}
              type="text"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggleOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
