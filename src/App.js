import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { Input, InputAdornment, Button, Icon, AppBar,
  Toolbar, Typography, IconButton, FormControl } from "@material-ui/core";
import ManageContactDialog from "./ManageContactDialog";
import ContactList from "./ContactList";

const styles = theme => ({
  root: {
    width: "100%",
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 2
  },
  flex: {
    flexGrow: 1
  },
  white: {
    color: theme.palette.primary.contrastText,
    "&:before,&:after": {
      borderBottomColor: theme.palette.primary.contrastText
    }
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // wether the search text field is visible
      searching: false,
      searchText: "",
      dialogOpen: false,
      contacts: [],
      lastId: 1,
      // create or edit
      dialogAction: "create",
      // data for the contact on the dialog
      contactFirstName: "",
      contactLastName: "",
      contactEmail: "",
      contactCountry: "",
    };

    // sequentially generate a unique id for each contact (not visible for the user)
    this.props.store.getItem("lastId").then(id => {
      if (id) {
        this.setState({lastId: id});
      } else {
        this.props.store.setItem("lastId", 1);
        this.setState({lastId: 1});
      }
    });

    // load contacts from local storage
    this.props.store.getItem("contacts").then(contacts => {
      if (contacts) {
        this.setState({contacts});
      }
    });
  }

  handleSearchBlur(event) {
    // hide search text field on blur if it's empty
    if (!event.target.value) {
      this.setState({searching: false});
    }
  }

  handleSearchChange(event) {
    this.setState({searchText: event.target.value});
  }

  /**
   * Hides or shows the manage contact dialog
   * @param action create or edit
   * @param contact if editing, contact to edit. Ignored otherwise
   */
  toggleDialog(action, contact) {
    action = action || this.state.action;
    let contactInfo = {
      contactFirstName: "",
      contactLastName: "",
      contactEmail: "",
      contactCountry: ""
    };
    if (contact && !this.state.dialogOpen) {
      // set the correct contact data when opening an edit dialog
      contactInfo = {
        contactFirstName: contact.firstName,
        contactLastName: contact.lastName,
        contactEmail: contact.email,
        contactCountry: contact.country
      }
    }
    this.setState({
      dialogOpen: !this.state.dialogOpen,
      dialogAction: action,
      editingContact: contact,
      ...contactInfo
    });
  }

  /**
   * Updates the data of the contact currently being managed
   * @param field firstName, lastName, email or country
   */
  handleContactDataChange(field) {
    return value => {
      this.setState({["contact" + field[0].toUpperCase() + field.substr(1)]: value});
    }
  }

  /**
   * Adds a new contact or edits an existing one with the data of the
   * current state. This method assumes that the data is valid.
   */
  handleContactSave() {
    const contacts = this.state.contacts.slice(0);
    if (this.state.dialogAction === "create") {
      // create new contact
      const newContact = {
        firstName: this.state.contactFirstName.trim(),
        lastName: this.state.contactLastName.trim(),
        email: this.state.contactEmail.trim(),
        country: this.state.contactCountry.trim(),
        id: this.state.lastId + 1
      }
      this.props.store.setItem("lastId", newContact.id);
      // insert new contact sorted into the contacts array
      let i = 0;
      for (i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        let cmp = contact.firstName.localeCompare(newContact.firstName);
        cmp = cmp || contact.lastName.localeCompare(newContact.lastName);
        if (cmp > 0) {
          contacts.splice(i, 0, newContact);
          break;
        }
      }
      if (i == contacts.length) {
        contacts.push(newContact);
      }
      this.setState({contacts, lastId: newContact.id});
    } else {
      // edit existing contact
      for(let contact of contacts) {
        if (contact === this.state.editingContact) {
          contact.firstName = this.state.contactFirstName.trim();
          contact.lastName = this.state.contactLastName.trim();
          contact.email = this.state.contactEmail.trim();
          contact.country = this.state.contactCountry.trim();
          break;
        }
      }
      this.setState({contacts});
    }
    this.props.store.setItem("contacts", contacts);
    this.toggleDialog();
  }

  handleContactDelete() {
    const contacts = this.state.contacts.slice(0);
    for (let i = 0; i < contacts.length; i++) {
      if (this.state.editingContact === contacts[i]) {
        contacts.splice(i, 1);
        break;
      }
    }
    this.setState({contacts});
    this.props.store.setItem("contacts", contacts);
    this.toggleDialog();
  }

  render() {
    return <div className={this.props.classes.root}>
      <ManageContactDialog
        onClose={() => this.toggleDialog()}
        open={this.state.dialogOpen}
        onSave={() => this.handleContactSave()}
        firstName={this.state.contactFirstName}
        lastName={this.state.contactLastName}
        email={this.state.contactEmail}
        country={this.state.contactCountry}
        onDataChange={event => this.handleContactDataChange(event)}
        operation={this.state.dialogAction}
        onDelete={() => this.handleContactDelete()} />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="title" color="inherit" className={this.props.classes.flex}>Contacts</Typography>
          {this.state.searching ?
            (<FormControl>
              <Input
                id="search"
                placeholder="Search..."
                startAdornment={
                  <InputAdornment>
                    <Icon>search</Icon>
                  </InputAdornment>
                }
                className={this.props.classes.white}
                onBlur={event => this.handleSearchBlur(event)}
                onChange={event => this.handleSearchChange(event)}
                value={this.state.searchText}
                autoFocus
              />
            </FormControl>) :
            (<IconButton color="inherit" aria-label="search" onClick={() => this.setState({searching: true})}>
            <Icon>search</Icon>
          </IconButton>)}
        </Toolbar>
      </AppBar>
      <div style={{
        paddingTop: "64px", // to avoid the first contact being shown under the AppBar
        paddingBottom: "80px" // to avoid the fab covering the country of the last contact
      }}>
        <ContactList
          contacts={this.state.contacts}
          searchText={this.state.searchText}
          onEdit={contact => this.toggleDialog("edit", contact)} />
      </div>
      <Button
        variant="fab"
        color="secondary"
        aria-label="Add contact"
        className={this.props.classes.fab}
        onClick={() => this.toggleDialog("create")}>
        <Icon>person_add</Icon>
      </Button>
    </div>;
  }
}
export default withStyles(styles)(App);