"use strict";
import React from "react";
import {render} from "react-dom";
import App from "./App";
import localforage from "localforage";
import CssBaseline from '@material-ui/core/CssBaseline';

function run() {
  const store = localforage.createInstance({name: "Contacts"});
  render(
    <React.Fragment>
      <CssBaseline />
      <App store={store} />
    </React.Fragment>,
    document.getElementById("root")
  );
}

const loadStates = ["complete", "loaded", "interactive"];

// wait for dom to load
if (loadStates.includes(document.readyState) && document.body) {
  run();
} else {
  window.addEventListener("DOMContentLoaded", run, false);
}