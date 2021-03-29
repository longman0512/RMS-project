import React, { useState, useEffect } from 'react'
import { Row, Col } from 'reactstrap'
import DataGrid from './DataGrid';
import { CSVLink } from "react-csv"
import UserService from "../services/user.service";
import { useLocation, Redirect} from "react-router-dom";
import NavRoute from "./NavRoute";
import { useDispatch, useSelector } from "react-redux";
//import { DataGrid, GridRowsProp, GridColDef } from '@material-ui/data-grid';

function LabourDesc(props) {

  const [items, setItems] = useState([])
  const location = useLocation();
  const state = location.state;
  const dispatch = useDispatch();
  /*const addItemToState = (item) => {
    setItems([...items, item])
  }*/
  const { user: currentUser } = useSelector((state) => state.auth);

  const updateState = (item) => {
    const itemIndex = items.findIndex(data => data.id === item.id)
    const newArray = [...items.slice(0, itemIndex), item, ...items.slice(itemIndex + 1)]
    setItems(newArray)
  }

  const deleteItemFromState = (id) => {
    const updatedItems = items.filter(item => item.labourdesc_id !== id)
    setItems(updatedItems)
  }

  useEffect(() => {
    if (currentUser) {
      UserService.getLabourDesc().then(
        (response) => {
          setItems(response.data.message);
        },
        (error) => {
          console.log(error);
          const _content =
            (error.response.status && 
              error.response.data.status && 
              error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
            console.log(_content);
        }
      );
    }else{
      return <Redirect to="/login" />;
    }    
  }, [dispatch,currentUser]);

  let rows = items.map(item => {
    return (
      { id:item.labourdesc_id, 
        int_id:item.internal_code,
        sup_code:item.supplier_code,
        sup_desc:item.supplier_desc,
        desc:item.description,
        um:item.um,
        qty:item.qty,
        price:item.price,
        disc_id:item.discount_id,
        discount:item.discount,
        tag:item.tag,
      }
    )
  })

  const columns = [{
    dataField: 'id',
    text: 'ID-hid',
    hidden: true,
    headerAlign: 'center',
    searchable: false,
  }, {
    dataField: 'int_id',
    text: 'ID',
    headerAlign: 'center',
    sort: true,
  }, {
    dataField: 'sup_code',
    text: 'SUPPLIER CODE',
    headerAlign: 'center',
    sort: true,
  }, {
    dataField: 'sup_desc',
    text: 'SUPPLIER DESC.',
    headerAlign: 'center',
    sort: true,
  }, {
    dataField: 'desc',
    text: 'DESCRIPTION',
    headerAlign: 'center',
    sort: true,
  }, {
    dataField: 'um',
    text: 'UM',
    headerAlign: 'center',
    sort: true,
  }, {
    dataField: 'qty',
    text: 'QTY',
    headerAlign: 'center',
    sort: true,
  }, {
    dataField: 'price',
    text: 'PRICE',
    headerAlign: 'center',
    sort: true,
  }, {
    dataField: 'disc_type',
    text: 'DISCOUNT_ID',
    headerAlign: 'center',
    sort: true,
  }, {
    dataField: 'discount',
    text: 'DISCOUNT',
    headerAlign: 'center',
    sort: true,
  }, {
    dataField: 'tag',
    text: 'TAG',
    headerAlign: 'center',
    sort: true,
  }];

  return (
    <div className="container">
      <NavRoute additionalNavigations={state} />
      <div className="allTable">
        <Row>
          <Col>
            <h4 className="title-style">Descrizione lavori</h4>
          </Col>
          <Col>
            <CSVLink
              filename={"labourDesc.csv"}
              color="primary"
              style={{float: "right"}}
              className="btn btn-primary title-style"
              data={items}>
              Download CSV
            </CSVLink>   
          </Col>
        </Row>
        <Row>
          <Col>
          <DataGrid rows = {rows} columns = {columns} />
          </Col>
        </Row>
      </div>       
    </div>
  )
}

export default LabourDesc