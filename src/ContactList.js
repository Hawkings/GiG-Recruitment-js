import React from "react";
import { List, ListItem, ListSubheader, Card, CardContent, Typography, withStyles } from "@material-ui/core";
import Fuse from "fuse.js";

const styles = theme => ({
  card: {
    display: "flex",
    width: "100%",
    flexWrap: "wrap",
    "&:last-child": {
      paddingBottom: `${theme.spacing.unit * 2}px`
    }
  },
  noOverflow: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  email: {
    flexGrow: 2,
    paddingRight: "5px"
  },
  name: {
    fontWeight: "bold",
    paddingRight: "5px",
    [theme.breakpoints.down("sm")]: {
      flexGrow: 1
    },
    [theme.breakpoints.up("md")]: {
      flexBasis: "30%"
    }
  },
  fullWidth: {
    width: "100%"
  },
  listItem: {
    paddingTop: 0,
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0
    }
  }
});

class ContactList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: null
    };
  }

  handleChange(contactId) {
    return (event, expanded) => {
      this.setState({
        expanded: expanded ? contactId : null
      })
    };
  }

  render() {
    let filteredContacts = this.props.contacts;
    if (this.props.searchText) {
      const fuse = new Fuse(this.props.contacts, {
        keys: [
          {name: "firstName", weight: 0.3},
          {name: "lastName", weight: 0.3},
          {name: "email", weight: 0.3},
          {name: "country", weight: 0.1}
        ]
      });
      filteredContacts = fuse.search(this.props.searchText);
    }
    let initials = {};
    filteredContacts.forEach(contact => {
      const initial = contact.firstName[0].toLocaleUpperCase();
      if (initial in initials) {
        initials[initial].push(contact);
      } else {
        initials[initial] = [contact];
      }
    });
    const list = [];
    Object.keys(initials).forEach(
      initial => {
        const contacts = initials[initial];
        list.push(<li key={initial}>
          <ul style={{padding: 0}}>
            <ListSubheader>{initial}</ListSubheader>
            {contacts.map(contact => (
              <ListItem key={contact.id} className={this.props.classes.listItem}>
                <Card className={this.props.classes.fullWidth} onClick={() => this.props.onEdit(contact)}>
                  <CardContent className={this.props.classes.card}>
                    <Typography className={this.props.classes.name + " " + this.props.classes.noOverflow}>
                      {`${contact.firstName} ${contact.lastName}`}
                    </Typography>
                    <Typography className={this.props.classes.email + " " + this.props.classes.noOverflow}>
                      {contact.email}
                    </Typography>
                    <Typography color="textSecondary" className={this.props.classes.noOverflow}>
                      {contact.country}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </ul>
        </li>);
      }
    );
    return <List>
      {list}
    </List>;
  }
};

export default withStyles(styles)(ContactList);