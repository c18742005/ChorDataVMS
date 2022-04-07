import { render } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppBar from ".";

describe('Component AppBar', () => {
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

  test('Heading should be in the document', () => {
    const history = createMemoryHistory({ initialEntries: ['/info'] })
    const component = render( 
      <Router location={history.location} navigator={history} >
        <AppBar />
      </Router>);
    const heading = component.getByText('ChorData');

    expect(heading).toBeInTheDocument();
  })

  test('When isAuth is true, button should be in the document', () => {
    const history = createMemoryHistory({ initialEntries: ['/info'] })
    const component = render( 
      <Router location={history.location} navigator={history} >
        <AppBar isAuth={true} />
      </Router>);
    const button = component.getByTestId('appbar-button');

    expect(button).toBeInTheDocument();
  })

  test('When isAuth is false, button should not be in the document', () => {
    const history = createMemoryHistory({ initialEntries: ['/info'] })
    const component = render( 
      <Router location={history.location} navigator={history} >
        <AppBar isAuth={false} />
      </Router>);
    const button = component.queryByTestId('appbar-button');

    expect(button).not.toBeInTheDocument();
  })

  test('When isAuth is true and menuOpen is true, correct icon should be displayed on button', () => {
    const history = createMemoryHistory({ initialEntries: ['/info'] })
    const component = render( 
      <Router location={history.location} navigator={history} >
        <AppBar isAuth={true} menuOpen={true}/>
      </Router>);
    const arrowLeft = component.queryByTestId('button-1');
    const bars = component.queryByTestId('button-2');

    expect(arrowLeft).toBeInTheDocument();
    expect(bars).not.toBeInTheDocument();
  })

  test('When isAuth is true and menuOpen is false, correct icon should be displayed on button', () => {
    const history = createMemoryHistory({ initialEntries: ['/info'] })
    const component = render( 
      <Router location={history.location} navigator={history} >
        <AppBar isAuth={true} menuOpen={false}/>
      </Router>);
    const arrowLeft = component.queryByTestId('button-1');
    const bars = component.queryByTestId('button-2');

    expect(arrowLeft).not.toBeInTheDocument();
    expect(bars).toBeInTheDocument();
  })

  test('When isAuth is false, menu should be hidden', () => {
    const history = createMemoryHistory({ initialEntries: ['/info'] })
    const component = render( 
      <Router location={history.location} navigator={history} >
        <AppBar isAuth={false}/>
      </Router>);
    const menu = component.queryByTestId('appbar-menu');

    expect(menu).not.toBeInTheDocument();
  })

  test('When isAuth is true, menu should be shown', () => {
    const history = createMemoryHistory({ initialEntries: ['/info'] })
    const component = render( 
      <Router location={history.location} navigator={history} >
        <AppBar isAuth={true}/>
      </Router>);
    const menu = component.queryByTestId('appbar-menu');

    expect(menu).toBeInTheDocument();
  })
});