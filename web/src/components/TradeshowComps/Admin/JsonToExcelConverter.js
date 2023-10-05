import React, { useEffect,useState } from "react";
import * as XLSX from "xlsx";
import download_icon from "../../../assets/images/download_icon.svg";
import styles from "../../../containers/Users.module.css";

const JsonToExcelConverter = ({ jsonData,convertDatetime }) => {

  const [exportData , setExportData] = useState([])
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
  }

  // console.log("jsonData*********", jsonData);

  function removeTimeProperties(obj,i) {
    // Create a copy of the object to avoid modifying the original object
    const newObj = { ...obj };
    // Remove the start_time and end_time properties
    delete newObj.start_time;
    delete newObj.end_time;
    delete newObj.updated_at;
    newObj.created_at = convertDatetime(newObj.created_at);
    newObj.id = i+1 
    return newObj;
  }

  const handleConvertToExcel = (e) => {
    e.preventDefault();
    jsonData.map((data,i) => {
      let obj = removeTimeProperties( data,i)
      setExportData(
        (prev) => {
         return [...prev, obj]
      }
      )
    });

    const headers = [
      "id",
      "First Name",
      "Last Name",
      "Email",
      "Hospital/Institution",
      "City",
      "Country",
      "Correct Answers",
      "Questions Attempted",
      "Time Taken",
      "Attended On(date)",
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      headers,
      ...jsonData.map((item,i) => {
        let obj = removeTimeProperties( item,i)
        return Object.values(obj)
      } ),
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Players");
    const filename = "playersList_" + formatDate(new Date());
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return jsonData.length ? (
    <button
      className={`${styles.downloadFiles}`}
      href=""
      onClick={handleConvertToExcel}
      style={{marginBottom:'1rem'}}
    >
      <img src={download_icon} alt="icon" style={{height:'auto'}}/>
      {}
      {" Export"}
    </button>
  ) : (
    <button
      className={`${styles.downloadFiles} `}
      href=""
      onClick={handleConvertToExcel}
      disabled={true}
      style={{marginBottom:'1rem'}}
    >
      <img src={download_icon} style={{height:'auto'}} alt="icon" />
      {" Export"}
    </button>
  );
};

export default JsonToExcelConverter;
