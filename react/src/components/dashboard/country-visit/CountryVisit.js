import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

import { VectorMap } from "react-jvectormap";
import "./VectorMap.css";

const CountryVisit = () => {
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Wizard Page                                                            */
    /*--------------------------------------------------------------------------------*/

    <Card>
      <CardBody>
        <CardTitle className="text-uppercase">Country Visit</CardTitle>

        <div className="mt-4">
          <VectorMap
            map={"us_aea"}
            backgroundColor="transparent"
            //ref="map"
            //ref={(e) => { this.map = e; }}
            containerStyle={{
              width: "100%",
              height: "365px",
            }}
            regionStyle={{
              initial: {
                fill: "#2cabe3",
                "fill-opacity": 0.9,
                stroke: "1",
                "stroke-width": 1,
                "stroke-opacity": 0.5,
              },
            }}
            containerClassName="map"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default CountryVisit;
