import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Client from "../../api/classes/client/Client";
import { EVENTS } from "../../api/classes/common/const";
import Tables from "./Tables";
import { Rnd } from "react-rnd";
import "../stylesheets/App.css";
import ResourceWatcher from "../../api/classes/client/handlers/ResourceWatcher";
import { withTracker } from "meteor/react-meteor-data";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-tabs/style/react-tabs.css";
import TextInput from "react-autocomplete-input";
import "react-autocomplete-input/dist/bundle.css";
const WatcherName = "App";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCollection: "",
      selectedQuery: [],
      queryValue: "",
      containers: [],
      buttons: [],
      tables: [],
      navbars: [],
      textInputs: [],
      containers2: [],
      buttons2: [],
      tables2: [],
      navbars2: [],
      textInputs2: [],
      draggedComponent: null,
      dbUrl:
        "mongodb+srv://tmqralphg:dj0NJtDBe7hfzZJV@cluster0.cjqqypu.mongodb.net/?retryWrites=true&w=majority",
      dbName: "retool",
      activeTab: 0,
      inputText: "",
      outputText: "",
      selectedDocument: {},
    };
    Client.setWatcher(this, WatcherName);
  }

  componentDidMount() {
    // this.setState({ userId: Client.User._id });
  }

  handleTextInput() {
    const document = this.state.selectedDocument[0];
    const regex = /{{\s*(.*?)\s*}}/g;
    const inputText = this.state.inputText;

    console.log(document);

    const replacedText = inputText.replace(regex, (match, property) => {
      const propertyValue = property
        .split(".")
        .reduce((obj, key) => obj && obj[key], document);
      return propertyValue || match;
    });

    this.setState({ outputText: replacedText });
    console.log(replacedText);
  }

  handleUpdateSelectedDocument(document) {
    console.log(document);
    this.setState({ selectedDocument: document });
  }

  handleSourceDB() {
    const source = this.state.dbUrl;
    const db = this.state.dbName;
    ResourceWatcher.getDataFromDB({ sourceUrl: source, dbName: db });
  }

  handleGetQueryButton() {
    const selectedQuery = this.state.selectedQuery;
    const trimmedQuery = selectedQuery.replace(/{{\s*(.*?)\s*}}/, "$1");

    if (this.state.activeTab === 0) {
      ResourceWatcher.reset();
      ResourceWatcher.getQuery({
        collection: this.state.selectedCollection,
        query: trimmedQuery,
      });
    } else {
      ResourceWatcher.reset2();
      ResourceWatcher.getQuery2({
        collection: this.state.selectedCollection,
        query: trimmedQuery,
      });
    }
  }

  handleGetQueryWithValueButton() {
    const selectedQuery = this.state.selectedQuery;
    const trimmedQuery = selectedQuery.replace(/{{\s*(.*?)\s*}}/, "$1");

    if (this.state.activeTab === 0) {
      ResourceWatcher.reset();
      ResourceWatcher.getQueryWithValues({
        collection: this.state.selectedCollection,
        property: trimmedQuery,
        value: this.state.queryValue,
      });
    } else {
      ResourceWatcher.reset2();
      ResourceWatcher.getQueryWithValues2({
        collection: this.state.selectedCollection,
        property: trimmedQuery,
        value: this.state.queryValue,
      });
    }
  }

  handleResetButton() {
    if (this.state.activeTab === 0) {
      ResourceWatcher.reset();
    } else {
      ResourceWatcher.reset2();
    }
  }

  handleGetData() {
    console.log(this.state.selectedQuery);
    const selectedQuery = this.state.selectedQuery;
    const trimmedQuery = selectedQuery.replace(/{{\s*(.*?)\s*}}/, "$1");

    if (this.state.selectedQuery.length !== 0 && this.state.queryValue !== "") {
      ResourceWatcher.getQueryWithValues({
        collection: this.state.selectedCollection,
        property: trimmedQuery,
        value: this.state.queryValue,
      });
    } else if (
      this.state.selectedQuery.length !== 0 &&
      this.state.queryValue === ""
    ) {
      ResourceWatcher.getQuery({
        collection: this.state.selectedCollection,
        query: trimmedQuery,
      });
    } else {
      ResourceWatcher.getData({ collection: this.state.selectedCollection });
    }
  }

  handleGetData2() {
    const selectedQuery = this.state.selectedQuery;
    const trimmedQuery = selectedQuery.replace(/{{\s*(.*?)\s*}}/, "$1");

    if (this.state.selectedQuery.length !== 0 && this.state.queryValue !== "") {
      ResourceWatcher.getQueryWithValues2({
        collection: this.state.selectedCollection,
        property: trimmedQuery,
        value: this.state.queryValue,
      });
    } else if (
      this.state.selectedQuery.length !== 0 &&
      this.state.queryValue === ""
    ) {
      ResourceWatcher.getQuery2({
        collection: this.state.selectedCollection,
        query: trimmedQuery,
      });
    } else {
      ResourceWatcher.getData2({ collection: this.state.selectedCollection });
    }
  }

  handleLogout = () => {
    Client.logout();
  };

  handleCollectionChange = (e) => {
    this.setState({ selectedCollection: e.target.value });
    ResourceWatcher.getFieldNames({ collection: e.target.value });
  };

  handleComponentDragStart = (event, componentType) => {
    this.setState({ draggedComponent: componentType });
  };

  handleComponentDrop = (event) => {
    const {
      containers,
      buttons,
      tables,
      navbars,
      textInputs,
      draggedComponent,
    } = this.state;
    const { offsetX, offsetY } = event.nativeEvent;

    let newComponent;
    if (draggedComponent === EVENTS.COMPONENTS.CONTAINER) {
      newComponent = {
        id: Date.now(),
        type: draggedComponent,
        x: offsetX,
        y: offsetY,
        width: 400, // Set the default width here
        height: 300, // Set the default height here
      };
      this.setState({ containers: [...containers, newComponent] });
    } else if (draggedComponent === EVENTS.COMPONENTS.TABLE) {
      newComponent = {
        id: Date.now(),
        type: draggedComponent,
        x: offsetX,
        y: offsetY,
        width: 200,
        height: 150,
      };
      this.setState({ tables: [...tables, newComponent] });
    } else if (draggedComponent === EVENTS.COMPONENTS.NAV) {
      newComponent = {
        id: Date.now(),
        type: draggedComponent,
        x: offsetX,
        y: offsetY,
        width: "auto",
        height: "auto",
      };
      this.setState({ navbars: [...navbars, newComponent] });
    } else if (draggedComponent === EVENTS.COMPONENTS.BUTTON) {
      newComponent = {
        id: Date.now(),
        type: draggedComponent,
        x: offsetX,
        y: offsetY,
        width: 130,
        height: 40,
      };
      this.setState({ buttons: [...buttons, newComponent] });
    } else if (draggedComponent === EVENTS.COMPONENTS.TEXT) {
      newComponent = {
        id: Date.now(),
        type: draggedComponent,
        x: offsetX,
        y: offsetY,
        width: 200,
        height: 50,
      };
      this.setState({ textInputs: [...textInputs, newComponent] });
    }
  };
  handleComponentDrop2 = (event) => {
    const { containers2, buttons2, tables2, navbars2, draggedComponent } =
      this.state;
    const { offsetX, offsetY } = event.nativeEvent;

    let newComponent;
    if (draggedComponent === EVENTS.COMPONENTS.CONTAINER) {
      newComponent = {
        id: Date.now(),
        type: draggedComponent,
        x: offsetX,
        y: offsetY,
        width: 400, // Set the default width here
        height: 300, // Set the default height here
      };
      this.setState({ containers2: [...containers2, newComponent] });
    } else if (draggedComponent === EVENTS.COMPONENTS.TABLE) {
      newComponent = {
        id: Date.now(),
        type: draggedComponent,
        x: offsetX,
        y: offsetY,
        width: 200,
        height: 150,
      };
      this.setState({ tables2: [...tables2, newComponent] });
    } else if (draggedComponent === EVENTS.COMPONENTS.NAV) {
      newComponent = {
        id: Date.now(),
        type: draggedComponent,
        x: offsetX,
        y: offsetY,
        width: "auto",
        height: "auto",
      };
      this.setState({ navbars2: [...navbars2, newComponent] });
    } else if (draggedComponent === EVENTS.COMPONENTS.BUTTON) {
      newComponent = {
        id: Date.now(),
        type: draggedComponent,
        x: offsetX,
        y: offsetY,
        width: 130,
        height: 40,
      };
      this.setState({ buttons2: [...buttons2, newComponent] });
    }
  };

  handleContainerDrag = (event, d, container) => {
    const { containers } = this.state;
    const updatedContainers = containers.map((c) =>
      c.id === container.id ? { ...c, x: d.x, y: d.y } : c
    );
    this.setState({ containers: updatedContainers });
  };
  handleContainerDrag2 = (event, d, container) => {
    const { containers2 } = this.state;
    const updatedContainers = containers2.map((c) =>
      c.id === container.id ? { ...c, x: d.x, y: d.y } : c
    );
    this.setState({ containers2: updatedContainers });
  };

  handleContainerResize = (direction, ref, delta, position, container) => {
    const { containers } = this.state;
    const updatedContainers = containers.map((c) =>
      c.id === container.id
        ? {
            ...c,
            width: c.width + delta.width,
            height: c.height + delta.height,
            x: position.x,
            y: position.y,
          }
        : c
    );
    console.log(position);
    this.setState({ containers: updatedContainers });
  };
  handleContainerResize2 = (direction, ref, delta, position, container) => {
    const { containers2 } = this.state;
    const updatedContainers = containers2.map((c) =>
      c.id === container.id
        ? {
            ...c,
            width: c.width + delta.width,
            height: c.height + delta.height,
            x: position.x,
            y: position.y,
          }
        : c
    );
    this.setState({ containers2: updatedContainers });
  };

  handleButtonsDrag = (event, d, button) => {
    const { buttons } = this.state;
    const updatedButtons = buttons.map((c) =>
      c.id === button.id ? { ...c, x: d.x, y: d.y } : c
    );
    this.setState({ buttons: updatedButtons });
  };
  handleButtonsDrag2 = (event, d, button) => {
    const { buttons2 } = this.state;
    const updatedButtons = buttons2.map((c) =>
      c.id === button.id ? { ...c, x: d.x, y: d.y } : c
    );
    this.setState({ buttons2: updatedButtons });
  };

  handleButtonsResize = (direction, ref, delta, position, button) => {
    const { buttons } = this.state;
    const updatedButtons = buttons.map((c) =>
      c.id === button.id
        ? {
            ...c,
            width: c.width + delta.width,
            height: c.height + delta.height,
            x: position.x,
            y: position.y,
          }
        : c
    );
    console.log("Updated Buttons:", updatedButtons);
    this.setState({ buttons: updatedButtons });
  };
  handleButtonsResize2 = (direction, ref, delta, position, button) => {
    const { buttons2 } = this.state;
    const updatedButtons = buttons2.map((c) =>
      c.id === button.id
        ? {
            ...c,
            width: c.width + delta.width,
            height: c.height + delta.height,
            x: position.x,
            y: position.y,
          }
        : c
    );
    console.log("Updated Buttons:", updatedButtons);
    this.setState({ buttons2: updatedButtons });
  };

  handleTablesDrag = (event, d, table) => {
    const { tables } = this.state;
    const updatedTables = tables.map((c) =>
      c.id === table.id ? { ...c, x: d.x, y: d.y } : c
    );
    this.setState({ tables: updatedTables });
  };
  handleTablesDrag2 = (event, d, table) => {
    const { tables2 } = this.state;
    const updatedTables = tables2.map((c) =>
      c.id === table.id ? { ...c, x: d.x, y: d.y } : c
    );
    this.setState({ tables2: updatedTables });
  };

  handleTablesResize = (direction, ref, delta, position, table) => {
    const { tables } = this.state;
    const updatedTables = tables.map((c) =>
      c.id === table.id
        ? {
            ...c,
            width: c.width + delta.width,
            height: c.height + delta.height,
            x: position.x,
            y: position.y,
          }
        : c
    );
    this.setState({ tables: updatedTables });
  };
  handleTablesResize2 = (direction, ref, delta, position, table) => {
    const { tables2 } = this.state;
    const updatedTables = tables2.map((c) =>
      c.id === table.id
        ? {
            ...c,
            width: c.width + delta.width,
            height: c.height + delta.height,
            x: position.x,
            y: position.y,
          }
        : c
    );
    this.setState({ tables2: updatedTables });
  };

  handleNavbarsDrag = (event, d, navbar) => {
    const { navbars } = this.state;
    const updatedNavbars = navbars.map((c) =>
      c.id === navbar.id ? { ...c, x: d.x, y: d.y } : c
    );
    this.setState({ navbars: updatedNavbars });
  };

  handleNavbarsResize = (direction, ref, delta, position, navbar) => {
    const { navbars } = this.state;
    const updatedNavbars = navbars.map((c) =>
      c.id === navbar.id
        ? {
            ...c,
            width: c.width + delta.width,
            height: c.height + delta.height,
            x: position.x,
            y: position.y,
          }
        : c
    );
    this.setState({ navbars: updatedNavbars });
  };

  handleTextInputDrag = (event, d, textInput) => {
    const { textInputs } = this.state;
    const updatedTextInput = textInputs.map((c) =>
      c.id === textInput.id ? { ...c, x: d.x, y: d.y } : c
    );
    this.setState({ textInputs: updatedTextInput });
  };

  handleTextInputResize = (direction, ref, delta, position, textInput) => {
    const { textInputs } = this.state;
    const updatedTextInput = textInputs.map((c) =>
      c.id === textInput.id
        ? {
            ...c,
            width: c.width + delta.width,
            height: c.height + delta.height,
            x: position.x,
            y: position.y,
          }
        : c
    );
    this.setState({ textInputs: updatedTextInput });
  };

  render() {
    Client.initiateWatch("App");
    const querySuggest = ResourceWatcher.QuerySuggest;
    const {
      containers,
      buttons,
      tables,
      navbars,
      textInputs,
      containers2,
      buttons2,
      tables2,
      textInputs2,
      inputText,
    } = this.state;
    console.log(querySuggest);
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-11">
            <h2>Retool App</h2>
          </div>
          <div className="col-md-1">
            <button
              className="btn btn-outline-danger"
              onClick={this.handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-9">
            {/* Middle area for canvas */}
            <Tabs onSelect={(index) => this.setState({ activeTab: index })}>
              <div
                className="card mt-5 canvas"
                onDragOver={(event) => event.preventDefault()}
              >
                <div className="card-body">
                  <TabPanel>
                    <div
                      style={{
                        height: "600px",
                        border: "1px solid black",
                        background: "lightgray",
                      }}
                      className="canvas-container"
                      onDrop={this.handleComponentDrop}
                    >
                      {containers.map((container) => (
                        <Rnd
                          key={container.id}
                          bounds=".canvas-container"
                          default={{
                            x: container.x,
                            y: container.y,
                            width: container.width ? container.width : 400,
                            height: container.height ? container.height : 300,
                          }}
                          onDragStop={(e, d) =>
                            this.handleContainerDrag(e, d, container)
                          }
                          onResizeStop={(e, direction, ref, delta, position) =>
                            this.handleContainerResize(
                              direction,
                              ref,
                              delta,
                              position,
                              container
                            )
                          }
                          id={"container" + container.id}
                          className="container-content"
                        >
                          Container
                        </Rnd>
                      ))}
                      {buttons.map((button, i) => (
                        <Rnd
                          key={button.id}
                          bounds={
                            containers[i]
                              ? "#container" + containers[i].id
                              : ".canvas-container"
                          }
                          default={{
                            x: button.x,
                            y: button.y,
                            width: button.width ? button.width : 10,
                            height: button.height ? button.height : 40,
                          }}
                          onDragStop={(e, d) =>
                            this.handleButtonsDrag(e, d, button)
                          }
                          onResizeStop={(e, direction, ref, delta, position) =>
                            this.handleButtonsResize(
                              direction,
                              ref,
                              delta,
                              position,
                              button
                            )
                          }
                          className="btn btn-primary"
                          onClick={() => this.handleGetData()}
                        >
                          Load more
                        </Rnd>
                      ))}
                      {tables.map((table, i) => (
                        <Rnd
                          key={table.id}
                          bounds={
                            containers[i]
                              ? "#container" + containers[i].id
                              : ".canvas-container"
                          }
                          default={{
                            x: table.x,
                            y: table.y,
                            width: table.width ? table.width : 200,
                            height: table.height ? table.height : 150,
                          }}
                          onDragStop={(e, d) =>
                            this.handleTablesDrag(e, d, table)
                          }
                          onResizeStop={(e, direction, ref, delta, position) =>
                            this.handleTablesResize(
                              direction,
                              ref,
                              delta,
                              position,
                              table
                            )
                          }
                          className="table-container"
                        >
                          <Tables
                            collection={this.props.sourceData}
                            selectDocument={this.handleUpdateSelectedDocument.bind(
                              this
                            )}
                          />
                        </Rnd>
                      ))}
                      {textInputs.map((textInput, i) => (
                        <Rnd
                          key={textInput.id}
                          bounds={
                            containers[i]
                              ? "#container" + containers[i].id
                              : ".canvas-container"
                          }
                          default={{
                            x: textInput.x,
                            y: textInput.y,
                            width: textInput.width ? textInput.width : 200,
                            height: textInput.height ? textInput.height : 50,
                          }}
                          onDragStop={(e, d) =>
                            this.handleTextInputDrag(e, d, textInput)
                          }
                          onResizeStop={(e, direction, ref, delta, position) =>
                            this.handleTextInputResize(
                              direction,
                              ref,
                              delta,
                              position,
                              textInput
                            )
                          }
                          className="textInput-container fs-5"
                        >
                          {this.state.outputText ? this.state.outputText : ""}
                        </Rnd>
                      ))}
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div
                      onDrop={this.handleComponentDrop2}
                      style={{
                        height: "600px",
                        border: "1px solid black",
                        background: "lightgray",
                      }}
                      className="canvas-container"
                    >
                      {containers2.map((container) => (
                        <Rnd
                          key={container.id}
                          bounds=".canvas-container"
                          default={{
                            x: container.x,
                            y: container.y,
                            width: container.width ? container.width : 400,
                            height: container.height ? container.height : 300,
                          }}
                          onDragStop={(e, d) =>
                            this.handleContainerDrag2(e, d, container)
                          }
                          onResizeStop={(e, direction, ref, delta, position) =>
                            this.handleContainerResize2(
                              direction,
                              ref,
                              delta,
                              position,
                              container
                            )
                          }
                          id={"container" + container.id}
                          className="container-content"
                        >
                          Container
                        </Rnd>
                      ))}
                      {buttons2.map((button, i) => (
                        <Rnd
                          key={button.id}
                          bounds={
                            containers2[i]
                              ? "#container" + containers2[i].id
                              : ".canvas-container"
                          }
                          default={{
                            x: button.x,
                            y: button.y,
                            width: button.width ? button.width : "auto",
                            height: button.height ? button.height : "auto",
                          }}
                          onDragStop={(e, d) =>
                            this.handleButtonsDrag2(e, d, button)
                          }
                          onResizeStop={(e, direction, ref, delta, position) =>
                            this.handleButtonsResize2(
                              direction,
                              ref,
                              delta,
                              position,
                              button
                            )
                          }
                          className="btn btn-primary"
                          onClick={() => this.handleGetData2()}
                        >
                          Load more
                        </Rnd>
                      ))}
                      {tables2.map((table, i) => (
                        <Rnd
                          key={table.id}
                          bounds={
                            containers[i]
                              ? "#container" + containers2[i].id
                              : ".canvas-container"
                          }
                          default={{
                            x: table.x,
                            y: table.y,
                            width: table.width ? table.width : "auto",
                            height: table.height ? table.height : "auto",
                          }}
                          onDragStop={(e, d) =>
                            this.handleTablesDrag2(e, d, table)
                          }
                          onResizeStop={(e, direction, ref, delta, position) =>
                            this.handleTablesResize2(
                              direction,
                              ref,
                              delta,
                              position,
                              table
                            )
                          }
                          className="table-container"
                        >
                          <Tables collection={this.props.sourceData2} />
                        </Rnd>
                      ))}
                    </div>
                  </TabPanel>
                  {navbars.map((navbar, i) => (
                    <Rnd
                      key={navbar.id}
                      bounds=".canvas-container"
                      default={{
                        x: navbar.x,
                        y: navbar.y,
                        width: navbar.width ? navbar.width : "auto",
                        height: navbar.height ? navbar.height : "auto",
                      }}
                      onDragStop={(e, d) =>
                        this.handleNavbarsDrag(e, d, navbar)
                      }
                      onResizeStop={(e, direction, ref, delta, position) =>
                        this.handleNavbarsResize(
                          direction,
                          ref,
                          delta,
                          position,
                          navbar
                        )
                      }
                    >
                      <TabList>
                        <Tab>Canvas 1</Tab>
                        <Tab>Canvas 2</Tab>
                      </TabList>
                      {/* <Navbar /> */}
                    </Rnd>
                  ))}
                </div>
              </div>
            </Tabs>
            {/* Area for database resource */}
            <div className="card mt-5">
              <div className="card-body">
                {/* Add your database resource input here */}
                <h4>Database Resource</h4>
                {/* Example database resource input */}
                <input
                  type="text"
                  placeholder="Database Source"
                  className="form-control"
                  value={this.state.dbUrl}
                  onChange={(e) => this.setState({ dbUrl: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Database Name"
                  className="form-control mt-2"
                  value={this.state.dbName}
                  onChange={(e) => this.setState({ dbName: e.target.value })}
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={this.handleSourceDB.bind(this)}
                >
                  Get Collections
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            {/* Column for component selection */}
            <div className="card mt-5">
              <div className="card-body">
                {/* Add your component selection options here */}
                <h4>Component Selection</h4>
                {/* Example component options */}
                <div className="list-group">
                  <button
                    type="button"
                    className="list-group-item list-group-item-action"
                    draggable
                    onDragStart={(event) =>
                      this.handleComponentDragStart(
                        event,
                        EVENTS.COMPONENTS.CONTAINER
                      )
                    }
                  >
                    Container
                  </button>
                  <button
                    type="button"
                    className="list-group-item list-group-item-action"
                    draggable
                    onDragStart={(event) =>
                      this.handleComponentDragStart(
                        event,
                        EVENTS.COMPONENTS.TABLE
                      )
                    }
                    onClick={() => this.handleGetData()}
                  >
                    Table
                  </button>
                  <button
                    type="button"
                    className="list-group-item list-group-item-action"
                    draggable
                    onDragStart={(event) =>
                      this.handleComponentDragStart(
                        event,
                        EVENTS.COMPONENTS.NAV
                      )
                    }
                  >
                    Navbar
                  </button>
                  <button
                    type="button"
                    className="list-group-item list-group-item-action"
                    draggable
                    onDragStart={(event) =>
                      this.handleComponentDragStart(
                        event,
                        EVENTS.COMPONENTS.BUTTON
                      )
                    }
                  >
                    Button
                  </button>
                  <button
                    type="button"
                    className="list-group-item list-group-item-action"
                    draggable
                    onDragStart={(event) =>
                      this.handleComponentDragStart(
                        event,
                        EVENTS.COMPONENTS.TEXT
                      )
                    }
                  >
                    Text Input
                  </button>
                </div>
              </div>
            </div>
            <hr />
            <h5>Collection</h5>
            <Form.Select
              onChange={this.handleCollectionChange}
              value={this.state.selectedCollection}
            >
              {this.props.collectionName.length !== 0 ? (
                this.props.collectionName.map((collection, i) => {
                  return <option key={i}>{collection}</option>;
                })
              ) : (
                <option disabled>Collection empty</option>
              )}
            </Form.Select>
            <hr />
            <div>
              <h5>Query</h5>
              {/* <Typeahead
                id="query-suggest"
                placeholder="Enter query"
                onChange={(selected) =>
                  this.setState({ selectedQuery: selected })
                }
                options={querySuggest}
                selected={this.state.selectedQuery}
              /> */}
              <TextInput
                trigger={["{{"]}
                spacer="}}"
                options={querySuggest}
                className="form-control mt-2"
                placeholder="Enter Text"
                maxOptions={10}
                Component="input"
                onChange={(inputValue) => {
                  this.setState({ selectedQuery: inputValue });
                }}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={() => this.handleGetQueryButton()}
              >
                Get query
              </button>
              {/* <Typeahead
                id="value-suggest"
                placeholder="Enter value"
                options={["value1", "value2", "sample3", "test4"]}
              /> */}
              <input
                className="form-control mt-2"
                type="text"
                placeholder="Enter Value"
                value={this.state.queryValue}
                onChange={(e) => this.setState({ queryValue: e.target.value })}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={() => this.handleGetQueryWithValueButton()}
              >
                Get document
              </button>
              <hr />
              <h6>Text Input Value</h6>
              <TextInput
                trigger={["{{"]}
                spacer="}}"
                options={querySuggest}
                className="form-control mt-2"
                placeholder="Enter Text"
                maxOptions={10}
                // Component="input"
                onChange={(inputValue) => {
                  this.setState({ inputText: inputValue });
                }}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={() => this.handleTextInput()}
              >
                Insert text
              </button>
              <hr />
              <button
                onClick={() => this.handleResetButton()}
                className="btn btn-outline-secondary"
              >
                Reset table
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker((props) => {
  const collectionName = ResourceWatcher.CollectionNames;
  const sourceData = ResourceWatcher.SourceData.find().fetch();
  const sourceData2 = ResourceWatcher.SourceData2.find().fetch();
  return {
    collectionName,
    sourceData,
    sourceData2,
  };
})(Main);

// import React from "react";
// import Client from "../../api/classes/client/Client";
// // import { Rnd } from "react-rnd";
// import Container from "./Container";
// const WatcherName = "app";

// class Main extends React.Component {
//   constructor(props) {
//     super(props);
//     Client.setWatcher(this, WatcherName);
//     this.state = {
//       selectedComponent: null,
//     };
//   }

//   handleLogout = () => {
//     Client.logout();
//   };

//   handleComponentSelection = (componentName) => {
//     this.setState({ selectedComponent: componentName });
//   };

//   render() {
//     Client.initiateWatch(WatcherName);

//     return (
//       <div className="container-fluid">
//         <div className="row">
//           <div className="col-md-11">
//             <h2>Retool App</h2>
//           </div>
//           <div className="col-md-1">
//             <button
//               className="btn btn-outline-danger"
//               onClick={this.handleLogout}
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-md-9">
//             {/* Middle area for canvas */}
//             <div className="card mt-5 canvas">
//               <div className="card-body">
//                 <div
//                   style={{ height: "600px", border: "1px solid black" }}
//                 >
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-3">
//             {/* Column for component selection */}
//             <div className="card mt-5">
//               <div className="card-body">
//                 {/* Add your component selection options here */}
//                 <h4>Component Selection</h4>
//                 {/* Example component options */}
//                 <div className="list-group">
//                   <button
//                     type="button"
//                     className="list-group-item list-group-item-action"
//                   >
//                     Container
//                   </button>
//                   <button
//                     type="button"
//                     className="list-group-item list-group-item-action"
//                   >
//                     Table
//                   </button>
//                   <button
//                     type="button"
//                     className="list-group-item list-group-item-action"
//                   >
//                     Navbar
//                   </button>
//                   <button
//                     type="button"
//                     className="list-group-item list-group-item-action"
//                   >
//                     Button
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-md-12">
//             {/* Area for database resource */}
//             <div className="card mt-5">
//               <div className="card-body">
//                 {/* Add your database resource input here */}
//                 <h4>Database Resource</h4>
//                 {/* Example database resource input */}
//                 <input type="text" placeholder="Database Source" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default Main;
