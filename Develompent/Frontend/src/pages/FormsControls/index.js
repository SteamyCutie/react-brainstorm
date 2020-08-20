import React, { Fragment } from 'react';

import { PageTitle } from '../../layout-components';

import { ExampleWrapperSeamless } from '../../layout-components';

import FormsControlsBasic from '../../page-components/FormsControls/FormsControlsBasic';
import FormsControlsInputGroups from '../../page-components/FormsControls/FormsControlsInputGroups';
export default function FormsControls() {
  return (
    <Fragment>
      <PageTitle
        titleHeading="Controls"
        titleDescription="Wide selection of forms controls, using a standardised code base, specifically for React."
      />
      <ExampleWrapperSeamless sectionHeading="Basic">
        <FormsControlsBasic />
      </ExampleWrapperSeamless>
      <ExampleWrapperSeamless sectionHeading="Input groups">
        <FormsControlsInputGroups />
      </ExampleWrapperSeamless>
    </Fragment>
  );
}
