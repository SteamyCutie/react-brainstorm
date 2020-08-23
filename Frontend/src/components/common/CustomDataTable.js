import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";
import DataTable, { createTheme } from "react-data-table-component";
import CustomSearchInput from "./CustomSearchInput";

class CustomDataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      noHeader: true,
      subHeader: true,
      subHeaderAlign: "right",
      fixedHeader: true,
      customStyles: {
        headRow: {
          style: {
            minHeight: '35px', // override the row height
          }
        },
        headCells: {
          style: {
            fontSize: "14px",
            fontWeight: "Bold",
          },
        },
      }
    }
  }

  componentWillMount() {
    createTheme('solarized', {
      text: {
        primary: '#268bd2',
        secondary: '#2aa198',
      },
      background: {
        default: '#002b36',
      },
      context: {
        background: '#cb4b16',
        text: '#FFFFFF',
      },
      divider: {
        default: '#073642',
      },
      action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
      },
    });
  }

  componentDidMount() {
  }

  render() {
    const { title, data, header } = this.props;
    const { noHeader, subHeader, subHeaderAlign, fixedHeader, customStyles } = this.state;
    return (
        <div className="p-0 pb-3 data-table-div-class">
          <DataTable
            title={title}
            columns={header}
            data={data}
            noHeader={noHeader}
            subHeader={subHeader}
            subHeaderComponent={
              (
                <div style={{ display: 'flex', alignItems: 'center' }} className="data-table-header-class">
                  <h2>{title}</h2>
                  <CustomSearchInput />
                  {/* <Input id="outlined-basic" label="Search" variant="outlined" size="small" style={{ margin: '5px' }} /> */}
                </div>
              )
            }
            subHeaderAlign={subHeaderAlign}
            // fixedHeader={fixedHeader}
            // fixedHeaderScrollHeight="300px"
            customStyles={customStyles}
            // theme="solarized"
          />
        </div>
    );
  }
}

CustomDataTable.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array
};

CustomDataTable.defaultProps = {
  title: "DataTable",
};

export default CustomDataTable;
