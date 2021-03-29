import { Nav } from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';

const NavRoute = ({ additionalNavigations = [] }) => {
  let home = [];
  let newNavigation = [];
  if(additionalNavigations.length > 1){
    home = [
      { name: 'Home', route: '/home', from: additionalNavigations[0].from },
    ]; 
    newNavigation = [home[0],...additionalNavigations];
  }
  else{
    home = [
      { name: 'Home', route: '/home', from: additionalNavigations.from },
    ]; 
    newNavigation = [home[0],additionalNavigations];
  }
  //console.log(newNavigation);
  const nl = newNavigation.length-1;

  return (
      <Nav className='history-path'>
        <div>Tu sei qui:</div>
        {newNavigation.map(({ name, route, from = {} },index) => ( 
          <div key={name} className="display-flex">
            <LinkContainer disabled={index === nl? true:false}
              to={{
                  pathname: route,
                  from: from
                }}>
              <Nav.Link>{name}</Nav.Link>
            </LinkContainer>  
            <span>{index === nl? '':'\\'}</span>   
          </div>                 
        ))}
      </Nav>    
  );
};

export default NavRoute;