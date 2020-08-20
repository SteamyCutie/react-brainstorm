import React, { Fragment } from 'react';

import { PageTitle } from '../../layout-components';
import { Grid } from '@material-ui/core';

import { ExampleWrapperSimple } from '../../layout-components';

import ButtonsBasic from '../../page-components/Buttons/ButtonsBasic';
import ButtonsGroups from '../../page-components/Buttons/ButtonsGroups';
import ButtonsGroupsSizing from '../../page-components/Buttons/ButtonsGroupsSizing';
import ButtonsColors from '../../page-components/Buttons/ButtonsColors';
import ButtonsLinks from '../../page-components/Buttons/ButtonsLinks';
import ButtonsOutline from '../../page-components/Buttons/ButtonsOutline';
import ButtonsSizing from '../../page-components/Buttons/ButtonsSizing';
export default function Buttons() {
  return (
    <Fragment>
      <PageTitle
        titleHeading="Buttons"
        titleDescription="Wide selection of buttons that feature different styles for backgrounds, borders and hover options!"
      />

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <ExampleWrapperSimple sectionHeading="Basic">
            <ButtonsBasic />
            <div className="divider my-2" />
            <ButtonsSizing />
          </ExampleWrapperSimple>
        </Grid>
        <Grid item xs={12} lg={6}>
          <ExampleWrapperSimple sectionHeading="Button groups">
            <div className="text-center">
              <ButtonsGroups />
              <div className="divider my-2" />
              <ButtonsGroupsSizing />
            </div>
          </ExampleWrapperSimple>
        </Grid>
        <Grid item xs={12}>
          <ExampleWrapperSimple sectionHeading="Colors">
            <ButtonsColors />
          </ExampleWrapperSimple>
        </Grid>
      </Grid>

      <ExampleWrapperSimple sectionHeading="Links">
        <ButtonsLinks />
      </ExampleWrapperSimple>

      <ExampleWrapperSimple sectionHeading="Outline">
        <ButtonsOutline />
      </ExampleWrapperSimple>
    </Fragment>
  );
}
