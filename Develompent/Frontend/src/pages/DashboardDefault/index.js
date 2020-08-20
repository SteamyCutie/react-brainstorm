import React, { Fragment } from 'react';

import { PageTitle } from '../../layout-components';

import DashboardDefaultSection1 from '../../page-components/DashboardDefault/DashboardDefaultSection1';
import DashboardDefaultSection2 from '../../page-components/DashboardDefault/DashboardDefaultSection2';
import DashboardDefaultSection3 from '../../page-components/DashboardDefault/DashboardDefaultSection3';
import DashboardDefaultSection4 from '../../page-components/DashboardDefault/DashboardDefaultSection4';
export default function DashboardDefault() {
  return (
    <Fragment>
      <PageTitle
        titleHeading="Default"
        titleDescription="This is a dashboard page example built using this template."
      />

      <DashboardDefaultSection1 />
      <DashboardDefaultSection2 />
      <DashboardDefaultSection3 />
      <DashboardDefaultSection4 />
    </Fragment>
  );
}
