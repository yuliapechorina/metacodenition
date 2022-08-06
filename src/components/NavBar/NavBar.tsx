import { Navbar } from '@mantine/core';
import MainLinks from '../MainLinks';

const NavBar = () => (
  <Navbar className='p-1 w-fit'>
    <Navbar.Section>
      <MainLinks />
    </Navbar.Section>
  </Navbar>
);

export default NavBar;
