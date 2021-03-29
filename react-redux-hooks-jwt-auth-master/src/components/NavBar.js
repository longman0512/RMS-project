import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'; 
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import IconCompany from '../helpers/icons';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    "& .MuiIconButton-edgeEnd":{
      marginRight: "0"
    },
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    color: "white",
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: "white",
    "& .MuiAutocomplete-inputRoot":{
      color: "white",
      paddingLeft: "60px",
    },
    "& .MuiAutocomplete-inputRoot .MuiAutocomplete-input:first-child":{
      color: "white",
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none"
    },
  },
  iconCompany: {
    "& .MuiSvgIcon-root":{
      width: "1.5em",
      height: "1.5em"
    },
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [myOptions, setMyOptions] = useState([])

  const isMenuOpen = Boolean(anchorEl);
  const isMenu2Open = Boolean(anchorEl2);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleCreateMenuOpen = (event) => {
    setAnchorEl2(event.currentTarget.parentNode);
  };

  const handleCreateMenuClose = () => {
    setAnchorEl2(null);
    handleMobileMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const createId = 'primary-search-create-menu';
  const renderMenu = (
    <Menu
    anchorEl={anchorEl}
    getContentAnchorEl={null}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    transformOrigin={{ vertical: "top", horizontal: "center" }}
    id={menuId}
    keepMounted
    open={isMenuOpen}
    onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profilo</MenuItem>
      <MenuItem onClick={handleMenuClose}>Esci</MenuItem>
    </Menu>
  );
  const renderMenu2 = (
    <Menu
      anchorEl={anchorEl2}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      id={createId}
      keepMounted
      open={isMenu2Open}
      onClose={handleCreateMenuClose}
    >
      <MenuItem onClick={handleCreateMenuClose}>Ric. Intervento</MenuItem>
      <MenuItem onClick={handleCreateMenuClose}>Fattura</MenuItem>
      <MenuItem onClick={handleCreateMenuClose}>Preventivo</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleCreateMenuOpen}>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <AddIcon />
          </Badge>
        </IconButton>
        <p>Crea</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          className={classes.iconCompany}
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const getDataFromAPI = () => { 
    console.log("Options Fetched from API") 
  
    fetch('http://dummy.restapiexample.com/api/v1/employees').then((response) => { 
      return response.json() 
    }).then((res) => { 
      for (var i = 0; i < res.data.length; i++) { 
        myOptions.push(res.data[i]) 
      } 
      setMyOptions(myOptions) 
    }) 
  } 

  const filterOptions = createFilterOptions({
    // matchFrom: 'start',
    stringify: (option) => option.employee_name + 'bella',
  });

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Wesy
          </Typography>
          <Autocomplete
                style={{ width: 300 }}
                freeSolo
                className={classes.inputRoot}
                autoComplete
                autoHighlight
                options={myOptions}
                filterOptions={filterOptions}
                getOptionLabel={option => option.employee_name}
                renderOption={option => {
                  return (
                    <div>
                      <i className="fa fa-bell" aria-hidden="true"></i>
                      {option.employee_name + ' bella'}
                    </div>
                  );
                }}
                renderInput={(params) => ( 
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                  </div>
                  <TextField 
                    variant="outlined"
                    onChange={getDataFromAPI} 
                    placeholder="Cerca collaboratore"
                    {...params} 
                  /> 
                  </div>
                )} 
              /> 
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 4 new mails" color="inherit" onClick={handleCreateMenuOpen}>
              <AddIcon />
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              className={classes.iconCompany}
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderMenu2}
    </div>
  );
}
