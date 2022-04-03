import { render } from "@testing-library/react";
import AppBar from ".";

describe('Component AppBar', () => {
  test('Heading should be in the document', () => {
    const component = render(<AppBar />);
    const heading = component.getByText('ChorData');

    expect(heading).toBeInTheDocument();
  })

  test('When isAuth is true, button should be in the document', () => {
    const component = render(<AppBar isAuth={true}/>);
    const button = component.getByTestId('appbar-button');

    expect(button).toBeInTheDocument();
  })

  test('When isAuth is false, button should not be in the document', () => {
    const component = render(<AppBar isAuth={false}/>);
    const button = component.queryByTestId('appbar-button');

    expect(button).not.toBeInTheDocument();
  })

  test('When isAuth is true and menuOpen is true, correct icon should be displayed on button', () => {
    const component = render(<AppBar isAuth={true} menuOpen={true}/>);
    const arrowLeft = component.queryByTestId('button-1');
    const bars = component.queryByTestId('button-2');

    expect(arrowLeft).toBeInTheDocument();
    expect(bars).not.toBeInTheDocument();
  })

  test('When isAuth is true and menuOpen is false, correct icon should be displayed on button', () => {
    const component = render(<AppBar isAuth={true} menuOpen={false}/>);
    const arrowLeft = component.queryByTestId('button-1');
    const bars = component.queryByTestId('button-2');

    expect(arrowLeft).not.toBeInTheDocument();
    expect(bars).toBeInTheDocument();
  })

  test('When isAuth is false, menu should be hidden', () => {
    const component = render(<AppBar isAuth={false} />);
    const menu = component.queryByTestId('appbar-menu');

    expect(menu).not.toBeInTheDocument();
  })

  test('When isAuth is true, menu should be shown', () => {
    const component = render(<AppBar isAuth={true} />);
    const menu = component.queryByTestId('appbar-menu');

    expect(menu).toBeInTheDocument();
  })
});