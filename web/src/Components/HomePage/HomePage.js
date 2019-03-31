/**
 * @file HomePage
 * @copyright Copyright (c) 2018-2019 Dylan Miller and dfinityexplorer contributors
 * @license MIT License
 */

import React from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Grid
} from '@material-ui/core';
import { duration, easing } from '@material-ui/core/styles/transitions';
import Fade from 'react-reveal/Fade';
import BlocksTable from '../BlocksTable/BlocksTable';
import TransactionsTable from '../TransactionsTable/TransactionsTable';
import DashCard from '../DashCard/DashCard';
import BlockTimeCard from '../BlockTimeCard/BlockTimeCard';
import TransactionsCard from '../TransactionsCard/TransactionsCard';
import PriceCard from '../PriceCard/PriceCard';
import ResponsiveComponent from '../ResponsiveComponent/ResponsiveComponent'
import { Breakpoints } from '../../utils/breakpoint';
import Constants from '../../constants';

const GridSection = styled(Grid)`
  && {
    padding-left: ${Constants.HOME_PAGE_MARGIN_SM_AND_UP + 'px'};
    padding-right: ${Constants.HOME_PAGE_MARGIN_SM_AND_UP + 'px'};
    transition: ${'padding ' + duration.standard + 'ms ' + easing.easeInOut};
    ${({ breakpoint }) =>
      breakpoint === Breakpoints.XS && `
        padding-left: ${Constants.HOME_PAGE_MARGIN_XS + 'px'};
        padding-right: ${Constants.HOME_PAGE_MARGIN_XS + 'px'};
      `
    }
  }
`;

const GridCard = styled(Grid)`
  && {
    padding-top: ${Constants.HOME_PAGE_MARGIN_SM_AND_UP + 'px'};
    ${({ breakpoint }) =>
      ((breakpoint === Breakpoints.XL || breakpoint === Breakpoints.LG) && `
        width: calc(25% - ${Constants.HOME_PAGE_MARGIN_SM_AND_UP*3/4 + 'px'});
      `) ||
      ((breakpoint === Breakpoints.MD || breakpoint === Breakpoints.SM) && `
        width: calc(50% - ${Constants.HOME_PAGE_MARGIN_SM_AND_UP/2 + 'px'});
      `) ||
      (breakpoint === Breakpoints.XS && `
        padding-top: ${Constants.HOME_PAGE_MARGIN_XS + 'px'};
        width: 100%;
      `)
    }
  }
`;

const GridTable = styled(Grid)`
  && {
    padding-top: ${Constants.HOME_PAGE_MARGIN_SM_AND_UP + 'px'};
    ${({ breakpoint }) =>
      ((breakpoint === Breakpoints.XL || breakpoint === Breakpoints.LG || breakpoint === Breakpoints.MD) && `
        width: calc(50% - ${Constants.HOME_PAGE_MARGIN_SM_AND_UP/2 + 'px'});
      `) ||
      ((breakpoint === Breakpoints.SM || breakpoint === Breakpoints.XS) && `
        width: 100%;
      `)
    }
  }
`;

const DashCardA = styled(DashCard)`
  && {
    background: ${props => props.theme.colorDashCardABackground};
    color: ${props => props.theme.colorDashCardText};
  }
`;

const BlockTimeCardB = styled(BlockTimeCard)`
  && {
    background: ${props => props.theme.colorDashCardBBackground};
    color: ${props => props.theme.colorDashCardText};
  }
`;

const TransactionsCardC = styled(TransactionsCard)`
  && {
    background: ${props => props.theme.colorDashCardCBackground};
    color: ${props => props.theme.colorDashCardText};
  }
`;

const PriceCardD = styled(PriceCard)`
  && {
    background: ${props => props.theme.colorDashCardDBackground};
    color: ${props => props.theme.colorDashCardText};
  }
`;

/**
 * Component for the home page.
 */
class HomePage extends ResponsiveComponent {
  static propTypes = {
    /**
     * The current Breakpoint, taking the desktop drawer (large screens) width into account.
     */    
    breakpoint: PropTypes.number.isRequired,
    /**
     * Reference to the <HashRouter> element.
     */
    routerRef: PropTypes.object
  };

  /**
   * Create a HomePage object.
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      blockHeight: 0
    };

    // Bind to make 'this' work in callbacks.
    this.handleAddNewBlock = this.handleAddNewBlock.bind(this);
  }
  
  /**
   * Return a reference to a React element to render into the DOM.
   * @return {Object} A reference to a React element to render into the DOM.
   * @public
   */
  render() {
    return (
      <div>
        {this.getSectionCards()}
        {this.getSectionTables()}
      </div>
    );
  }

  /**
   * Return the elements for the Cards section based on the current breakpoint.
   * @return {Object} The elements for the Cards section based on the current breakpoint.
   * @private
   */
  getSectionCards()
  {
    const { breakpoint } = this.props;
    const { blockHeight } = this.state;

    return (
      <GridSection container
        direction='row'
        justify='space-between'
        alignItems='center'
        breakpoint={breakpoint}
      >
        <GridCard item breakpoint={breakpoint}>
          <Fade
            timeout={500}
          >
            <DashCardA
              cardIndex={0}
              title='Blocks'
              value={blockHeight ? blockHeight.toLocaleString() : 'Loading...'}
              svgIconPath={Constants.ICON_SVG_PATH_BLOCK}
            />
          </Fade>
        </GridCard>
        <GridCard item breakpoint={breakpoint}>
          <Fade
            delay={50}
            timeout={500}
          >
            <BlockTimeCardB cardIndex={1} />
          </Fade>
        </GridCard>
        <GridCard item breakpoint={breakpoint}>
          <Fade
            delay={100}
            timeout={500}
          >
            <TransactionsCardC cardIndex={2} />
          </Fade>
        </GridCard>
        <GridCard item breakpoint={breakpoint}>
          <Fade
            delay={150}
            timeout={500}
          >
            <PriceCardD cardIndex={3} />
          </Fade>
        </GridCard>
      </GridSection>
    );
  }

  /**
   * Return the elements for the Tables section based on the current breakpoint.
   * @return {Object} The elements for the Tables section based on the current breakpoint.
   * @private
   */
  getSectionTables()
  {
    const { breakpoint, routerRef } = this.props;

    return (
      <GridSection container
        direction='row'
        justify='space-between'
        alignItems='center'
        breakpoint={breakpoint}
      >
        <GridTable item breakpoint={breakpoint}>
          <Fade
            timeout={500}
          >
            <BlocksTable
              maxRows={8}
              handleAddNewBlock={this.handleAddNewBlock}
              routerRef={routerRef}
            />
          </Fade>
        </GridTable>
        <GridTable item breakpoint={breakpoint}>
          <Fade
            delay={50}
            timeout={500}
          >
            <TransactionsTable maxRows={8} routerRef={routerRef} />
          </Fade>
        </GridTable>
      </GridSection>
    );
  }

  /**
   * Callback fired when a block is added.
   * @param {Object} block The block object being added.
   * @private
   */
  handleAddNewBlock(block) {
    this.setState({
      blockHeight: block.height
    });
  }
}

export default HomePage;