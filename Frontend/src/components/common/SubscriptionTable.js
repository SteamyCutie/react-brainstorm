import React from "react";
import PropTypes from "prop-types";
import DataTable, { createTheme } from "react-data-table-component";

class SubscriptionTable extends React.Component {
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
    const { data, header } = this.props;
    const { noHeader, subHeader, subHeaderAlign, customStyles } = this.state;
    return (
        <div className="p-0 pb-3 data-table-div-class">
          <DataTable
            title="Subscriptions"
            columns={header}
            data={data}
            noHeader={noHeader}
            subHeader={subHeader}
            subHeaderComponent={
              (
                <div style={{ display: 'flex', alignItems: 'center' }} className="subscription-table-header">
                  <h2 className="subscription-table-title">Subscriptions</h2>
                  {/* <Button theme="primary" className="mb-2 mr-3 btn-subscription-table">
                    Find a mentor
                  </Button> */}
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

SubscriptionTable.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array
};

SubscriptionTable.defaultProps = {
  title: "DataTable",
};

export default SubscriptionTable;
