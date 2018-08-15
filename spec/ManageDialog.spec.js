import React from "react";
import { mount, render } from "enzyme";
import ManageContactDialog from "../src/ManageContactDialog";


describe("ManageContactDialog", () => {
  it("triggers an event if buttons are clicked", () => {
    const handleSave = jasmine.createSpy();
    const handleClose = jasmine.createSpy();
    const handleDelete = jasmine.createSpy();

    const dialog = <ManageContactDialog
      onClose={handleClose}
      open={true}
      onSave={handleSave}
      firstName="Test"
      lastName="Test"
      email="test@test.com"
      country="France"
      operation="edit"
      onDelete={handleDelete} />;

    const wrapper = mount(dialog);

    wrapper.find("#save-contact-button").hostNodes().simulate("click");
    expect(handleSave).toHaveBeenCalled();

    wrapper.find("#close-contact-dialog-button").hostNodes().simulate("click");
    expect(handleClose).toHaveBeenCalled();

    wrapper.find("#delete-contact-button").hostNodes().simulate("click");
    expect(handleDelete).toHaveBeenCalled();
  });
});