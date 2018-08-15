import React from "react";
import { mount } from "enzyme";
import ContactList from "../src/ContactList";
import { ListItem, ListSubheader, Typography } from "@material-ui/core";


describe("ContactList", () => {
  it("renders zero contacts", () => {
    const wrapper = mount(<ContactList contacts={[]} />);
    expect(wrapper.find(ListItem).length).toBe(0);
  });
  
  it("renders a single contact", () => {
    const contact = {
      firstName: "TestName",
      lastName: "LastName",
      email: "example@example.org",
      country: "Spain",
      id: 1
    };
    const wrapper = mount(<ContactList contacts={[contact]} />);

    expect(wrapper.find(ListItem).length).toBe(1);
    expect(wrapper.find(ListSubheader).text()).toBe("T");

    const texts = wrapper.find(Typography);
    expect(texts.at(0).text()).toBe("TestName LastName");
    expect(texts.at(1).text()).toBe("example@example.org");
    expect(texts.at(2).text()).toBe("Spain");
  });

  it("renders many contacts", () => {
    const contacts = [{
      firstName: "TestName",
      lastName: "LastName",
      email: "example@example.org",
      country: "Spain",
      id: 1
    }, {
      firstName: "Test2",
      lastName: "LastName",
      email: "example2@example.org",
      country: "Spain",
      id: 2
    }, {
      firstName: "Zulu",
      lastName: "Philips",
      email: "ph@example.org",
      country: "Spain",
      id: 3
    }];
    const wrapper = mount(<ContactList contacts={contacts} />);

    // all 3 contacts are displayed but only 2 initials (T and Z)
    expect(wrapper.find(ListItem).length).toBe(3);
    expect(wrapper.find(ListSubheader).length).toBe(2);
  });

  it("filters elements correctly", () => {
    const contacts = [{
      firstName: "Juan Pedro",
      lastName: "López García",
      email: "jplg@business.org",
      country: "Spain",
      id: 1
    }, {
      firstName: "William",
      lastName: "Shakespeare",
      email: "will@iam.me",
      country: "United Kingdom",
      id: 2
    }];
    const wrapper = mount(<ContactList contacts={contacts} searchText="juan pedro lopez" />);
    expect(wrapper.find(ListItem).length).toBe(1);
  });
});