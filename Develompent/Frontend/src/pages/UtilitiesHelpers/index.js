import React, { Fragment } from 'react';

import { PageTitle } from '../../layout-components';

import { ExampleWrapperSimple } from '../../layout-components';

import UtilitiesHelpersPrimaryColors from '../../page-components/UtilitiesHelpers/UtilitiesHelpersPrimaryColors';
import UtilitiesHelpersNeutralColors from '../../page-components/UtilitiesHelpers/UtilitiesHelpersNeutralColors';
import UtilitiesHelpersBrandColors from '../../page-components/UtilitiesHelpers/UtilitiesHelpersBrandColors';
export default function UtilitiesHelpers() {
  return (
    <Fragment>
      <PageTitle
        titleHeading="Utilities &amp; Helpers"
        titleDescription="These are helpers that speed up the dev time for various components and effects."
      />

      <ExampleWrapperSimple sectionHeading="Brand colors">
        <UtilitiesHelpersBrandColors />
      </ExampleWrapperSimple>

      <ExampleWrapperSimple sectionHeading="Neutral colors">
        <UtilitiesHelpersNeutralColors />
      </ExampleWrapperSimple>
      <ExampleWrapperSimple sectionHeading="Primary colors">
        <UtilitiesHelpersPrimaryColors />
      </ExampleWrapperSimple>
    </Fragment>
  );
}
