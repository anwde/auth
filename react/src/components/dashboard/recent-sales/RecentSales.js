import React from "react";

import { Card, CardTitle, Table } from "reactstrap";

const RecentSales = () => {
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <div className="d-flex align-items-center p-3">
        <CardTitle className="mb-0 text-uppercase">Recent Sales</CardTitle>
        <div className="ml-auto">
          <select className="form-control">
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
          </select>
        </div>
      </div>
      <div className="p-3 bg-light">
        <div className="d-flex align-items-center">
          <div>
            <h2 className="font-weight-normal">March 2017</h2>
            <p className="mb-2 text-uppercase font-14 font-weight-light">
              Sales Report
            </p>
          </div>
          <div className="ml-auto">
            <h1 className="text-info mb-0 font-light">$3,690</h1>
          </div>
        </div>
      </div>
      <div className="p-3">
        <Table responsive className="mb-0 font-weight-light no-wrap">
          <thead>
            <tr>
              <th className="font-medium">#</th>
              <th className="text-uppercase font-medium">Name</th>
              <th className="text-uppercase font-medium">STATUS</th>
              <th className="text-uppercase font-medium">DATE</th>
              <th className="text-uppercase font-medium">PRICE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="font-weight-light">
                1
              </th>
              <td>Elite admin</td>
              <td>
                <span className="badge badge-pill text-uppercase text-white font-medium badge-success label-rouded">
                  SALE
                </span>
              </td>
              <td>April 18, 2017 </td>
              <td className="text-success">$24</td>
            </tr>
            <tr>
              <th scope="row" className="font-weight-light">
                2
              </th>
              <td>Real Homes WP Theme</td>
              <td>
                <span className="badge badge-pill text-uppercase text-white font-medium badge-info label-rouded">
                  EXTENDED
                </span>
              </td>
              <td>April 19, 2017</td>
              <td className="text-info">$1250</td>
            </tr>
            <tr>
              <th scope="row" className="font-weight-light">
                3
              </th>
              <td>Ample Admin</td>
              <td>
                <span className="badge badge-pill text-uppercase text-white font-medium badge-info label-rouded">
                  EXTENDED
                </span>
              </td>
              <td>April 19, 2017</td>
              <td className="text-info">$1250</td>
            </tr>
            <tr>
              <th scope="row" className="font-weight-light">
                4
              </th>
              <td>Medical Pro WP Theme</td>
              <td>
                <span className="badge badge-pill text-uppercase text-white font-medium badge-danger label-rouded">
                  TAX
                </span>
              </td>
              <td>April 20, 2017</td>
              <td className="text-danger">-$24</td>
            </tr>
            <tr>
              <th scope="row" className="font-weight-light">
                5
              </th>
              <td>Hosting press html</td>
              <td>
                <span className="badge badge-pill text-uppercase text-white font-medium badge-warning label-rouded">
                  SALE
                </span>
              </td>
              <td>April 20, 2017</td>
              <td className="text-success">$24</td>
            </tr>
            <tr>
              <th scope="row" className="font-weight-light">
                6
              </th>
              <td>Digital Agency PSD</td>
              <td>
                <span className="badge badge-pill text-uppercase text-white font-medium badge-success label-rouded">
                  SALE
                </span>
              </td>
              <td>April 20, 2017</td>
              <td className="text-danger">-$14</td>
            </tr>
            <tr>
              <th scope="row" className="font-weight-light">
                7
              </th>
              <td>Helping Hands WP Theme</td>
              <td>
                <span className="badge badge-pill text-uppercase text-white font-medium badge-warning label-rouded">
                  MEMBER
                </span>
              </td>
              <td>April 20, 2017</td>
              <td className="text-success">$64</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default RecentSales;
