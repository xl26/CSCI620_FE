import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import  axios  from "axios";

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem
} from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomCompanyName,
  randomId,
  randomBrokerId
} from "@mui/x-data-grid-generator";
import { ResponsiveAppBar } from "./navbar";


const initialRows = [
  {
    id: randomId(),
    name: randomTraderName(),
    description: randomCompanyName(),
    dateacquired: randomCreatedDate(),
    approxval: randomBrokerId(),
    insurval: randomBrokerId()
  },
  {
    id: randomId(),
    name: randomTraderName(),
    description: randomCompanyName(),
    dateacquired: randomCreatedDate(),
    approxval: randomId(),
    insurval: randomId()
  },
  {
    id: randomId(),
    name: randomTraderName(),
    description: randomCompanyName(),
    dateacquired: randomCreatedDate(),
    approxval: randomId(),
    insurval: randomId()
  },
  {
    id: randomId(),
    name: randomTraderName(),
    description: randomCompanyName(),
    dateacquired: randomCreatedDate(),
    approxval: randomId(),
    insurval: randomId()
  },
  {
    id: randomId(),
    name: randomTraderName(),
    description: randomCompanyName(),
    dateacquired: randomCreatedDate(),
    approxval: randomId(),
    insurval: randomId()
  }
];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" }
    }));
  };

  useEffect(() => {
    axios.get("http://54.67.89.139:3001/getallInventory").then((response) => {
      console.log(response);
    });
  }, []);

  
  
  return (
    <GridToolbarContainer>
      <ResponsiveAppBar/>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired
};

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    { field: "name", headerName: "Name", width: 200, editable: true },
    { field: "desc", headerName: "Description", width: 350, editable: true },
    {
      field: "dateacquired",
      headerName: "Date Acquired",
      type: "date",
      width: 250,
      editable: true
    },
    {
      field: "approxval",
      headerName: "Approximate Value(US Dollar)",
      type: "number",
      width: 250,
      editable: true
    },
    {
      field: "insurval",
      headerName: "Insurance Value(US Dollar)",
      type: "number",
      width: 250,
      editable: true
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />
        ];
      }
    }
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary"
        },
        "& .textPrimary": {
          color: "text.primary"
        }
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel }
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}
