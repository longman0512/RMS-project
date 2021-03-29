import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { IconDownloadPdf } from '../helpers/icons';

export default function DataGrid(props){

  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(props.rows)
  }, [props]);
  //console.log(rows)
  const [selectedRows, setSelectedRows] = useState([]);
  const { SearchBar, ClearSearchButton } = Search;

  const linkFollow = (cell, row, rowIndex, formatExtraData) => {
    return (
      <div className="display-flex btn-actions">
        <Button
        className="fa fa-pencil"
        onClick={() => {
          onFollowChanged(row);
        }}
      >
      </Button>
      <Button 
      className="ml-2 fa fa-trash"
      onClick={() => {
        onFollowChanged(row);
      }}
    >
    </Button>
      </div>    
    );
  };

  const actions = [{
    dataField: "actions",
    text: "ACTIONS",
    headerAlign: 'center',
    searchable: false,
    formatter: linkFollow,
  }]
  const columns = [...props.columns,actions[0]]
  //console.log(columns);
  
  /*const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.text.primary,
            backgroundColor: "rgba(63, 81, 181, 0.08)"
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
    boxsizing: {   
      flex: '1 1 100%',
      "& .MuiInputBase-input":{
        boxSizing: "initial",
        padding: "10px 14px",
      },
    },
  }));*/
  
  const handlePurge = () => {
    setRows(
      rows.filter((r) => selectedRows.filter((sr) => sr === r.id).length < 1)
    );
  };
  
  const EnhancedTableToolbar = (props) => {
    //const classes = useToolbarStyles();
    const { numSelected } = props;
  
    return (
      <div className="display-flex toolbar"
        /*className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}*/
      >
        {numSelected > 0 && rows.length > 0 ? (
          <>
            <div className="display-flex">          
            {numSelected === rows.length ? 
              (
                <>
                  <p>Tutti i {rows.length} elementi sono stati selezionati.</p>
                  <Button variant="link" onClick={() => { setSelectedRows([])}} >Annulla selezione</Button>                 
                </>                        
              ) : (
                <>
                  <p>{numSelected} selezionati in questa pagina.</p> 
                  <Button variant="link" onClick={() => { const ids = rows.map(r => r.id); setSelectedRows(ids)}} >Seleziona tutti i {rows.length} elementi</Button>               
                </>            
              ) 
            }
            </div>
            <div>
              <Button onClick={handlePurge} >
                <IconDownloadPdf />
              </Button>            
              <Button className="fa fa-trash" onClick={handlePurge} />
            </div>         
          </>         
        ) : ( 
          <div className="custom-search-main">
            <div className="custom-search width-100">
              <button className="btn btn-default" disabled><i className="fa fa-search"></i></button>
              <SearchBar { ...props.searchProps } placeholder="Cerca" className="pad-left-0"/>
              <ClearSearchButton { ...props.searchProps } text="" className="btn-close fa fa-times-circle"/>
            </div>
          </div>      
          )
        }
      </div>
    );
  };

  const expandRow = {
    renderer: row => (
        <div>
          <p>{ `This Expand row is belong to rowKey ` }</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
          </div>    
    ),
    showExpandColumn: true,
  };

  const onFollowChanged = row => {
    console.log(row);
  };

  const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
    { from } - { to } di { size } Risultati
  </span>
);

const options = {
  paginationSize: 4,
  pageStartIndex: 0,
  // alwaysShowAllBtns: true, // Always show next and previous button
  // withFirstAndLast: false, // Hide the going to First and Last page button
  // hideSizePerPage: true, // Hide the sizePerPage dropdown always
  // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
  firstPageText: 'Prima',
  prePageText: 'Indietro',
  nextPageText: 'Avanti',
  lastPageText: 'Ultima',
  nextPageTitle: 'Prima pag.',
  prePageTitle: 'Pre page',
  firstPageTitle: 'Avanti',
  lastPageTitle: 'Ultima pag.',
  showTotal: true,
  paginationTotalRenderer: customTotal,
  disablePageTitle: true,
  sizePerPageList: [{
    text: '5', value: 5
  }, {
    text: '10', value: 10
  }, {
    text: 'All', value: props.rows.length
  }] // A numeric array is also available. the purpose of above example is custom the text
};

  const rowStyle = (row, rowIndex) => {
  const style = {};
  style.overflowy = "scroll";
    return style;
  };

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    selected: selectedRows,
    onSelect: (row, isSelect, rowIndex, e) => {
      //console.log(row.id);
      if(isSelect){
        setSelectedRows([...selectedRows, row.id]);
      }else{
        setSelectedRows(selectedRows.filter((r) => r !== row.id));
      }
      //console.log(rowIndex);
      //console.log(e);
    },
    onSelectAll: (isSelect, rows, e) => {
      const ids = rows.map(r => r.id);
      if(isSelect){
        setSelectedRows([...ids]);
      }else{
        setSelectedRows([]);
      }
    }
  };
  
  return (
    <ToolkitProvider
      bootstrap4
      keyField="id"
      data={ rows }
      columns={ columns }
      search
    >
    {
      props => (
        <div>
          <EnhancedTableToolbar numSelected={selectedRows.length} searchProps = { props.searchProps }/>
          <BootstrapTable
            bootstrap4
            selectRow={ selectRow }
            expandRow={ expandRow }
            pagination={ paginationFactory(options) }
            rowStyle={ rowStyle }
            { ...props.baseProps }
          />
        </div>
      )
    }
    </ToolkitProvider>
  )
}
