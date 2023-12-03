import { useState, useEffect } from "react";
import "./App.css";

const API_ENDPOINT =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await fetch(API_ENDPOINT);
      const jsonData = await response.json();
      setData(jsonData);
      setFilteredData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    if (searchTerm === "" || searchTerm === null) {
      setFilteredData(data);
      return;
    }
    const filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleRowSelectAll = () => {
    const displayedRows = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    const displayedRowIds = displayedRows.map((row) => row.id);
    const selectedRowIds = selectedRows.map((row) => row.id);
    console.log(displayedRowIds);
    if (displayedRowIds.length === selectedRowIds.length) {
      setSelectedRows(
        selectedRows.filter((row) => displayedRowIds.includes(row.id))
      );
    } else {
      setSelectedRows([...selectedRows, ...displayedRowIds]);
    }
  };

  const handleInputChange = (id, field, value) => {
    const index = data.findIndex((row) => row.id === id);
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setData(updatedData);
    const updatedFilteredData = [...filteredData];
    updatedFilteredData[index] = {
      ...updatedFilteredData[index],
      [field]: value,
    };
    setFilteredData(updatedFilteredData);
  };

  const handleEdit = (id) => {
    let index = 0;
    if(searchTerm !== ""){
      index = filteredData.findIndex((row) => row.id === id);

      const pageNumber = Math.ceil((index + 1) / itemsPerPage);
      paginate(pageNumber);
      
    } else {
      index = data.findIndex((row) => row.id === id);
    }
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], editable: true };
    setData(updatedData);
    const updatedFilteredData = [...filteredData];
    updatedFilteredData[index] = {
      ...updatedFilteredData[index],
      editable: true,
    };
    setFilteredData(updatedFilteredData);
  };

  const handleSave = (id) => {
    const index = data.findIndex((row) => row.id === id);
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], editable: false };
    setData(updatedData);
    const updatedFilteredData = [...filteredData];
    updatedFilteredData[index] = {
      ...updatedFilteredData[index],
      editable: false,
    };
    setFilteredData(updatedFilteredData);
  };

  const handleDeleteSelected = () => {
    const willDelete = window.confirm(
      `Are you sure you want to delete selected rows?`
    );
    if (!willDelete) {
      return;
    }
    const updatedData = data.filter((row) => !selectedRows.includes(row.id));
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRows([]);
    paginate(1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="app">
      <h1 className="header">
        <span className="title">Admin UI</span>
      </h1>
      <div className="section-header">
        <div className="search">
          <input
            type="text"
            placeholder="Search email, name, role"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button onClick={handleSearch} className="search-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-list-search"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M15 15m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
              <path d="M18.5 18.5l2.5 2.5" />
              <path d="M4 6h16" />
              <path d="M4 12h4" />
              <path d="M4 18h4" />
            </svg>
          </button>
        </div>
        <button
          onClick={handleDeleteSelected}
          className="delete-button"
          disabled={selectedRows.length === 0}
        >
          Delete Selected{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-trash-filled"
            width={20}
            height={20}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#ffffff"
            fill="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z"
              strokeWidth={0}
              fill="currentColor"
            />
            <path
              d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z"
              strokeWidth={0}
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      <div className="responsive-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleRowSelectAll}
                  checked={
                    filteredData.length > 0 &&
                    selectedRows.length ===
                      filteredData.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      ).length
                  }
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row) => (
              <tr
                key={row.id}
                id={selectedRows.includes(row.id) ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                  />
                </td>
                <td>{row.id}</td>
                <td>
                  {row.editable ? (
                    <input
                      value={row.name}
                      onChange={(e) =>
                        handleInputChange(row.id, "name", e.target.value)
                      }
                    />
                  ) : (
                    row.name
                  )}
                </td>
                <td>
                  {row.editable ? (
                    <input
                      value={row.email}
                      onChange={(e) =>
                        handleInputChange(row.id, "email", e.target.value)
                      }
                    />
                  ) : (
                    row.email
                  )}
                </td>
                <td>
                  {row.editable ? (
                    <input
                      value={row.role}
                      onChange={(e) =>
                        handleInputChange(row.id, "role", e.target.value)
                      }
                    />
                  ) : (
                    row.role
                  )}
                </td>
                <td className="actions">
                  {row.editable ? (
                    <button
                      onClick={() => handleSave(row.id)}
                      className="save-button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-device-floppy"
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#ffffff"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                        <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M14 4l0 4l-6 0l0 -4" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (row.editable) {
                          handleSave(row.id);
                          console.log(row);
                        } else if(row.id === 1){
                          alert("You cannot edit this row");
                        }
                        else {
                          handleEdit(row.id);
                        }

                      }
                      }
                      className="edit-button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-database-edit"
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#ffffff"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3s-8 1.343 -8 3" />
                        <path d="M4 6v6c0 1.657 3.582 3 8 3c.478 0 .947 -.016 1.402 -.046" />
                        <path d="M20 12v-6" />
                        <path d="M4 12v6c0 1.526 3.04 2.786 6.972 2.975" />
                        <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const isConfirmed = window.confirm(
                        `Are you sure you want to delete row no: ` +
                          row.id +
                          `?`
                      );

                      if (isConfirmed) {
                        const updatedData = data.filter((r) => r.id !== row.id);
                        setData(updatedData);
                        setFilteredData(updatedData);
                      }
                    }}
                    className="delete-button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-trash"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#ffffff"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 7l16 0" />
                      <path d="M10 11l0 6" />
                      <path d="M14 11l0 6" />
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="footer">
        <div className="selected-item">
          <span className="bold">{selectedRows.length}</span> of{" "}
          <span className="bold">{filteredData.length}</span>{" "}
          {filteredData.length === 1 ? "item" : "items"} selected
        </div>
        <div className="pagination">
          <span className="bold">
            Page {currentPage} of{" "}
            {Math.ceil(filteredData.length / itemsPerPage)}
          </span>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-arrow-big-left-line"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 15v3.586a1 1 0 0 1 -1.707 .707l-6.586 -6.586a1 1 0 0 1 0 -1.414l6.586 -6.586a1 1 0 0 1 1.707 .707v3.586h6v6h-6z" />
              <path d="M21 15v-6" />
            </svg>
          </button>
          <ul>
            {Array.from({
              length: Math.ceil(filteredData.length / itemsPerPage),
            })
              .map((_, index) => index + 1)
              .map((pageNumber) => (
                <li key={pageNumber}>
                  <button
                    onClick={() => {
                      paginate(pageNumber);

                      setSelectedRows([]);
                    }}
                    id={pageNumber === currentPage ? "active" : ""}
                  >
                    {pageNumber}
                    {pageNumber === 1 ? (
                      <span className="first-page">(first)</span>
                    ) : pageNumber ===
                      Math.ceil(filteredData.length / itemsPerPage) ? (
                      <span className="last-page">(last)</span>
                    ) : (
                      ""
                    )}
                  </button>
                </li>
              ))}
          </ul>
          <button
            onClick={() => {
              paginate(currentPage + 1);
              setSelectedRows([]);
            }}
            disabled={
              currentPage === Math.ceil(filteredData.length / itemsPerPage)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-arrow-big-right-line"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 9v-3.586a1 1 0 0 1 1.707 -.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586a1 1 0 0 1 -1.707 -.707v-3.586h-6v-6h6z" />
              <path d="M3 9v6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
