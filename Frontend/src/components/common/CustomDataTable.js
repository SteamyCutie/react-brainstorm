import React from "react";
import PropTypes from "prop-types";
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
            minHeight: '35px',
          }
        },
        headCells: {
          style: {
            fontSize: "14px",
            fontWeight: "Bold",
            paddingLeft: "20px",
            paddingRight: "20px",
          },
        },
        cells: {
          style: {
            paddingLeft: "20px",
            paddingRight: "20px",
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

  render() {
    const { title, data, header } = this.props;
    const { noHeader, subHeader, subHeaderAlign, customStyles } = this.state;
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
                </div>
              )
            }
            subHeaderAlign={subHeaderAlign}
            customStyles={customStyles}
            className="data-table-class"
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
