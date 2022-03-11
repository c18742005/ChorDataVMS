import { render } from "@testing-library/react";
import AppBar from ".";

describe('Component: AppBar', () => { 
  it("Rendered AppBar", () => {
    const { getByTestId } = render(<AppBar />);
    const appBar = getByTestId("appBar");
    expect(appBar).toBeTruthy();
  });

  it("Rendered heading", () => {
    const { getByTestId } = render(<AppBar />);
    const heading = getByTestId("appBar-heading");
    expect(heading).toBeTruthy();
  });

  it("Render appbar button when authenticated", () => {
    const { getByTestId } = render(<AppBar isAuth={true}/>);
    const button = getByTestId("appBar-button");
    expect(button).toBeTruthy();
  });

  it("Do not render appbar button when not authenticated", () => {
    const { queryByTestId } = render(<AppBar isAuth={false}/>);
    const button = queryByTestId("appBar-button");
    expect(button).toBeFalsy();
  });

  it("Render menu button when authenticated", () => {
    const { getByTestId } = render(<AppBar isAuth={true}/>);
    const menu = getByTestId("appBar-menu");
    expect(menu).toBeTruthy();
  });

  it("Do not render menu button when unauthenticated", () => {
    const { queryByTestId } = render(<AppBar isAuth={false}/>);
    const menu = queryByTestId("appBar-menu");
    expect(menu).toBeFalsy();
  });
});
