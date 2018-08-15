import React from "react";
import { mount, shallow } from "enzyme";
import App from "../src/App";

describe("App", () => {
  it("loads contacts from the storage", done => {
    const store = {
      getItem: item => new Promise(res => {
        if (item === "lastId") {
          res(1);
        } else {
          res([{
            firstName: "TestName",
            lastName: "LastName",
            email: "example@example.org",
            country: "Spain",
            id: 1
          }]);
        }
      })
    };
    spyOn(store, "getItem").and.callThrough();

    const parent = shallow(<App store={store} />);
    const wrapper = mount(parent.get(0));
    expect(store.getItem).toHaveBeenCalled();
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.state("contacts").length).toBe(1);
      expect(wrapper.state("lastId")).toBeGreaterThanOrEqual(1);
      done();
    });
  });
});
