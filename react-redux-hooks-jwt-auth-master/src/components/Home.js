import React, { useContext } from "react";
import { Accordion, Card, Nav } from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import { Redirect, useLocation } from 'react-router-dom';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { useSelector } from "react-redux";
import { activities, registries, tables, card_name } from "../helpers/const";

function ContextAwareToggle({ children, eventKey, callback }) {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <button
      type="button"
      style={{ backgroundColor: isCurrentEventKey ? 'pink' : 'lavender' }}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

const Home = () => {

  const location = useLocation();
  //console.log(location);
  const { user: currentUser } = useSelector((state) => state.auth);
  const objects = [activities,registries,tables];

  const link = objects.map((obj,index) =>
    obj.map(({ name, route },i) => {
    return (
        <LinkContainer key={i}
        to={{
            pathname: route,
            state: {
                    name: name,
                    route: route,
                    from: index
            }
        }}>
        <Nav.Link >{name}</Nav.Link>
      </LinkContainer>       
    )
   })
  );
    
  const cards = card_name.map(({ key, name }) => {
      return (
        <Card key={key}>
        <Card.Header>
          <ContextAwareToggle eventKey={key}>{name}</ContextAwareToggle>
        </Card.Header>
        <Accordion.Collapse eventKey={key}>
        <Nav className="flex-column home-nav">
          {link[key-1]}
          </Nav>
        </Accordion.Collapse>
      </Card>      
      )
    });

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (

    <div className="container">
      <Accordion defaultActiveKey={location?.from? location.from+1:1}>
      {cards}
    </Accordion>
</div>
  );
};

export default Home;
