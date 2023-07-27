import React from "react";
import "../stylesheets/Tables.css";
import ResourceWatcher from "../../api/classes/client/handlers/ResourceWatcher";

class Tables extends React.Component {
  constructor(props) {
    super(props);
  }

  renderCellContent(property) {
    if (
      Array.isArray(property) &&
      property.length > 0 &&
      typeof property[0] === "object"
    ) {
      // Render dropdown menu for array of objects
      return (
        <select>
          {property.map((item, index) => (
            <option key={index} value={index}>
              {JSON.stringify(item)}
            </option>
          ))}
        </select>
      );
    } else if (typeof property === "object") {
      // Render object property value
      return Object.values(property).join(", ");
    } else {
      return property;
    }
  }

  handleGetDocument = async (documentId) => {
    const document = await ResourceWatcher.SourceData.find(documentId).fetch();
    console.log(document);
    this.props.selectDocument(document);
  };

  render() {
    const documents = this.props.collection;
    const tableHeaders = documents.length > 0 ? Object.keys(documents[0]) : [];

    return (
      <table className="table table-component">
        <thead>
          <tr>
            {tableHeaders.map((header) => {
              if (header !== "index1") {
                return (
                  <th key={header} scope="col">
                    {header}
                  </th>
                );
              }
              return null;
            })}
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((document) => (
              <tr key={document.id}>
                {tableHeaders.map((header) => {
                  if (header !== "index1") {
                    return (
                      <td
                        key={header}
                        onClick={() => this.handleGetDocument(document[header])}
                      >
                        {this.renderCellContent(document[header])}
                      </td>
                    );
                  }
                  return null;
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableHeaders.length}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

// class Tables extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     const documents = this.props.collection;
//     console.log(documents);
//     const tableHeaders = documents.length > 0 ? Object.keys(documents[0]) : [];

//     return (
//       <table className="table table-component">
//         <thead>
//           <tr>
//             {tableHeaders.map((header) => {
//               if (header !== "index1") {
//                 return (
//                   <th key={header} scope="col">
//                     {header}
//                   </th>
//                 );
//               }
//               return null;
//             })}
//           </tr>
//         </thead>
//         <tbody>
//           {documents.length > 0 ? (
//             documents.map((document) => (
//               <tr key={document.id}>
//                 {tableHeaders.map((header) => {
//                   if (header !== "index1") {
//                     return <td key={header}>{document[header]}</td>;
//                   }
//                   return null;
//                 })}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={tableHeaders.length}>No data available</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     );
//   }
// }
export default Tables;
