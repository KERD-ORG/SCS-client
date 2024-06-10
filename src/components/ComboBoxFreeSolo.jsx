import React, { useState } from "react";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  createFilterOptions,
  DialogActions,
  Button,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { executeAjaxOperation } from "@/utils/fetcher";
import { getToken } from "@/utils/auth";

const filter = createFilterOptions();

export default function ComboBoxFreeSolo({
  defaultValue,
  type = "Country",
  data,
  onValueChange,
  onNewItemAdded,
  ...restProps
}) {
  const [open, setOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState({ name: "", code: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!dialogValue.name || !dialogValue.code) {
      return onNewItemAdded("error", "Fill all the fields");
    }

    const urlMap = {
      Country: `${process.env.NEXT_PUBLIC_API_ENDPOINT_COUNTRY}`,
      State: `${process.env.NEXT_PUBLIC_API_ENDPOINT_GEO_ADMIN_1}`,
      City: `${process.env.NEXT_PUBLIC_API_ENDPOINT_GEO_ADMIN_2}`,
      Category: `${process.env.NEXT_PUBLIC_API_ENDPOINT_EDUCATIONAL_ORAGANIZATION_CATEGORY}`,
    };

    const dataMap = {
      Country: {
        country_name: dialogValue.name,
        country_code: dialogValue.code,
      },
      State: {
        geo_admin_1_code: dialogValue.code,
        geo_admin_1_name: dialogValue.name,
        country: restProps.country,
      },
      City: {
        geo_admin_2_name: dialogValue.name,
        geo_admin_2_code: dialogValue.code,
        country: restProps.country,
        geo_admin_1: restProps.geo_admin_1,
      },
      Category: {
        name: dialogValue.name,
        description: dialogValue.code,
      },
    };

    try {
      const res = await executeAjaxOperation({
        url: urlMap[type],
        method: "POST",
        token: getToken(),
        data: dataMap[type],
      });

      if (res.success) {
        // Format the new item correctly based on the type
        let newType = "";
        let newItem = {};
        switch (type) {
          case "Country":
            newType = "countries";
            newItem = {
              id: res.data.id,
              name: res.data.country_name,
              code: res.data.country_code,
            };
            break;
          case "State":
            newType = "states";
            newItem = {
              id: res.data.id,
              name: res.data.geo_admin_1_name,
              code: res.data.geo_admin_1_code,
            };
            break;
          case "Category":
            newType = "categories";
            newItem = {
              id: res.data.id,
              name: res.data.name,
              code: res.data.description,
            };
            break;
          case "City":
            newType = "cities";
            newItem = {
              id: res.data.id,
              name: res.data.geo_admin_2_name,
              code: res.data.geo_admin_2_code,
              country: res.data.country,
              geo_admin_1: res.data.geo_admin_1,
            };
            break;
          default:
            newType = "items";
            newItem = {
              id: res.data.id,
              name: res.data.name,
              code: res.data.code,
            };
            break;
        }

        onNewItemAdded(newType, newItem);
        setDialogValue({ name: "", code: "" });
        setOpen(false);
      } else {
        onNewItemAdded("error", "Record with the name already exists");
      }
    } catch (error) {
      console.log(error);
      onNewItemAdded("error", error.message);
    }
  };

  return (
    <>
      <Autocomplete
        value={defaultValue || { name: "", code: "" }}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            setTimeout(() => {
              setOpen(true);
              setDialogValue({ name: newValue, code: "" });
            });
          } else if (newValue && newValue.inputValue) {
            setOpen(true);
            setDialogValue({ name: newValue.inputValue, code: "" });
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
          return typeof option === "string"
            ? option
            : option.name
            ? option.name
            : "";
        }}
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        freeSolo
        size="small"
        style={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} />}
      />
      <Dialog open={open} onClose={() => setOpen(false)} disablePortal>
        <form>
          <DialogTitle>Add a new {type}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.name}
              onChange={(event) =>
                setDialogValue({ ...dialogValue, name: event.target.value })
              }
              label={`${type} name`}
              type="text"
              fullWidth
            />
            <TextField
              margin="dense"
              id="code"
              value={dialogValue.code}
              onChange={(event) =>
                setDialogValue({ ...dialogValue, code: event.target.value })
              }
              label={type === "Category" ? "Description" : `${type} code`}
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSubmit}>
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
