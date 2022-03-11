import { render, unmountComponentAtNode } from "react-dom";
import { wait } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Router } from 'react-router-dom';
import mockedAxios from 'axios';
import { createMemoryHistory } from 'history';
import SideBar from ".";

jest.mock('axios');

describe('Component: SideBar', () => { 

  let container = null;
  beforeEach(() => {
    jest.clearAllMocks()
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("SideBar Renders", () => {
    const history = createMemoryHistory({ initialEntries: ['/', '/clients', '/drugs', '/xrays', '/cremations', '/anaesthetic'] });

    act(() => {
      render( 
        <Router location={history.location} navigator={history} >
          <SideBar />
        </Router>, container
      );
    });
    expect(container.SideBar).not.toBeNull();
  });
});
