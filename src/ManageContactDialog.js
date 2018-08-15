import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { DialogContent, TextField, DialogActions, Chip, MenuItem,
  Typography, InputLabel, FormHelperText, Input, withMobileDialog,
  IconButton, Toolbar, Icon, Button, DialogTitle, Dialog, FormControl } from '@material-ui/core';
import countryList from "country-list";
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import CountryPicker from './CountryPicker';
import isemail from "isemail";

const styles = theme => ({
  firstName: {
    [theme.breakpoints.up("sm")]: {
      width: "calc(50% - 5px)",
      marginRight: "5px"
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  lastName: {
    [theme.breakpoints.up("sm")]: {
      width: "calc(50% - 5px)",
      marginLeft: "5px"
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  }
});

class ManageContactDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validEmail: true
    };
  }

  handleChange(field) {
    return event => {
      // only update email validity status while typing if it goes from invalid
      // to valid. This avoids errors being shown while the user types an email
      if(field === "email" && !this.state.validEmail && isemail.validate(event.target.value)) {
        this.setState({
          validEmail: true
        });
      }
      this.props.onDataChange(field)(event.target.value);
    }
  }

  handleClose() {
    this.props.onClose();
  }

  handleEmailBlur(event) {
    this.setState({validEmail: isemail.validate(event.target.value)})
  }

  allValid() {
    return this.props.firstName.length > 0
      && this.props.lastName.length > 0
      && isemail.validate(this.props.email)
      && this.props.country.length > 0;
  }

  render() {
    return <Dialog
      aria-labelledby="add-contact-title"
      onClose={() => this.handleClose()}
      open={this.props.open}
      fullScreen={this.props.fullScreen}
    >
      <DialogContent>
        <Toolbar style={{padding: 0}}>
          <Typography id="add-contact-title" variant="title" style={{flex: 1}}>{
            this.props.operation === "create" ?
            "Add new contact" :
            "Edit contact"
          }</Typography>
          <IconButton
            aria-label="Close"
            onClick={this.props.onClose}
            id="close-contact-dialog-button"
          ><Icon>close</Icon></IconButton>
        </Toolbar>
        <TextField
          autoFocus
          margin="dense"
          id="first-name"
          label="First name"
          maxLength="35"
          onChange={this.handleChange("firstName")}
          value={this.props.firstName}
          className={this.props.classes.firstName}
        />
        <TextField
          margin="dense"
          id="last-name"
          label="Last name"
          maxLength="35"
          onChange={this.handleChange("lastName")}
          value={this.props.lastName}
          className={this.props.classes.lastName}
        />
        <br />
        <FormControl
          error={!this.state.validEmail}
          aria-describedby="email-helper"
          margin="dense"
          fullWidth
        >
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            onChange={this.handleChange("email")}
            onBlur={event => this.handleEmailBlur(event)}
            value={this.props.email} />
          <FormHelperText
            id="email-helper"
            hidden={this.state.validEmail}
          >The email address is not valid</FormHelperText>
        </FormControl>
        <br />
        <CountryPicker onCountrySelected={this.handleChange("country")} value={this.props.country} />
        <DialogActions>
          {this.props.operation === "edit" ?
          <Button
            id="delete-contact-button"
            variant="contained"
            color="secondary"
            onClick={this.props.onDelete}
          >Delete</Button> :
          null}
          <Button
            id="save-contact-button"
            variant="contained"
            color="primary"
            disabled={!this.allValid()}
            onClick={this.props.onSave}>
            Save
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>;
  }
}

export default withMobileDialog()(withStyles(styles)(ManageContactDialog));