import React from "react";
import countryList from "country-list";
import { FormControl, InputLabel, Select, MenuItem, withStyles } from "@material-ui/core";

const menuItems = countryList().getNames().map(name => (
  <MenuItem value={name} key={name}>{name}</MenuItem>
));

const styles = theme => ({
  formControl: {
    width: "100%",
    marginTop: 8,
    marginBottom: 4
  }
});

class CountryPicker extends React.Component {
  render() {
    return <FormControl className={this.props.classes.formControl}>
      <InputLabel htmlFor="country">Country</InputLabel>
      <Select
        value={this.props.value}
        onChange={this.props.onCountrySelected}
        inputProps={{
          id: "country"
        }}>
        <MenuItem value="" key="None">
          <em>None</em>
        </MenuItem>
        {menuItems}
      </Select>
    </FormControl>;
  }
}

export default withStyles(styles)(CountryPicker);